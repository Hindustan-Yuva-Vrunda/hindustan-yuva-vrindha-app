import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#FFFDF5]">

      <AdminNavbar />

      <main className="min-h-screen lg:pl-64">
        {children}
      </main>

    </div>
  );
}