import { useIdeas } from "@/hooks/api-hooks/use-ideas";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ChevronsUpDown,
  CircleIcon,
  PlusIcon,
  WatchIcon,
} from "lucide-react";
import Link from "next/link";
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
import { useParams } from "next/navigation";
import { useMemo } from "react";

export const IdeaSwitcher = () => {
  const { open } = useSidebar();
  const { data, isPending, isError } = useIdeas();
  const { ideaId } = useParams<{ ideaId: string }>();

  const selectedIdea = useMemo(
    () => (data ? data.find((idea) => idea.id === ideaId) : null),
    [data, ideaId]
  );

  if (isPending || isError) {
    return <IdeaSwitcherSkeleton />;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-end">
        <div className="flex flex-col gap-2 w-full">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {selectedIdea ? (
                    <>
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <CircleIcon size={16} />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {selectedIdea.title}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        Select Idea
                      </span>
                    </div>
                  )}
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={"top"}
                className={cn("w-auto ml-4", {
                  "w-[224px] ml-0": open,
                })}
              >
                {data.map((idea) => (
                  <Link key={idea.id} href={`/dashboard/${idea.id}/`}>
                    <DropdownMenuItem key={idea.id}>
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <CircleIcon />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {idea.title}
                        </span>
                      </div>
                      {selectedIdea?.id === idea.id && (
                        <CheckIcon className="ml-auto" />
                      )}
                    </DropdownMenuItem>
                  </Link>
                ))}

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
