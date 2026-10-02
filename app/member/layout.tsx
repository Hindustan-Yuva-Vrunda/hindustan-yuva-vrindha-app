import UserNavbar from "@/components/members/UserNavbar";


export default function UserDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#FFFDF5]">
      <UserNavbar />

      <main className="min-h-screen lg:pl-64">
        {children}
      </main>
    </div>
  );
}

