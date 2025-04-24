"use client";
import { useUser } from "@/hooks/api-hooks/use-auth";

export default function Dashboard() {
  const { data } = useUser();
  return <h1>Welcome, {data?.firstName}</h1>;
}
