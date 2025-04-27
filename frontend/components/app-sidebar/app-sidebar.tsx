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
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { CheckCircle2Icon, Globe, Home, StarIcon } from "lucide-react";
import Link from "next/link";
import AccountActions, { AccountActionsSkeleton } from "./account-actions";
import { IdeaSwitcher, IdeaSwitcherSkeleton } from "./idea-switcher";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

// Menu items.
// Must prefix the url with "/"
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Idea Board",
    url: "/idea-board",
    icon: StarIcon,
  },
  {
    title: "Geo Map",
    url: "/geo-map",
    icon: Globe,
  },
  {
    title: "Validation",
    url: "/validation",
    icon: CheckCircle2Icon,
  },
  // {
  //   title: "Settings",
  //   url: "#",
  //   icon: Settings,
  // },
];

export function AppSidebar() {
  const { ideaId } = useParams<{ ideaId: string }>();

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
                  <SidebarMenuItem
                    className={cn("", { "opacity-50": !!!ideaId })}
                    key={item.title}
                  >
                    <SidebarMenuButton asChild>
                      <Link
                        href={ideaId ? `/dashboard/${ideaId}${item.url}` : ""}
                      >
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

export function AppSidebarSkeleton() {
  return (
    <>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <IdeaSwitcherSkeleton />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <SidebarMenuSkeleton height={8} width={"100%"} />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      {/* <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link> */}
                      <SidebarMenuSkeleton showIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <AccountActionsSkeleton />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
