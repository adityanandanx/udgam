"use client";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardSkeleton from "@/components/skeletons/dashboard-skeleton";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/api-hooks/use-auth";
import { redirect, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const { data, isPending } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!data && !isPending) {
      router.replace("/login");
    }
  }, [data, isPending, router]);

  if (isPending) return <DashboardSkeleton />;

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
