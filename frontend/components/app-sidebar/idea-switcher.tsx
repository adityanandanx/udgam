import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ChevronsUpDown,
  ExternalLinkIcon,
  WatchIcon,
} from "lucide-react";
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
  useSidebar,
} from "../ui/sidebar";

export const IdeaSwitcher = () => {
  const { open } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-end">
        <div className="flex flex-col gap-2 w-full">
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

              <DropdownMenuItem onClick={() => {}}>
                <ExternalLinkIcon />
                <span>View all</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
