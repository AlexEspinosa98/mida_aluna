"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { UnauthorizedError, fetchAuthenticatedPdf, triggerBlobDownload } from "@/lib/api";
import { listEvaluaciones, PAGE_SIZE } from "@/lib/evaluaciones-api";
import { EvaluacionListFilters, EvaluacionListItem, PaginatedResponse } from "@/types/evaluacion-list";

const ESTADO_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "pendiente", label: "Pendiente" },
  { value: "procesando", label: "Procesando" },
  { value: "completada", label: "Completada" },
  { value: "error", label: "Error" },
];

function alertLevelClasses(nivel: string | null) {
  const n = (nivel ?? "").toLowerCase();
  if (n.includes("crit") || n.includes("severo")) return "bg-status-critical-bg text-status-critical";
  if (n.includes("vigil") || n.includes("moder") || n.includes("alerta")) return "bg-status-watch-bg text-status-watch";
  if (!n) return "bg-surface-container-highest text-on-surface-variant";
  return "bg-status-ok-bg text-status-ok";
}

function DashboardScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [filters, setFilters] = useState<EvaluacionListFilters>({ page: 1 });
  const [data, setData] = useState<PaginatedResponse<EvaluacionListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }

  function handleUnauthorized(err: unknown): boolean {
    if (err instanceof UnauthorizedError) {
      logout();
      router.replace("/medical-access");
      return true;
    }
    return false;
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await listEvaluaciones(user?.token ?? null, filters);
      setData(res);
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setError(err instanceof Error ? err.message : "No se pudo cargar el listado.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga de datos al montar/filtrar
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  function updateFilter<K extends keyof EvaluacionListFilters>(key: K, value: EvaluacionListFilters[K]) {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  }

  async function handleDownload(row: EvaluacionListItem, kind: "tecnico" | "familiar") {
    const url = kind === "tecnico" ? row.reporte_pdf_url : row.reporte_familiar_pdf_url;
    if (!url) return;
    setDownloadingId(`${row.id}-${kind}`);
    try {
      const blobUrl = await fetchAuthenticatedPdf(url, user?.token ?? null);
      triggerBlobDownload(blobUrl, `mida-reporte-${kind}-${row.codigo_caso}.pdf`);
    } catch (err) {
      if (handleUnauthorized(err)) return;
      showToast(err instanceof Error ? err.message : "No se pudo descargar el PDF.");
    } finally {
      setDownloadingId(null);
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.count / PAGE_SIZE)) : 1;
  const currentPage = filters.page ?? 1;

  return (
    <div className="w-full max-w-6xl mx-auto px-gutter py-space-lg flex flex-col gap-space-lg">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-space-sm bg-primary text-on-primary px-space-md py-space-sm rounded-xl shadow-xl">
          <span className="material-symbols-outlined text-title-md text-primary-fixed">info</span>
          <span className="font-body text-label-lg">{toast}</span>
        </div>
      )}

      <div className="w-full bg-surface-container-low rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-xs">
        <div className="flex items-center gap-space-xs text-tertiary-container">
          <span className="material-symbols-outlined text-title-md">monitoring</span>
          <span className="font-body text-label-sm uppercase tracking-wider">
            {user?.rol === "superadmin" ? "Todos los casos (superadmin)" : "Tus casos registrados"}
          </span>
        </div>
        <h1 className="font-heading text-headline-lg text-primary tracking-tight">
          Dashboard de evaluaciones
        </h1>
        <p className="font-body text-body-md text-on-surface-variant">
          {data ? `${data.count} evaluaciones encontradas` : "Cargando…"}
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-space-sm">
        <input
          type="text"
          placeholder="Código de caso"
          value={filters.codigo_caso ?? ""}
          onChange={(e) => updateFilter("codigo_caso", e.target.value)}
          className="bg-surface-container-low text-on-surface font-body text-body-sm px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          placeholder="Nombre del paciente"
          value={filters.paciente ?? ""}
          onChange={(e) => updateFilter("paciente", e.target.value)}
          className="bg-surface-container-low text-on-surface font-body text-body-sm px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={filters.estado ?? ""}
          onChange={(e) => updateFilter("estado", e.target.value)}
          className="bg-surface-container-low text-on-surface font-body text-body-sm px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {ESTADO_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={filters.alerta_critica ?? ""}
          onChange={(e) => updateFilter("alerta_critica", e.target.value)}
          className="bg-surface-container-low text-on-surface font-body text-body-sm px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Alerta crítica: todas</option>
          <option value="true">Solo con alerta crítica</option>
          <option value="false">Sin alerta crítica</option>
        </select>
        <input
          type="date"
          value={filters.fecha_desde ?? ""}
          onChange={(e) => updateFilter("fecha_desde", e.target.value)}
          className="bg-surface-container-low text-on-surface font-body text-body-sm px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="date"
          value={filters.fecha_hasta ?? ""}
          onChange={(e) => updateFilter("fecha_hasta", e.target.value)}
          className="bg-surface-container-low text-on-surface font-body text-body-sm px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-space-lg font-body text-body-md text-on-surface-variant">Cargando evaluaciones…</p>
        ) : error ? (
          <p className="p-space-lg font-body text-body-md text-error">{error}</p>
        ) : !data || data.results.length === 0 ? (
          <p className="p-space-lg font-body text-body-md text-on-surface-variant">
            No hay evaluaciones que coincidan con estos filtros.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container">
                <tr>
                  {["Código", "Paciente", "Etnia", "Fecha", "Estado", "Alerta", "Reportes"].map((h) => (
                    <th
                      key={h}
                      className="px-space-md py-space-sm font-body text-label-sm uppercase tracking-wider text-on-surface-variant"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.results.map((row) => (
                  <tr key={row.id} className="border-t border-outline-variant/40">
                    <td className="px-space-md py-space-sm font-body text-body-sm text-on-surface">
                      {row.codigo_caso}
                    </td>
                    <td className="px-space-md py-space-sm font-body text-body-sm text-on-surface">
                      {row.paciente_nombre}
                    </td>
                    <td className="px-space-md py-space-sm font-body text-body-sm text-on-surface-variant capitalize">
                      {row.paciente_etnia}
                    </td>
                    <td className="px-space-md py-space-sm font-body text-body-sm text-on-surface-variant">
                      {row.fecha_evaluacion}
                    </td>
                    <td className="px-space-md py-space-sm font-body text-body-sm text-on-surface-variant capitalize">
                      {row.estado}
                    </td>
                    <td className="px-space-md py-space-sm">
                      {row.alerta_critica ? (
                        <span className="px-space-sm py-1 rounded-full bg-status-critical-bg text-status-critical font-body text-label-sm">
                          Crítica
                        </span>
                      ) : (
                        <span
                          className={`px-space-sm py-1 rounded-full font-body text-label-sm ${alertLevelClasses(row.nivel_alerta_maximo)}`}
                        >
                          {row.nivel_alerta_maximo ?? "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-space-md py-space-sm">
                      <div className="flex items-center gap-space-xs flex-wrap">
                        <button
                          type="button"
                          disabled={!row.reporte_pdf_url || downloadingId === `${row.id}-tecnico`}
                          onClick={() => handleDownload(row, "tecnico")}
                          className="font-body text-label-sm text-secondary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {downloadingId === `${row.id}-tecnico` ? "Descargando…" : "Técnico"}
                        </button>
                        <button
                          type="button"
                          disabled={!row.reporte_familiar_pdf_url || downloadingId === `${row.id}-familiar`}
                          onClick={() => handleDownload(row, "familiar")}
                          className="font-body text-label-sm text-secondary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {downloadingId === `${row.id}-familiar` ? "Descargando…" : "Familiar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {data && data.count > PAGE_SIZE && (
        <div className="flex items-center justify-between font-body text-body-sm text-on-surface-variant">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: currentPage - 1 }))}
            className="px-space-md py-space-xs rounded-lg bg-surface-container-lowest shadow-sm disabled:opacity-40"
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setFilters((f) => ({ ...f, page: currentPage + 1 }))}
            className="px-space-md py-space-xs rounded-lg bg-surface-container-lowest shadow-sm disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardScreen />
    </AuthGuard>
  );
}
