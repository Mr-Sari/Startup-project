/**
 * Resolve API paths. By default calls are same-origin ("/api/..."). A static
 * preview build can set `window.__MISHWAR_API__` to point at a remote backend.
 */
export function apiUrl(path: string): string {
  if (typeof window !== "undefined") {
    const base = (window as unknown as { __MISHWAR_API__?: string }).__MISHWAR_API__;
    if (typeof base === "string" && base && !base.startsWith("__PORT_")) {
      return `${base.replace(/\/$/, "")}${path}`;
    }
  }
  return path;
}
