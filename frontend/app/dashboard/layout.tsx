"use client";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardSkeleton from "@/components/skeletons/dashboard-skeleton";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/api-hooks/use-auth";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

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

  if (isLoading || !data) return <DashboardSkeleton />;

  return (
    <>
      <AppSidebar />
      <SidebarInset className="relative p-6 flex flex-col overflow-hidden">
        <SidebarTrigger variant={"secondary"} className="z-10" />
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </>
  );
};
export default DashboardLayout;
