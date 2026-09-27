"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { UnauthorizedError } from "@/lib/api";
import { listAlimentos, createAlimento, updateAlimento, deleteAlimento } from "@/lib/alimentos-api";
import { Alimento, AlimentoFilters, AlimentoPayload } from "@/types/alimento";
import { TextField, ToggleField } from "@/components/form/fields";

const EMPTY_FORM: Partial<AlimentoPayload> = {
  nombre: "",
  grupo: "",
  region_especifica: "",
  disponible: true,
  porcion_g: "",
  calorias_kcal: "",
  proteina_g: "",
  carbohidratos_g: "",
  grasa_g: "",
  notas: "",
  unidad_casera: "",
  cantidad_casera: "",
  descripcion_casera: "",
};

function AlimentosScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [filters, setFilters] = useState<AlimentoFilters>({});

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<AlimentoPayload>>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<AlimentoPayload>>({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);

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
    setListError(null);
    try {
      const data = await listAlimentos(user?.token ?? null, filters);
      setItems(data);
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setListError(err instanceof Error ? err.message : "No se pudo cargar el catálogo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga/filtra el catálogo
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await createAlimento(user?.token ?? null, createForm);
      setCreateForm(EMPTY_FORM);
      setShowCreateForm(false);
      showToast("Alimento creado correctamente");
      await load();
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setCreateError(err instanceof Error ? err.message : "No se pudo crear el alimento.");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(item: Alimento) {
    setEditingId(item.id);
    setEditError(null);
    setEditForm({
      nombre: item.nombre,
      grupo: item.grupo,
      region_especifica: item.region_especifica,
      disponible: item.disponible,
      porcion_g: item.porcion_g,
      calorias_kcal: item.calorias_kcal,
      proteina_g: item.proteina_g,
      carbohidratos_g: item.carbohidratos_g,
      grasa_g: item.grasa_g,
      notas: item.notas,
      unidad_casera: item.unidad_casera,
      cantidad_casera: item.cantidad_casera,
      descripcion_casera: item.descripcion_casera,
    });
  }

  async function handleEditSubmit(id: number) {
    setSavingEdit(true);
    setEditError(null);
    try {
      await updateAlimento(user?.token ?? null, id, editForm);
      setEditingId(null);
      showToast("Alimento actualizado");
      await load();
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setEditError(err instanceof Error ? err.message : "No se pudo actualizar el alimento.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function toggleDisponible(item: Alimento) {
    try {
      await updateAlimento(user?.token ?? null, item.id, { disponible: !item.disponible });
      showToast(item.disponible ? `${item.nombre} marcado como no disponible` : `${item.nombre} marcado como disponible`);
      await load();
    } catch (err) {
      if (handleUnauthorized(err)) return;
      showToast(err instanceof Error ? err.message : "No se pudo actualizar la disponibilidad.");
    }
  }

  async function handleDelete(item: Alimento) {
    if (
      !window.confirm(
        `¿Eliminar "${item.nombre}" del catálogo? Esto lo borra por completo (los planes ya generados no se afectan). Si solo quieres quitarlo temporalmente, usa "Marcar no disponible" en vez de esto.`
      )
    )
      return;
    setDeletingId(item.id);
    try {
      await deleteAlimento(user?.token ?? null, item.id);
      showToast(`${item.nombre} eliminado`);
      await load();
    } catch (err) {
      if (handleUnauthorized(err)) return;
      showToast(err instanceof Error ? err.message : "No se pudo eliminar el alimento.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="w-full">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-space-sm bg-primary text-on-primary px-space-md py-space-sm rounded-xl shadow-xl">
          <span className="material-symbols-outlined text-title-md text-primary-fixed">check_circle</span>
          <span className="font-body text-label-lg">{toast}</span>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto px-gutter py-space-lg flex flex-col gap-space-lg">
        <div className="w-full bg-surface-container-low rounded-2xl p-space-lg shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs text-tertiary-container">
              <span className="material-symbols-outlined text-title-md">nutrition</span>
              <span className="font-body text-label-sm uppercase tracking-wider">
                Administración · Solo superadmin
              </span>
            </div>
            <h1 className="font-heading text-headline-lg text-primary tracking-tight">
              Catálogo de alimentos
            </h1>
            <p className="font-body text-body-md text-on-surface-variant">
              Alimenta el plan nutricional que ALUNA IA arma para cada caso.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm((v) => !v)}
            className="inline-flex items-center justify-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-body text-label-lg px-space-lg py-space-sm rounded-xl transition-colors shadow-md"
          >
            <span className="material-symbols-outlined text-title-md">
              {showCreateForm ? "close" : "add_circle"}
            </span>
            <span>{showCreateForm ? "Cancelar" : "Agregar alimento"}</span>
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
          <input
            type="text"
            placeholder="Nombre"
            value={filters.nombre ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, nombre: e.target.value }))}
            className="bg-surface-container-low text-on-surface font-body text-body-sm px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Grupo"
            value={filters.grupo ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, grupo: e.target.value }))}
            className="bg-surface-container-low text-on-surface font-body text-body-sm px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Región específica"
            value={filters.region_especifica ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, region_especifica: e.target.value }))}
            className="bg-surface-container-low text-on-surface font-body text-body-sm px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={filters.disponible ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, disponible: e.target.value }))}
            className="bg-surface-container-low text-on-surface font-body text-body-sm px-space-md py-space-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Disponibilidad: todas</option>
            <option value="1">Solo disponibles</option>
            <option value="0">Solo no disponibles</option>
          </select>
        </div>

        {showCreateForm && (
          <form
            onSubmit={handleCreateSubmit}
            className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md"
          >
            <h2 className="font-heading text-headline-md text-primary">Nuevo alimento</h2>
            <AlimentoFields value={createForm} onChange={setCreateForm} prefix="new" />
            {createError && (
              <p className="font-body text-body-sm text-error bg-error-container/40 rounded-lg px-space-md py-space-sm">
                {createError}
              </p>
            )}
            <button
              type="submit"
              disabled={creating}
              className="self-start inline-flex items-center justify-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-body text-label-lg px-space-lg py-space-sm rounded-lg transition-colors shadow-sm disabled:opacity-60"
            >
              {creating ? "Creando…" : "Crear alimento"}
            </button>
          </form>
        )}

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-space-lg font-body text-body-md text-on-surface-variant">Cargando catálogo…</p>
          ) : listError ? (
            <p className="p-space-lg font-body text-body-md text-error">{listError}</p>
          ) : items.length === 0 ? (
            <p className="p-space-lg font-body text-body-md text-on-surface-variant">
              No hay alimentos que coincidan con estos filtros.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container">
                  <tr>
                    {["Nombre", "Grupo", "Región", "Porción", "Kcal/porción", "Disponible", "Acciones"].map((h) => (
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
                  {items.map((item) => (
                    <Fragment key={item.id}>
                      <tr className="border-t border-outline-variant/40">
                        <td className="px-space-md py-space-sm font-body text-body-md text-on-surface">
                          {item.nombre}
                        </td>
                        <td className="px-space-md py-space-sm font-body text-body-sm text-on-surface-variant">
                          {item.grupo}
                        </td>
                        <td className="px-space-md py-space-sm font-body text-body-sm text-on-surface-variant">
                          {item.region_especifica || "—"}
                        </td>
                        <td className="px-space-md py-space-sm font-body text-body-sm text-on-surface-variant">
                          {item.porcion_texto}
                        </td>
                        <td className="px-space-md py-space-sm font-body text-body-sm text-on-surface-variant">
                          {item.calorias_por_porcion}
                        </td>
                        <td className="px-space-md py-space-sm">
                          <button
                            type="button"
                            onClick={() => toggleDisponible(item)}
                            className={`font-body text-label-sm px-space-sm py-1 rounded-full ${
                              item.disponible
                                ? "bg-status-ok-bg text-status-ok"
                                : "bg-surface-container-highest text-on-surface-variant"
                            }`}
                          >
                            {item.disponible ? "Disponible" : "No disponible"}
                          </button>
                        </td>
                        <td className="px-space-md py-space-sm">
                          <div className="flex items-center gap-space-xs flex-wrap">
                            <button
                              type="button"
                              onClick={() => (editingId === item.id ? setEditingId(null) : startEdit(item))}
                              className="font-body text-label-sm text-secondary hover:text-primary"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === item.id}
                              className="font-body text-label-sm text-error hover:opacity-80 disabled:opacity-50"
                            >
                              {deletingId === item.id ? "Eliminando…" : "Eliminar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {editingId === item.id && (
                        <tr className="bg-surface-container-low">
                          <td colSpan={7} className="px-space-md py-space-md">
                            <AlimentoFields value={editForm} onChange={setEditForm} prefix={`edit-${item.id}`} />
                            {editError && (
                              <p className="mt-space-sm font-body text-body-sm text-error">{editError}</p>
                            )}
                            <div className="flex items-center gap-space-sm mt-space-sm">
                              <button
                                type="button"
                                onClick={() => handleEditSubmit(item.id)}
                                disabled={savingEdit}
                                className="inline-flex items-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-body text-label-lg px-space-md py-space-xs rounded-lg transition-colors disabled:opacity-60"
                              >
                                {savingEdit ? "Guardando…" : "Guardar cambios"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="font-body text-label-lg text-on-surface-variant hover:text-on-surface"
                              >
                                Cancelar
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AlimentoFields({
  value,
  onChange,
  prefix,
}: {
  value: Partial<AlimentoPayload>;
  onChange: (updater: (f: Partial<AlimentoPayload>) => Partial<AlimentoPayload>) => void;
  prefix: string;
}) {
  function set<K extends keyof AlimentoPayload>(key: K, v: AlimentoPayload[K]) {
    onChange((f) => ({ ...f, [key]: v }));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
      <TextField
        id={`${prefix}-nombre`}
        label="Nombre"
        required
        value={value.nombre ?? ""}
        onChange={(v) => set("nombre", v)}
        className="md:col-span-4"
      />
      <TextField
        id={`${prefix}-grupo`}
        label="Grupo"
        value={value.grupo ?? ""}
        onChange={(v) => set("grupo", v)}
        placeholder="ej. cereales, proteínas, frutas"
        className="md:col-span-4"
      />
      <TextField
        id={`${prefix}-region`}
        label="Región específica"
        value={value.region_especifica ?? ""}
        onChange={(v) => set("region_especifica", v)}
        placeholder="ej. Sierra Nevada / Kogui"
        className="md:col-span-4"
      />
      <TextField
        id={`${prefix}-porcion`}
        label="Porción (g)"
        type="number"
        value={value.porcion_g ?? ""}
        onChange={(v) => set("porcion_g", v)}
        className="md:col-span-3"
      />
      <TextField
        id={`${prefix}-kcal`}
        label="Calorías (kcal)"
        type="number"
        value={value.calorias_kcal ?? ""}
        onChange={(v) => set("calorias_kcal", v)}
        className="md:col-span-3"
      />
      <TextField
        id={`${prefix}-proteina`}
        label="Proteína (g)"
        type="number"
        value={value.proteina_g ?? ""}
        onChange={(v) => set("proteina_g", v)}
        className="md:col-span-2"
      />
      <TextField
        id={`${prefix}-carbs`}
        label="Carbohidratos (g)"
        type="number"
        value={value.carbohidratos_g ?? ""}
        onChange={(v) => set("carbohidratos_g", v)}
        className="md:col-span-2"
      />
      <TextField
        id={`${prefix}-grasa`}
        label="Grasa (g)"
        type="number"
        value={value.grasa_g ?? ""}
        onChange={(v) => set("grasa_g", v)}
        className="md:col-span-2"
      />
      <TextField
        id={`${prefix}-unidad-casera`}
        label="Unidad casera"
        value={value.unidad_casera ?? ""}
        onChange={(v) => set("unidad_casera", v)}
        placeholder="ej. taza, cucharada"
        className="md:col-span-4"
      />
      <TextField
        id={`${prefix}-cantidad-casera`}
        label="Cantidad casera"
        type="number"
        value={value.cantidad_casera ?? ""}
        onChange={(v) => set("cantidad_casera", v)}
        className="md:col-span-3"
      />
      <TextField
        id={`${prefix}-descripcion-casera`}
        label="Descripción casera"
        value={value.descripcion_casera ?? ""}
        onChange={(v) => set("descripcion_casera", v)}
        placeholder="ej. 1 taza rasa"
        className="md:col-span-5"
      />
      <TextField
        id={`${prefix}-notas`}
        label="Notas"
        value={value.notas ?? ""}
        onChange={(v) => set("notas", v)}
        className="md:col-span-12"
      />
      <ToggleField
        id={`${prefix}-disponible`}
        title="Disponible en el catálogo"
        description="Si se desactiva, ALUNA IA deja de sugerirlo en los planes nutricionales sin borrar su configuración."
        checked={value.disponible ?? true}
        onChange={(v) => set("disponible", v)}
        className="md:col-span-12"
      />
    </div>
  );
}

export default function AlimentosPage() {
  return (
    <AuthGuard requireRole="superadmin">
      <AlimentosScreen />
    </AuthGuard>
  );
}
