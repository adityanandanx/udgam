"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/api-hooks/use-auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ username: "test", password: "testtest" });

  return (
    <div className="mx-auto container min-h-screen flex items-center-safe justify-center-safe">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(form);
        }}
        className="max-w-md w-full flex flex-col gap-3"
      >
        <h1>Login</h1>
        <small>
          {searchParams.get("register") === "success"
            ? "Account created. Please login to continue"
            : "Welcome back to Udgam"}
        </small>
        <Label htmlFor="username">Username</Label>
        <Input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button type="submit" disabled={isPending}>
          Login
        </Button>
        <span>
          Don&apos;t have an account? <Link href={`/register`}>Register</Link>
        </span>
      </form>
    </div>
  );
}
