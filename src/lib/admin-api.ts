import { apiFetch, extractErrorMessage } from "@/lib/api";
import { AdminUser, CreateUserPayload, UpdateUserPayload } from "@/types/user";

export async function listUsers(token: string | null): Promise<AdminUser[]> {
  const res = await apiFetch("/api/v1/usuarios/", token);
  if (!res.ok) throw new Error(await extractErrorMessage(res, "No se pudo cargar la lista de usuarios."));
  const data = await res.json();
  return Array.isArray(data) ? data : data.results;
}

export async function createUser(token: string | null, payload: CreateUserPayload): Promise<AdminUser> {
  const res = await apiFetch("/api/v1/usuarios/", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractErrorMessage(res, "No se pudo crear el usuario."));
  return res.json();
}

export async function updateUser(
  token: string | null,
  id: number,
  payload: UpdateUserPayload
): Promise<AdminUser> {
  const res = await apiFetch(`/api/v1/usuarios/${id}/`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractErrorMessage(res, "No se pudo actualizar el usuario."));
  return res.json();
}

export async function deactivateUser(token: string | null, id: number): Promise<void> {
  const res = await apiFetch(`/api/v1/usuarios/${id}/`, token, { method: "DELETE" });
  if (!res.ok) throw new Error(await extractErrorMessage(res, "No se pudo desactivar el usuario."));
}

export async function changeUserPassword(
  token: string | null,
  id: number,
  password: string
): Promise<void> {
  const res = await apiFetch(`/api/v1/usuarios/${id}/cambiar-password/`, token, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error(await extractErrorMessage(res, "No se pudo cambiar la contraseña."));
}
