"use client";
import { useUser } from "@/hooks/api-hooks/use-auth";

export default function Dashboard() {
  const { data } = useUser();
  return (
    <div className="">
      <h1>
        Welcome, <span className="capitalize">{data?.firstName}</span>
      </h1>
      <small className="text-muted-foreground">
        What&apos;s on your mind today?
      </small>
    </div>
  );
}
