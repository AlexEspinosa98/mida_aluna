import type { UserRole } from "@/types/user";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

export class UnauthorizedError extends Error {
  constructor() {
    super("No autorizado");
    this.name = "UnauthorizedError";
  }
}

function requireApiBase(): string {
  if (!API_BASE) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL no está configurada. Revisa .env.local (ver .env.example)."
    );
  }
  return API_BASE;
}

/** fetch autenticado: agrega `Authorization: Token <token>` y normaliza 401. */
export async function apiFetch(path: string, token: string | null, init: RequestInit = {}) {
  const base = requireApiBase();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Token ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  let res: Response;
  try {
    res = await fetch(`${base}${path}`, { ...init, headers });
  } catch {
    throw new Error(
      "No se pudo contactar al servidor (red caída o el backend no permite peticiones desde este origen)."
    );
  }
  if (res.status === 401) throw new UnauthorizedError();
  return res;
}

/** Convierte un error de validación de DRF ({campo: [msg]} o {detail: msg}) en un mensaje legible. */
export async function extractErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.detail === "string") return body.detail;
    const fieldErrors = Object.entries(body)
      .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(" ") : msgs}`)
      .join(" · ");
    return fieldErrors || fallback;
  } catch {
    return fallback;
  }
}

/**
 * Descarga un PDF protegido por token como blob y devuelve una object URL para abrirlo,
 * porque un <a href> normal no puede llevar el header Authorization.
 */
export async function fetchAuthenticatedPdf(url: string, token: string | null): Promise<string> {
  const headers = new Headers();
  if (token) headers.set("Authorization", `Token ${token}`);
  let res: Response;
  try {
    res = await fetch(url, { headers });
  } catch {
    throw new Error("No se pudo contactar al servidor para descargar el PDF.");
  }
  if (res.status === 401) throw new UnauthorizedError();
  if (!res.ok) throw new Error(`No se pudo descargar el PDF (HTTP ${res.status})`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/** Dispara la descarga de una object URL (blob:) como archivo, sin abrir pestaña nueva. */
export function triggerBlobDownload(blobUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export interface LoginResponse {
  token: string;
  username: string;
  nombre: string;
  rol: UserRole;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const base = requireApiBase();
  let res: Response;
  try {
    res = await fetch(`${base}/api/v1/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error(
      "No se pudo contactar al servidor (red caída o el backend no permite peticiones desde este origen)."
    );
  }
  if (!res.ok) {
    if (res.status === 401 || res.status === 400) {
      throw new Error("Usuario o contraseña incorrectos.");
    }
    throw new Error(`No se pudo iniciar sesión (HTTP ${res.status})`);
  }
  return res.json();
}
