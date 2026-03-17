import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SideBarMenu } from "@/components/SideBarMenu";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SideBarMenu />
      <div className="w-full">
        <div className="flex justify-end p-4 md:justify-start md:px-0">
          <SidebarTrigger className=""/>
        </div>
        {children}
      </div>
    </SidebarProvider>
  );
}
