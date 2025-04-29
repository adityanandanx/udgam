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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useNotepads } from "@/hooks/api-hooks/use-notepads";
import { cn } from "@/lib/utils";
import {
  EditIcon,
  Globe,
  Home,
  NotebookTextIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { FC } from "react";
import AccountActions, { AccountActionsSkeleton } from "./account-actions";
import { IdeaSwitcher, IdeaSwitcherSkeleton } from "./idea-switcher";

type MenuItem = {
  title: string;
  url: string;
  icon: FC;
};

// Menu items.
// Must prefix the url with "/"
const items: MenuItem[] = [
  {
    title: "Home",
    url: "",
    icon: Home,
  },
  {
    title: "Notebook",
    url: "/notebook",
    icon: NotebookTextIcon,
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
];

export function AppSidebar() {
  const path = usePathname();
  const { ideaId } = useParams<{ ideaId: string }>();
  const { data: notepads } = useNotepads(ideaId);

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
                {items.map((item) => {
                  const isNotebook = item.url === "/notebook";
                  const href = `/dashboard/${ideaId}${item.url}`;
                  const isActive = path === href;

                  return (
                    <SidebarMenuItem
                      className={cn("", { "opacity-50": !!!ideaId })}
                      key={item.title}
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={isActive && !isNotebook}
                      >
                        <Link href={href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {isNotebook ? (
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              isActive={
                                path === `/dashboard/${ideaId}/notebook`
                              }
                              asChild
                            >
                              <Link href={`/dashboard/${ideaId}/notebook`}>
                                <span className="flex-1">Create new</span>

                                <EditIcon />
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          {notepads?.map((item) => (
                            <SidebarMenuSubItem key={item.id}>
                              <SidebarMenuSubButton
                                isActive={
                                  path ===
                                  `/dashboard/${ideaId}/notebook/${item.id}`
                                }
                                asChild
                              >
                                <Link
                                  href={`/dashboard/${ideaId}/notebook/${item.id}`}
                                >
                                  {item.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      ) : null}
                    </SidebarMenuItem>
                  );
                })}
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
