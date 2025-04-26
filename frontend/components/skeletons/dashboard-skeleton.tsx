"use client";
import { Loader2Icon } from "lucide-react";
import { AppSidebarSkeleton } from "../app-sidebar";
import { SidebarInset, SidebarTrigger } from "../ui/sidebar";

const DashboardSkeleton = () => {
  return (
    <>
      <AppSidebarSkeleton />
      <SidebarInset className="relative p-6 flex flex-col overflow-hidden">
        <SidebarTrigger variant={"secondary"} className="z-10" />
        <main className="flex-1 items-center justify-center flex gap-2">
          <Loader2Icon className="animate-spin text-muted-foreground" />
          <p className="text-muted-foreground mt-0">
            We are fetching your data...
          </p>
        </main>
      </SidebarInset>
    </>
  );
};

export default DashboardSkeleton;
