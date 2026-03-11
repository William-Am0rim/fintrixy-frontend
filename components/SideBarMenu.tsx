"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  ArrowRightLeft,
  BarChart3,
  ChartPie,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Target,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

export const SideBarMenu = () => {
  const menu = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Carteiras", href: "/wallets", icon: Wallet },
    { title: "Transações", href: "/transactions", icon: ArrowRightLeft },
    { title: "Metas", href: "/goals", icon: Target },
    { title: "Cartões", href: "/cards", icon: CreditCard },
    { title: "Relatórios", href: "/reports", icon: BarChart3 },
    { title: "Orçamentos", href: "/budgets", icon: ChartPie },
  ];

  const pathname = usePathname();

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon" className="">
        <SidebarHeader className="border-b border-gray-600">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent hover:bg-transparent"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-blue-900 text-white">
                <span className="font-bold text-lg leading-none">F</span>
              </div>
              <span className="text-xl font-semibold text-gray-300">
                Fintrixy
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="mt-4">
              <SidebarMenu className="flex flex-col gap-2">
                {menu.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`cursor-pointer text-base text-gray-300 py-5 px-3 ${item.href === pathname ? "bg-blue-800/30 text-blue-300 hover:bg-blue-800/30 hover:text-blue-300" : "bg-transparent hover:bg-white/10 hover:text-white"}`}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="flex flex-col items-center border-t border-gray-600">
          <SidebarMenuButton
            asChild
            tooltip="Configurações"
            className={`cursor-pointer text-base text-gray-300 py-5 px-3 ${"" === pathname ? "bg-blue-800/30 text-blue-300 hover:bg-blue-800/30 hover:text-blue-300" : "bg-transparent hover:bg-white/10 hover:text-white"}`}
          >
            <Link href="/settings" className="flex items-center justify-center">
              <Settings />
              <span>Configurações</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton
            asChild
            tooltip="Sair"
            className={`cursor-pointer text-base text-gray-300 py-5 px-3 ${"" === pathname ? "bg-blue-800/30 text-blue-300 hover:bg-blue-800/30 hover:text-blue-300" : "bg-transparent hover:bg-white/10 hover:text-white"}`}
          >
            <Button onClick={() => signOut({ callbackUrl: "/sign-in" })}>
              <LogOut />
              <span>Sair</span>
            </Button>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
};
