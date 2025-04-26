import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Globe, Home, StarIcon } from "lucide-react";
import Link from "next/link";
import AccountActions from "./account-actions";
import { IdeaSwitcher } from "./idea-switcher";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Idea Board",
    url: "/dashboard/idea-board",
    icon: StarIcon,
  },
  {
    title: "Geo Map",
    url: "/dashboard/geo-map",
    icon: Globe,
  },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: Search,
  // },
  // {
  //   title: "Settings",
  //   url: "#",
  //   icon: Settings,
  // },
];

export function AppSidebar() {
  // const side = useSidebar();

  return (
    <>
      {/* <pre className="bg-red-500 absolute bottom-0 right-0 z-50">
        {JSON.stringify(side, null, 2)}
      </pre> */}
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <IdeaSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
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
        <SidebarFooter>
          <AccountActions />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
