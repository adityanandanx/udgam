"use client";
import { useUser } from "@/hooks/api-hooks/use-auth";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data, isLoading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log("ON DASHBOARD");

    if (error) router.replace("/login");
  }, [error, router]);

  if (isLoading) return <p>Loading...</p>;

  if (!data) redirect("/login");

  return <h1>Welcome, {data.firstName}</h1>;
}
