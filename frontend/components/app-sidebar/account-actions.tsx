import { User2, ChevronUp, User2Icon, LogOutIcon } from "lucide-react";
import React from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUser } from "@/hooks/api-hooks/use-auth";
import { cn } from "@/lib/utils";

const AccountActions = () => {
  const { data: user, isPending, error } = useUser();
  const { open } = useSidebar();
  if (error) {
    return <p>Error loading user data</p>;
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size={"lg"}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-foreground">
                <User2 />
              </div>
              {isPending ? (
                <SidebarMenuSkeleton />
              ) : (
                <div className="flex flex-col w-max">
                  <span className="capitalize">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {user.username}
                  </span>
                </div>
              )}
              <ChevronUp className={"ml-auto"} />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={"top"}
            className={cn("w-auto ml-4", {
              "w-[224px] ml-0": open,
            })}
          >
            <DropdownMenuItem>
              <User2Icon />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <LogOutIcon />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export const AccountActionsSkeleton = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <SidebarMenuButton size={"lg"}>
            <SidebarMenuSkeleton className="w-[80%]" showIcon />
            <ChevronUp className={"ml-auto"} />
          </SidebarMenuButton>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default AccountActions;
