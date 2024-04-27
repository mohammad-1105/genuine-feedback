import Navbar from "@/components/Navbar";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <div className="w-full min-h-screen">
      <Navbar/>
        {children}
    </div>
   
  );
}
