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
import { useLogout, useUser } from "@/hooks/api-hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const AccountActions = () => {
  const { data: user, isPending, error } = useUser();
  const { open } = useSidebar();
  if (error) {
    return <p>Error loading user data</p>;
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <AlertDialog>
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
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>
                  <LogOutIcon />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <LogOutAlertContent />
        </AlertDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const LogOutAlertContent = () => {
  const { mutate, isPending } = useLogout();
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="border-none p-0">
          Are you sure you want to sign out?
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-0">
          You can always log back in :)
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={() => mutate()} disabled={isPending}>
          Sign Out
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
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
