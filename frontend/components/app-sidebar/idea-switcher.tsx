import { useIdeas } from "@/hooks/api-hooks/use-ideas";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDown, PlusIcon, WatchIcon } from "lucide-react";
import { CreateIdeaDialogContent } from "../idea-flow/create-idea-dialog-content";
import { Dialog, DialogTrigger } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "../ui/sidebar";

export const IdeaSwitcher = () => {
  const { open } = useSidebar();
  const { data, isPending, isError } = useIdeas();

  if (isPending || isError) {
    return <IdeaSwitcherSkeleton />;
  }

  return (
    <SidebarMenu>
      <pre className="text-xs p-10 absolute left-full">
        {JSON.stringify(data, null, 2)}
      </pre>
      <SidebarMenuItem className="flex items-end">
        <div className="flex flex-col gap-2 w-full">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <WatchIcon />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Nibhay</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={"top"}
                className={cn("w-auto ml-4", {
                  "w-[224px] ml-0": open,
                })}
              >
                <DropdownMenuItem>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <WatchIcon size={32} />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Nibhay</span>
                  </div>
                  <CheckIcon className="ml-auto" />
                </DropdownMenuItem>

                {/* <DropdownMenuItem onClick={() => {}}>
                <ExternalLinkIcon />
                <span>View all</span>
              </DropdownMenuItem> */}

                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <PlusIcon />
                    <span>Create new</span>
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <CreateIdeaDialogContent />
          </Dialog>
          <span
            className={cn(
              "text-xs text-muted-foreground h-8 transition-[height,opacity] line-clamp-2",
              {
                "opacity-0 h-0": !open,
              }
            )}
          >
            A smart wearable which automatimatically detects danger
          </span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export const IdeaSwitcherSkeleton = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-end">
        <div className="flex flex-col gap-2 w-full">
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <SidebarMenuSkeleton showIcon className="w-full" />
            <ChevronsUpDown className="ml-auto" />
          </SidebarMenuButton>
          <span
            className={cn(
              "text-xs text-muted-foreground h-8 transition-[height,opacity] line-clamp-2 space-y-2"
            )}
          >
            <SidebarMenuSkeleton className="w-full" height={8} width={"100%"} />
            <SidebarMenuSkeleton className="w-full" height={8} width={"70%"} />
          </span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
