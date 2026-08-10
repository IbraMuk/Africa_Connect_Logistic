"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  KeyIcon,
  ShieldCheckIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Tab = "users" | "roles" | "permissions";

export default function AdministrationPage() {
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [loading, setLoading] = useState(false);

  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userForm, setUserForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    role: "client",
    statut: "actif",
    password: "",
  });

  // Roles
  const [roles, setRoles] = useState<any[]>([]);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [roleForm, setRoleForm] = useState({ nom: "", description: "" });
  const [selectedRole, setSelectedRole] = useState<any | null>(null);

  // Permissions
  const [permissions, setPermissions] = useState<any[]>([]);
  const [editingPermission, setEditingPermission] = useState<any | null>(null);
  const [permissionForm, setPermissionForm] = useState({
    nom: "",
    code: "",
    description: "",
  });
  const [permissionToAssign, setPermissionToAssign] = useState<number | "">("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, r, p] = await Promise.all([
        fetch(`${API_URL}/admin/users`).then((res) => res.json()),
        fetch(`${API_URL}/admin/roles`).then((res) => res.json()),
        fetch(`${API_URL}/admin/permissions`).then((res) => res.json()),
      ]);
      if (u.success) setUsers(u.data || []);
      if (r.success) setRoles(r.data || []);
      if (p.success) setPermissions(p.data || []);
    } catch (error) {
      console.error("Erreur chargement admin:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ========== API helpers ==========
  const apiPost = async (path: string, body: any) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  const apiPut = async (path: string, body: any) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  const apiDelete = async (path: string) => {
    const res = await fetch(`${API_URL}${path}`, { method: "DELETE" });
    return res.json();
  };

  // ========== Users ==========
  const resetUserForm = () => {
    setUserForm({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      role: "client",
      statut: "actif",
      password: "",
    });
    setEditingUser(null);
  };

  const saveUser = async () => {
    if (!userForm.nom || !userForm.prenom || !userForm.email) {
      toast.error("Nom, prénom et email sont obligatoires");
      return;
    }
    if (!editingUser && !userForm.password) {
      toast.error("Mot de passe obligatoire pour la création");
      return;
    }
    const body = { ...userForm };
    if (editingUser && !body.password) delete body.password;

    const result = editingUser
      ? await apiPut(`/admin/users/${editingUser.id}`, body)
      : await apiPost("/admin/users", body);

    if (result.success) {
      toast.success(editingUser ? "Utilisateur mis à jour" : "Utilisateur créé");
      resetUserForm();
      fetchAll();
    } else {
      toast.error(result.message || "Erreur");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    const result = await apiDelete(`/admin/users/${id}`);
    if (result.success) {
      toast.success("Utilisateur supprimé");
      fetchAll();
    } else {
      toast.error(result.message || "Erreur");
    }
  };

  const startEditUser = (u: any) => {
    setEditingUser(u);
    setUserForm({
      nom: u.nom || "",
      prenom: u.prenom || "",
      email: u.email || "",
      telephone: u.telephone || "",
      role: u.role || "client",
      statut: u.statut || "actif",
      password: "",
    });
  };

  // ========== Roles ==========
  const resetRoleForm = () => {
    setRoleForm({ nom: "", description: "" });
    setEditingRole(null);
  };

  const saveRole = async () => {
    if (!roleForm.nom) {
      toast.error("Le nom du rôle est obligatoire");
      return;
    }
    const result = editingRole
      ? await apiPut(`/admin/roles/${editingRole.id}`, roleForm)
      : await apiPost("/admin/roles", roleForm);
    if (result.success) {
      toast.success(editingRole ? "Rôle mis à jour" : "Rôle créé");
      resetRoleForm();
      fetchAll();
    } else {
      toast.error(result.message || "Erreur");
    }
  };

  const deleteRole = async (id: number) => {
    if (!confirm("Supprimer ce rôle ?")) return;
    const result = await apiDelete(`/admin/roles/${id}`);
    if (result.success) {
      toast.success("Rôle supprimé");
      if (selectedRole?.id === id) setSelectedRole(null);
      fetchAll();
    } else {
      toast.error(result.message || "Erreur");
    }
  };

  const startEditRole = (r: any) => {
    setEditingRole(r);
    setRoleForm({ nom: r.nom || "", description: r.description || "" });
  };

  const assignPermission = async () => {
    if (!selectedRole || !permissionToAssign) return;
    const result = await apiPost(`/admin/roles/${selectedRole.id}/permissions`, {
      permissionId: Number(permissionToAssign),
    });
    if (result.success) {
      toast.success("Permission assignée");
      setPermissionToAssign("");
      const updated = await fetch(`${API_URL}/admin/roles`).then((res) => res.json());
      if (updated.success) {
        setRoles(updated.data || []);
        const found = (updated.data || []).find((r: any) => r.id === selectedRole.id);
        if (found) setSelectedRole(found);
      }
    } else {
      toast.error(result.message || "Erreur");
    }
  };

  const removePermission = async (permissionId: number) => {
    if (!selectedRole) return;
    const result = await fetch(`${API_URL}/admin/roles/${selectedRole.id}/permissions`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissionId }),
    }).then((res) => res.json());
    if (result.success) {
      toast.success("Permission retirée");
      const updated = await fetch(`${API_URL}/admin/roles`).then((res) => res.json());
      if (updated.success) {
        setRoles(updated.data || []);
        const found = (updated.data || []).find((r: any) => r.id === selectedRole.id);
        if (found) setSelectedRole(found);
      }
    } else {
      toast.error(result.message || "Erreur");
    }
  };

  // ========== Permissions ==========
  const resetPermissionForm = () => {
    setPermissionForm({ nom: "", code: "", description: "" });
    setEditingPermission(null);
  };

  const savePermission = async () => {
    if (!permissionForm.nom || !permissionForm.code) {
      toast.error("Nom et code sont obligatoires");
      return;
    }
    const result = editingPermission
      ? await apiPut(`/admin/permissions/${editingPermission.id}`, permissionForm)
      : await apiPost("/admin/permissions", permissionForm);
    if (result.success) {
      toast.success(editingPermission ? "Permission mise à jour" : "Permission créée");
      resetPermissionForm();
      fetchAll();
    } else {
      toast.error(result.message || "Erreur");
    }
  };

  const deletePermission = async (id: number) => {
    if (!confirm("Supprimer cette permission ?")) return;
    const result = await apiDelete(`/admin/permissions/${id}`);
    if (result.success) {
      toast.success("Permission supprimée");
      fetchAll();
    } else {
      toast.error(result.message || "Erreur");
    }
  };

  const startEditPermission = (p: any) => {
    setEditingPermission(p);
    setPermissionForm({
      nom: p.nom || "",
      code: p.code || "",
      description: p.description || "",
    });
  };

  const tabs = [
    { id: "users" as Tab, label: "Utilisateurs", icon: UsersIcon },
    { id: "roles" as Tab, label: "Rôles", icon: ShieldCheckIcon },
    { id: "permissions" as Tab, label: "Permissions", icon: KeyIcon },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Administration</h1>
      <p className="text-sm text-gray-500 mb-6">Gestion des utilisateurs, rôles et permissions</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <t.icon className="h-5 w-5" />
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-gray-500 py-4">Chargement...</p>}

      {/* ===== USERS TAB ===== */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingUser ? "Modifier un utilisateur" : "Créer un utilisateur"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nom"
                value={userForm.nom}
                onChange={(e) => setUserForm({ ...userForm, nom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Prénom"
                value={userForm.prenom}
                onChange={(e) => setUserForm({ ...userForm, prenom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={userForm.telephone}
                onChange={(e) => setUserForm({ ...userForm, telephone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="admin">Admin</option>
                <option value="gestionnaire">Gestionnaire</option>
                <option value="client">Client</option>
                <option value="chauffeur">Chauffeur</option>
              </select>
              <select
                value={userForm.statut}
                onChange={(e) => setUserForm({ ...userForm, statut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="suspendu">Suspendu</option>
              </select>
              <input
                type="password"
                placeholder={editingUser ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={saveUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                {editingUser ? "Enregistrer" : "Créer"}
              </button>
              {editingUser && (
                <button
                  onClick={resetUserForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{u.nom} {u.prenom}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.telephone || "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{u.role}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{u.statut}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => startEditUser(u)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== ROLES TAB ===== */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingRole ? "Modifier un rôle" : "Créer un rôle"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom du rôle"
                value={roleForm.nom}
                onChange={(e) => setRoleForm({ ...roleForm, nom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Description"
                value={roleForm.description}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={saveRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                {editingRole ? "Enregistrer" : "Créer"}
              </button>
              {editingRole && (
                <button
                  onClick={resetRoleForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {roles.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedRole(r)}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedRole?.id === r.id ? "bg-blue-50" : ""}`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{r.nom}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{r.description || "—"}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); startEditRole(r); }}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteRole(r.id); }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedRole && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Permissions du rôle : {selectedRole.nom}
                </h4>
                <div className="flex gap-2 mb-4">
                  <select
                    value={permissionToAssign}
                    onChange={(e) => setPermissionToAssign(Number(e.target.value) || "")}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Sélectionner une permission</option>
                    {permissions
                      .filter((p) => !(selectedRole.permissions || []).some((sp: any) => sp.id === p.id))
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nom} ({p.code})
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={assignPermission}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {(selectedRole.permissions || []).length === 0 ? (
                    <p className="text-sm text-gray-500">Aucune permission assignée</p>
                  ) : (
                    (selectedRole.permissions || []).map((p: any) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{p.nom}</p>
                          <p className="text-xs text-gray-500">{p.code}</p>
                        </div>
                        <button
                          onClick={() => removePermission(p.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== PERMISSIONS TAB ===== */}
      {activeTab === "permissions" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingPermission ? "Modifier une permission" : "Créer une permission"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nom de la permission"
                value={permissionForm.nom}
                onChange={(e) => setPermissionForm({ ...permissionForm, nom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Code (ex: users.read)"
                value={permissionForm.code}
                onChange={(e) => setPermissionForm({ ...permissionForm, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Description"
                value={permissionForm.description}
                onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={savePermission}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                {editingPermission ? "Enregistrer" : "Créer"}
              </button>
              {editingPermission && (
                <button
                  onClick={resetPermissionForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {permissions.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{p.nom}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.description || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => startEditPermission(p)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deletePermission(p.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
