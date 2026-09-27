import { apiFetch, extractErrorMessage } from "@/lib/api";
import { EvaluacionListFilters, EvaluacionListItem, PaginatedResponse } from "@/types/evaluacion-list";

const PAGE_SIZE = 20;

export async function listEvaluaciones(
  token: string | null,
  filters: EvaluacionListFilters
): Promise<PaginatedResponse<EvaluacionListItem>> {
  const params = new URLSearchParams();
  if (filters.estado) params.set("estado", filters.estado);
  if (filters.alerta_critica) params.set("alerta_critica", filters.alerta_critica);
  if (filters.codigo_caso) params.set("codigo_caso", filters.codigo_caso);
  if (filters.paciente) params.set("paciente", filters.paciente);
  if (filters.fecha_desde) params.set("fecha_desde", filters.fecha_desde);
  if (filters.fecha_hasta) params.set("fecha_hasta", filters.fecha_hasta);
  params.set("page", String(filters.page ?? 1));
  params.set("page_size", String(PAGE_SIZE));

  const res = await apiFetch(`/api/v1/evaluaciones/?${params.toString()}`, token);
  if (!res.ok) throw new Error(await extractErrorMessage(res, "No se pudo cargar el listado de evaluaciones."));
  return res.json();
}

export { PAGE_SIZE };
