import { apiFetch, extractErrorMessage } from "@/lib/api";
import { Alimento, AlimentoFilters, AlimentoPayload } from "@/types/alimento";

export async function listAlimentos(token: string | null, filters: AlimentoFilters): Promise<Alimento[]> {
  const params = new URLSearchParams();
  if (filters.grupo) params.set("grupo", filters.grupo);
  if (filters.region_especifica) params.set("region_especifica", filters.region_especifica);
  if (filters.disponible) params.set("disponible", filters.disponible);
  if (filters.nombre) params.set("nombre", filters.nombre);

  const qs = params.toString();
  const res = await apiFetch(`/api/v1/nutricion/alimentos/${qs ? `?${qs}` : ""}`, token);
  if (!res.ok) throw new Error(await extractErrorMessage(res, "No se pudo cargar el catálogo de alimentos."));
  const data = await res.json();
  return Array.isArray(data) ? data : data.results;
}

export async function createAlimento(token: string | null, payload: Partial<AlimentoPayload>): Promise<Alimento> {
  const res = await apiFetch("/api/v1/nutricion/alimentos/", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractErrorMessage(res, "No se pudo crear el alimento."));
  return res.json();
}

export async function updateAlimento(
  token: string | null,
  id: number,
  payload: Partial<AlimentoPayload>
): Promise<Alimento> {
  const res = await apiFetch(`/api/v1/nutricion/alimentos/${id}/`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractErrorMessage(res, "No se pudo actualizar el alimento."));
  return res.json();
}

export async function deleteAlimento(token: string | null, id: number): Promise<void> {
  const res = await apiFetch(`/api/v1/nutricion/alimentos/${id}/`, token, { method: "DELETE" });
  if (!res.ok) throw new Error(await extractErrorMessage(res, "No se pudo eliminar el alimento."));
}
