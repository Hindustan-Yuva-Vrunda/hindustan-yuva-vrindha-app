
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MdCheckCircle,
  MdDelete,
  MdBlock,
  MdRefresh,
  MdPerson,
  MdSecurity,
} from "react-icons/md";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "USER" | "EDITOR";
  status: "PENDING" | "APPROVED" | "REJECTED" | "BLOCKED";
  createdAt: string;
  updatedAt: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/users", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users.");
      }

      setUsers(data.users || []);
    } catch (err) {
      console.error("Load users error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading users."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const updateUser = async (
    id: string,
    status: "APPROVED" | "REJECTED" | "BLOCKED"
  ) => {
    try {
      setActionLoading(id);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update user.");
      }

      setSuccess(data.message || "User status updated successfully.");
      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update user."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const updateRole = async (
    id: string,
    role: "USER" | "EDITOR"
  ) => {
    const user = users.find((item) => item.id === id);

    if (!user || user.role === role) return;

    const confirmed = window.confirm(
      `Change ${user.name}'s role to ${
        role === "EDITOR" ? "Editor" : "Member"
      }?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update user role.");
      }

      setSuccess(data.message || "User role updated successfully.");
      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update user role."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (id: string) => {
    const user = users.find((item) => item.id === id);

    if (!user) return;

    const confirmed = window.confirm(
      `Delete the account for ${user.name}?\n\n` +
        "This action cannot be undone. Accounts with booking or contribution " +
        "records may not be eligible for deletion."
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete user.");
      }

      setUsers((previous) =>
        previous.filter((item) => item.id !== id)
      );

      setSuccess(data.message || "User deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete user."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = users.filter(
    (user) => user.status === "PENDING"
  ).length;

  const editorCount = users.filter(
    (user) => user.role === "EDITOR"
  ).length;

  return (
    <section className="min-w-0 rounded-3xl border border-[#FBBF24]/20 bg-white p-4 shadow-sm sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <MdPerson className="text-[#EA580C]" size={25} />
            <h2 className="text-xl font-bold text-[#3B2415]">
              User Management
            </h2>
          </div>

          <p className="mt-1 text-sm text-[#78716C]">
            Manage members, editors, registrations, and account status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadUsers()}
          disabled={loading || actionLoading !== null}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FBBF24]/40 px-4 py-2 text-sm font-semibold text-[#3B2415] transition hover:bg-[#FFF7E6] disabled:opacity-50"
        >
          <MdRefresh size={19} />
          Refresh
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#FBBF24]/30 bg-[#FFF7E6] p-4">
          <p className="text-sm text-[#78716C]">Total Accounts</p>
          <p className="mt-1 text-2xl font-extrabold text-[#3B2415]">
            {users.length}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">Pending Approval</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-900">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-sm text-purple-800">Editors</p>
          <p className="mt-1 text-2xl font-extrabold text-purple-900">
            {editorCount}
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <div className="flex items-start justify-between gap-3">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          <div className="flex items-start justify-between gap-3">
            <p>{success}</p>
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss success message"
              className="font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-[#78716C]">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="mt-6 rounded-xl bg-[#FFF7E6] p-8 text-center text-sm text-[#78716C]">
          No member or editor accounts found.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[#F5F5F4]">
          <table className="w-full min-w-[1050px]">
            <thead className="bg-[#FFF7E6]">
              <tr className="border-b border-[#E7E5E4] text-left">
                <th className="px-4 py-3 text-xs font-bold uppercase text-[#78716C]">
                  User
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase text-[#78716C]">
                  Phone
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase text-[#78716C]">
                  Role
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase text-[#78716C]">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase text-[#78716C]">
                  Change Role
                </th>
                <th className="px-4 py-3 text-xs font-bold uppercase text-[#78716C]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const busy = actionLoading === user.id;

                return (
                  <tr
                    key={user.id}
                    className="border-b border-[#F5F5F4] last:border-b-0 hover:bg-[#FFFCF6]"
                  >
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[#3B2415]">
                        {user.name}
                      </p>
                      <p className="text-sm text-[#78716C]">
                        {user.email}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-sm text-[#57534E]">
                      {user.phone}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                          user.role === "EDITOR"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role === "EDITOR" ? (
                          <MdSecurity size={15} />
                        ) : (
                          <MdPerson size={15} />
                        )}
                        {user.role === "EDITOR" ? "Editor" : "Member"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          user.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : user.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : user.status === "BLOCKED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <select
                        aria-label={`Change role for ${user.name}`}
                        value={user.role}
                        disabled={busy}
                        onChange={(event) =>
                          void updateRole(
                            user.id,
                            event.target.value as "USER" | "EDITOR"
                          )
                        }
                        className="w-full rounded-lg border border-[#E7DCC8] bg-white px-3 py-2 text-sm font-semibold text-[#3B2415] outline-none focus:border-[#EA580C] disabled:opacity-50"
                      >
                        <option value="USER">Member</option>
                        <option value="EDITOR">Editor</option>
                      </select>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {user.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                void updateUser(user.id, "APPROVED")
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                            >
                              <MdCheckCircle size={16} />
                              Approve
                            </button>

                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                void updateUser(user.id, "REJECTED")
                              }
                              className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-900 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {(user.status === "BLOCKED" ||
                          user.status === "REJECTED") && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              void updateUser(user.id, "APPROVED")
                            }
                            className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-2 text-xs font-bold text-green-800 disabled:opacity-50"
                          >
                            <MdCheckCircle size={16} />
                            Approve
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void deleteUser(user.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 disabled:opacity-50"
                        >
                          <MdDelete size={16} />
                          {busy ? "Processing..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}