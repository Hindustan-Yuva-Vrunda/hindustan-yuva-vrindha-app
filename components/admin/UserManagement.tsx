"use client";

import { useEffect, useState } from "react";
import {
  MdCheckCircle,
  MdDelete,
  MdBlock,
  MdRefresh,
  MdPerson,
} from "react-icons/md";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "BLOCKED";
  createdAt: string;
  updatedAt: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/users");

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load users.");
        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
      setError("Something went wrong while loading users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateUser = async (
    id: string,
    status: "APPROVED" | "REJECTED" | "BLOCKED"
  ) => {
    try {
      setActionLoading(id);

      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to update user.");
        return;
      }

      await loadUsers();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(id);

      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to delete user.");
        return;
      }

      await loadUsers();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setActionLoading(null);
    }
  };

  const visibleUsers = users.filter(
    (user) =>
      user.status === "PENDING" ||
      user.status === "APPROVED"
  );

  return (
    <div className="rounded-3xl border border-[#FBBF24]/20 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <MdPerson className="text-[#EA580C]" size={25} />

            <h2 className="text-xl font-bold text-[#3B2415]">
              Users
            </h2>
          </div>

          <p className="mt-1 text-sm text-[#78716C]">
            Review pending registrations and manage active users.
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#FBBF24]/40 px-4 py-2 text-sm font-semibold text-[#3B2415] transition hover:bg-[#FFF7E6]"
        >
          <MdRefresh size={19} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-[#78716C]">
          Loading users...
        </div>
      ) : error ? (
        <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : visibleUsers.length === 0 ? (
        <div className="mt-6 rounded-xl bg-[#FFF7E6] p-8 text-center text-sm text-[#78716C]">
          No pending or active users found.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-[#E7E5E4] text-left">
                <th className="px-4 py-3 text-xs font-bold uppercase text-[#78716C]">
                  User
                </th>

                <th className="px-4 py-3 text-xs font-bold uppercase text-[#78716C]">
                  Phone
                </th>

                <th className="px-4 py-3 text-xs font-bold uppercase text-[#78716C]">
                  Status
                </th>

                <th className="px-4 py-3 text-xs font-bold uppercase text-[#78716C]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[#F5F5F4]"
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
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        user.status === "PENDING"
                          ? "bg-[#FEF3C7] text-[#92400E]"
                          : "bg-[#DBEAFE] text-[#1E3A8A]"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {user.status === "PENDING" && (
                        <>
                          <button
                            disabled={actionLoading === user.id}
                            onClick={() =>
                              updateUser(user.id, "APPROVED")
                            }
                            className="flex items-center gap-1 rounded-lg bg-[#2563EB] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                          >
                            <MdCheckCircle size={16} />
                            Approve
                          </button>

                          <button
                            disabled={actionLoading === user.id}
                            onClick={() =>
                              updateUser(user.id, "REJECTED")
                            }
                            className="rounded-lg bg-[#FEF3C7] px-3 py-2 text-xs font-bold text-[#92400E] disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {user.status === "APPROVED" && (
                        <button
                          disabled={actionLoading === user.id}
                          onClick={() =>
                            updateUser(user.id, "BLOCKED")
                          }
                          className="flex items-center gap-1 rounded-lg bg-[#FFF7E6] px-3 py-2 text-xs font-bold text-[#C2410C] disabled:opacity-50"
                        >
                          <MdBlock size={16} />
                          Block
                        </button>
                      )}

                      <button
                        disabled={actionLoading === user.id}
                        onClick={() => deleteUser(user.id)}
                        className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 disabled:opacity-50"
                      >
                        <MdDelete size={16} />
                        Delete
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
  );
}