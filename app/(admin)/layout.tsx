import AdminSidebar from "@/components/AdminSidebar"; // Misal kamu punya ini

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-secondary text-white">
        <AdminSidebar />
      </aside>
      <main className="flex-1 p-8 bg-cream">{children}</main>
    </div>
  );
}
