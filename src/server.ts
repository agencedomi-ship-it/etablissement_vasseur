import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { lieuDepuisGeoId } from "./lib/geo-serveur";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

// /api/geo?loc=<Geo Target ID Google Ads> → { lieu: { geoId, ville, departementNumero, departementNom } | null }.
// Simple lecture de la table locale : la réponse ne dépend que de l'ID, elle peut donc être mise en cache.
function geoResponse(params: URLSearchParams): Response {
  return new Response(JSON.stringify({ lieu: lieuDepuisGeoId(params.get("loc")) }), {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
}

const DOMAINE = "serrurier-vantory.fr";

// En-têtes de sécurité sur les pages et l'API (les fichiers statiques les reçoivent via public/_headers).
// Les adresses techniques (workers.dev, aperçus) sont exclues des moteurs de recherche : seul le domaine compte.
function securiser(reponse: Response, hote: string): Response {
  const r = new Response(reponse.body, reponse);
  r.headers.set("X-Content-Type-Options", "nosniff");
  r.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  r.headers.set("X-Frame-Options", "SAMEORIGIN");
  r.headers.set("Permissions-Policy", "geolocation=(), camera=(), microphone=(), payment=()");
  if (hote === DOMAINE) r.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  else if (hote !== "localhost") r.headers.set("X-Robots-Tag", "noindex, nofollow");
  return r;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);
    // http:// → https://, et www → domaine nu, en une seule redirection.
    if (url.hostname.endsWith(DOMAINE) && (url.protocol === "http:" || url.hostname.startsWith("www."))) {
      url.protocol = "https:";
      url.hostname = DOMAINE;
      return Response.redirect(url.toString(), 301);
    }
    if (url.pathname === "/api/geo") return securiser(geoResponse(url.searchParams), url.hostname);
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return securiser(await normalizeCatastrophicSsrResponse(response), url.hostname);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
