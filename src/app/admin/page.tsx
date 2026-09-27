"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { UnauthorizedError } from "@/lib/api";
import {
  listUsers,
  createUser,
  updateUser,
  deactivateUser,
  changeUserPassword,
} from "@/lib/admin-api";
import { AdminUser, CreateUserPayload, UpdateUserPayload, UserRole } from "@/types/user";
import { TextField, SelectField, ToggleField } from "@/components/form/fields";

const ROL_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "medico", label: "Médico" },
  { value: "superadmin", label: "Superadmin" },
];

const EMPTY_CREATE_FORM: CreateUserPayload = {
  username: "",
  password: "",
  email: "",
  first_name: "",
  last_name: "",
  rol: "medico",
};

function AdminUsersScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserPayload>(EMPTY_CREATE_FORM);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<UpdateUserPayload>({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [passwordId, setPasswordId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [deactivatingId, setDeactivatingId] = useState<number | null>(null);

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

  async function loadUsers() {
    setLoadingList(true);
    setListError(null);
    try {
      const data = await listUsers(user?.token ?? null);
      setUsers(data);
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setListError(err instanceof Error ? err.message : "No se pudo cargar la lista de usuarios.");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de la lista al montar
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await createUser(user?.token ?? null, createForm);
      setCreateForm(EMPTY_CREATE_FORM);
      setShowCreateForm(false);
      showToast("Usuario creado correctamente");
      await loadUsers();
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setCreateError(err instanceof Error ? err.message : "No se pudo crear el usuario.");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(u: AdminUser) {
    setPasswordId(null);
    setEditingId(u.id);
    setEditError(null);
    setEditForm({
      email: u.email,
      first_name: u.first_name,
      last_name: u.last_name,
      rol: u.rol,
      is_active: u.is_active,
    });
  }

  async function handleEditSubmit(id: number) {
    setSavingEdit(true);
    setEditError(null);
    try {
      await updateUser(user?.token ?? null, id, editForm);
      setEditingId(null);
      showToast("Usuario actualizado");
      await loadUsers();
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setEditError(err instanceof Error ? err.message : "No se pudo actualizar el usuario.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDeactivate(u: AdminUser) {
    if (!window.confirm(`¿Desactivar a ${u.username}? Podrá reactivarse editando su estado.`)) return;
    setDeactivatingId(u.id);
    try {
      await deactivateUser(user?.token ?? null, u.id);
      showToast(`${u.username} desactivado`);
      await loadUsers();
    } catch (err) {
      if (handleUnauthorized(err)) return;
      showToast(err instanceof Error ? err.message : "No se pudo desactivar el usuario.");
    } finally {
      setDeactivatingId(null);
    }
  }

  function startPasswordChange(id: number) {
    setEditingId(null);
    setPasswordId(id);
    setNewPassword("");
    setPasswordError(null);
  }

  async function handlePasswordSubmit(id: number) {
    setChangingPassword(true);
    setPasswordError(null);
    try {
      await changeUserPassword(user?.token ?? null, id, newPassword);
      setPasswordId(null);
      showToast("Contraseña actualizada. La sesión anterior de ese usuario quedó invalidada.");
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setPasswordError(err instanceof Error ? err.message : "No se pudo cambiar la contraseña.");
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <div className="w-full">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-space-sm bg-primary text-on-primary px-space-md py-space-sm rounded-xl shadow-xl">
          <span className="material-symbols-outlined text-title-md text-primary-fixed">
            check_circle
          </span>
          <span className="font-body text-label-lg">{toast}</span>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto px-gutter py-space-lg flex flex-col gap-space-lg">
        <div className="w-full bg-surface-container-low rounded-2xl p-space-lg shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs text-tertiary-container">
              <span className="material-symbols-outlined text-title-md">admin_panel_settings</span>
              <span className="font-body text-label-sm uppercase tracking-wider">
                Administración · Solo superadmin
              </span>
            </div>
            <h1 className="font-heading text-headline-lg text-primary tracking-tight">
              Usuarios médicos
            </h1>
            <p className="font-body text-body-md text-on-surface-variant">
              Crea, edita, desactiva y restablece contraseñas de las cuentas que acceden a MIDA.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateForm((v) => !v)}
            className="inline-flex items-center justify-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-body text-label-lg px-space-lg py-space-sm rounded-xl transition-colors shadow-md"
          >
            <span className="material-symbols-outlined text-title-md">
              {showCreateForm ? "close" : "person_add"}
            </span>
            <span>{showCreateForm ? "Cancelar" : "Crear usuario"}</span>
          </button>
        </div>

        {showCreateForm && (
          <form
            onSubmit={handleCreateSubmit}
            className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md"
          >
            <h2 className="font-heading text-headline-md text-primary">Nuevo usuario</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
              <TextField
                id="new-username"
                label="Usuario"
                required
                value={createForm.username}
                onChange={(v) => setCreateForm((f) => ({ ...f, username: v }))}
                className="md:col-span-4"
              />
              <TextField
                id="new-password"
                label="Contraseña inicial"
                type="text"
                required
                value={createForm.password}
                onChange={(v) => setCreateForm((f) => ({ ...f, password: v }))}
                className="md:col-span-4"
              />
              <SelectField
                id="new-rol"
                label="Rol"
                value={createForm.rol}
                onChange={(v) => setCreateForm((f) => ({ ...f, rol: v as UserRole }))}
                options={ROL_OPTIONS}
                className="md:col-span-4"
              />
              <TextField
                id="new-email"
                label="Email"
                type="text"
                required
                value={createForm.email}
                onChange={(v) => setCreateForm((f) => ({ ...f, email: v }))}
                className="md:col-span-4"
              />
              <TextField
                id="new-first-name"
                label="Nombres"
                required
                value={createForm.first_name}
                onChange={(v) => setCreateForm((f) => ({ ...f, first_name: v }))}
                className="md:col-span-4"
              />
              <TextField
                id="new-last-name"
                label="Apellidos"
                required
                value={createForm.last_name}
                onChange={(v) => setCreateForm((f) => ({ ...f, last_name: v }))}
                className="md:col-span-4"
              />
            </div>
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
              {creating ? "Creando…" : "Crear usuario"}
            </button>
          </form>
        )}

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
          {loadingList ? (
            <p className="p-space-lg font-body text-body-md text-on-surface-variant">Cargando usuarios…</p>
          ) : listError ? (
            <p className="p-space-lg font-body text-body-md text-error">{listError}</p>
          ) : users.length === 0 ? (
            <p className="p-space-lg font-body text-body-md text-on-surface-variant">
              Todavía no hay usuarios registrados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container">
                  <tr>
                    {["Usuario", "Nombre", "Email", "Rol", "Estado", "Acciones"].map((h) => (
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
                  {users.map((u) => (
                    <Fragment key={u.id}>
                      <tr className="border-t border-outline-variant/40">
                        <td className="px-space-md py-space-sm font-body text-body-md text-on-surface">
                          {u.username}
                        </td>
                        <td className="px-space-md py-space-sm font-body text-body-md text-on-surface">
                          {u.first_name} {u.last_name}
                        </td>
                        <td className="px-space-md py-space-sm font-body text-body-sm text-on-surface-variant">
                          {u.email}
                        </td>
                        <td className="px-space-md py-space-sm font-body text-body-sm text-on-surface-variant capitalize">
                          {u.rol}
                        </td>
                        <td className="px-space-md py-space-sm">
                          <span
                            className={`font-body text-label-sm px-space-sm py-1 rounded-full ${
                              u.is_active
                                ? "bg-status-ok-bg text-status-ok"
                                : "bg-surface-container-highest text-on-surface-variant"
                            }`}
                          >
                            {u.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-space-md py-space-sm">
                          <div className="flex items-center gap-space-xs flex-wrap">
                            <button
                              type="button"
                              onClick={() => (editingId === u.id ? setEditingId(null) : startEdit(u))}
                              className="font-body text-label-sm text-secondary hover:text-primary"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                passwordId === u.id ? setPasswordId(null) : startPasswordChange(u.id)
                              }
                              className="font-body text-label-sm text-secondary hover:text-primary"
                            >
                              Cambiar contraseña
                            </button>
                            {u.is_active && (
                              <button
                                type="button"
                                onClick={() => handleDeactivate(u)}
                                disabled={deactivatingId === u.id}
                                className="font-body text-label-sm text-error hover:opacity-80 disabled:opacity-50"
                              >
                                {deactivatingId === u.id ? "Desactivando…" : "Desactivar"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {editingId === u.id && (
                        <tr className="bg-surface-container-low">
                          <td colSpan={6} className="px-space-md py-space-md">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
                              <TextField
                                id={`edit-email-${u.id}`}
                                label="Email"
                                value={editForm.email ?? ""}
                                onChange={(v) => setEditForm((f) => ({ ...f, email: v }))}
                                className="md:col-span-4"
                              />
                              <TextField
                                id={`edit-first-${u.id}`}
                                label="Nombres"
                                value={editForm.first_name ?? ""}
                                onChange={(v) => setEditForm((f) => ({ ...f, first_name: v }))}
                                className="md:col-span-3"
                              />
                              <TextField
                                id={`edit-last-${u.id}`}
                                label="Apellidos"
                                value={editForm.last_name ?? ""}
                                onChange={(v) => setEditForm((f) => ({ ...f, last_name: v }))}
                                className="md:col-span-3"
                              />
                              <SelectField
                                id={`edit-rol-${u.id}`}
                                label="Rol"
                                value={editForm.rol ?? u.rol}
                                onChange={(v) => setEditForm((f) => ({ ...f, rol: v as UserRole }))}
                                options={ROL_OPTIONS}
                                className="md:col-span-2"
                              />
                              <ToggleField
                                id={`edit-active-${u.id}`}
                                title="Cuenta activa"
                                description="Si se desactiva, el usuario no podrá iniciar sesión."
                                checked={editForm.is_active ?? u.is_active}
                                onChange={(v) => setEditForm((f) => ({ ...f, is_active: v }))}
                                className="md:col-span-12"
                              />
                            </div>
                            {editError && (
                              <p className="mt-space-sm font-body text-body-sm text-error">{editError}</p>
                            )}
                            <div className="flex items-center gap-space-sm mt-space-sm">
                              <button
                                type="button"
                                onClick={() => handleEditSubmit(u.id)}
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
                      {passwordId === u.id && (
                        <tr className="bg-surface-container-low">
                          <td colSpan={6} className="px-space-md py-space-md">
                            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-space-sm">
                              <TextField
                                id={`new-password-${u.id}`}
                                label={`Nueva contraseña para ${u.username}`}
                                required
                                value={newPassword}
                                onChange={setNewPassword}
                                className="w-full sm:w-80"
                              />
                              <button
                                type="button"
                                onClick={() => handlePasswordSubmit(u.id)}
                                disabled={changingPassword || newPassword.length === 0}
                                className="inline-flex items-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-body text-label-lg px-space-md py-space-sm rounded-lg transition-colors disabled:opacity-60"
                              >
                                {changingPassword ? "Guardando…" : "Confirmar"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setPasswordId(null)}
                                className="font-body text-label-lg text-on-surface-variant hover:text-on-surface"
                              >
                                Cancelar
                              </button>
                            </div>
                            {passwordError && (
                              <p className="mt-space-sm font-body text-body-sm text-error">{passwordError}</p>
                            )}
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

export default function AdminPage() {
  return (
    <AuthGuard requireRole="superadmin">
      <AdminUsersScreen />
    </AuthGuard>
  );
}
