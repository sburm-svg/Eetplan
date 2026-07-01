/**
 * Thin fetch wrapper. Kanen currently runs entirely on local data
 * (see data/recipes.js), so nothing calls this yet — but every future
 * network call (favorites sync, remote recipe catalogue, auth, ...)
 * should go through here so there's a single place to add base URLs,
 * headers, retries and error handling.
 */
const BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? "";

async function request(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${method} ${path} failed: ${res.status} ${text}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  return contentType.includes("application/json") ? res.json() : res.text();
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
