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
      <div>
        <SidebarTrigger />
        {children}
      </div>
    </SidebarProvider>
  );
}
