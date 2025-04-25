"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/api-hooks/use-auth";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const { data, isLoading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (error) router.replace("/login");
  }, [error, router]);

  useEffect(() => {
    if (!data && !isLoading) {
      router.replace("/login");
    }
  }, [data, isLoading, router]);

  if (isLoading || !data) return <p>Loading...</p>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative p-6 flex flex-col overflow-hidden">
        <SidebarTrigger variant={"secondary"} className="z-10" />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default DashboardLayout;
