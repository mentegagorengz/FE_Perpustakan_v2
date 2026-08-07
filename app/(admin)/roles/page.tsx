"use client";

import { useDeferredValue, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, ShieldOff, Trash2, Shield } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useUsers, useUpdateRoleMutation, useDeleteUserMutation } from "@/hooks/use-users";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { ApiUser, SystemRole } from "@/types/api";
import type { Column } from "@/types/ui";

export default function RoleManagementPage() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | SystemRole>("all");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const { data } = useUsers({
    enabled: isAuthenticated,
    page,
    search: deferredSearchTerm || undefined,
    role: filterRole === "all" ? undefined : filterRole,
  });
  const updateRole = useUpdateRoleMutation();
  const deleteUser = useDeleteUserMutation();

  const users = data?.data ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPages ?? 1;

  const handleRole = async (id: number, role: SystemRole, name: string) => {
    try {
      await updateRole.mutateAsync({ id, role });
      toast.success(`${name} → ${role}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal ubah role.");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus user ${name}? Aksi permanen.`)) return;
    try {
      await deleteUser.mutateAsync(id);
      toast.success(`${name} dihapus`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal hapus.");
    }
  };

  const isBusy = updateRole.isPending || deleteUser.isPending;

  const columns: Column<ApiUser>[] = [
    { key: "full_name", header: "Nama", render: (u) => <span className="font-medium text-main-text">{u.full_name}</span> },
    { key: "email", header: "Email", render: (u) => <span className="text-main-text-muted">{u.email}</span> },
    {
      key: "role",
      header: "Role",
      render: (u) => <Badge variant={u.role === "USER" ? "neutral" : "primary"}>{u.role}</Badge>,
    },
    {
      key: "created_at",
      header: "Bergabung",
      render: (u) => <span className="text-main-text-muted">{new Date(u.created_at).toLocaleDateString("id-ID")}</span>,
    },
    {
      key: "id",
      header: "Aksi",
      align: "right",
      render: (u) => (
        <div className="flex items-center justify-end gap-2">
          {u.role === "USER" ? (
            <Button variant="outline" className="px-3 py-1.5 text-xs text-secondary" disabled={isBusy} onClick={() => handleRole(u.id, "STAFF", u.full_name)}>
              <ShieldCheck className="h-3.5 w-3.5" />
              Jadikan STAFF
            </Button>
          ) : (
            <Button variant="outline" className="px-3 py-1.5 text-xs text-warning-text" disabled={isBusy} onClick={() => handleRole(u.id, "USER", u.full_name)}>
              <ShieldOff className="h-3.5 w-3.5" />
              Turunkan ke USER
            </Button>
          )}
          <Button variant="dangerOutline" className="px-3 py-1.5 text-xs" disabled={isBusy} onClick={() => handleDelete(u.id, u.full_name)}>
            <Trash2 className="h-3.5 w-3.5" />
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-cream p-4 font-sans sm:p-6 lg:p-10">
      <PageHeader
        title="Otoritas pengguna"
        description="Kelola role staf dan akses pengguna perpustakaan."
        icon={<Shield size={20} />}
        className="mb-8 border-b border-main-border pb-6"
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-sm border border-main-border bg-paper p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-main-text-muted">Total pengguna</p>
          <p className="mt-1 font-display text-3xl text-main-text">{total}</p>
        </div>
        <div className="rounded-sm border border-main-border bg-paper p-5 shadow-[var(--shadow-card)]">
          <p className="text-sm text-main-text-muted">Hasil filter role</p>
          <p className="mt-1 font-display text-3xl text-secondary">{total}</p>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="role-filter" className="sr-only">
          Filter berdasarkan role
        </label>
        <Select value={filterRole} onValueChange={(v) => {
          setFilterRole(v as "all" | SystemRole);
          setPage(1);
        }}>
          <SelectTrigger id="role-filter" className="w-full sm:w-56">
            <SelectValue placeholder="Semua role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua role</SelectItem>
            <SelectItem value="SUPER_ADMIN">SUPER_ADMIN</SelectItem>
            <SelectItem value="STAFF">STAFF</SelectItem>
            <SelectItem value="USER">USER</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={users}
        keyField="id"
        isLoading={!data}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchValue={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setPage(1);
        }}
        searchPlaceholder="Cari nama / email..."
        emptyTitle="Tidak ada pengguna ditemukan"
      />
    </div>
  );
}
