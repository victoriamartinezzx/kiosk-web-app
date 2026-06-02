export const API_BASE = "http://localhost:4002";

export function apiUrl(path) {
  if (!path) return API_BASE;
  return API_BASE + (path.startsWith("/") ? path : `/${path}`);
}


export async function getContactInfo() {
  const res = await fetch(apiUrl('/contact/info'));
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`GET /contact/info failed: ${res.status} ${txt}`);
  }
  return await res.json();
}

export async function searchProducts(query) {
  const params = new URLSearchParams();
  if (query && query.trim()) {
    params.append('q', query.trim());
  }
  
  const res = await fetch(apiUrl(`/products/search?${params.toString()}`));
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`GET /products/search failed: ${res.status} ${txt}`);
  }
  return await res.json();
}
