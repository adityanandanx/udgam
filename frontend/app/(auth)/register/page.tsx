"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/api-hooks/use-auth";
import { RegisterPayload } from "@/lib/api/auth";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const { mutate: register, isPending } = useRegister();
  const [form, setForm] = useState<RegisterPayload>({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  return (
    <div className="mx-auto container min-h-screen flex items-center-safe justify-center-safe">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          register(form);
        }}
        className="max-w-md w-full flex flex-col gap-3"
      >
        <h1>Create account</h1>
        <small>Welcome to Udgam</small>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Label htmlFor="username">Username</Label>
        <Input
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <Label htmlFor="password">Password</Label>
        <Input
          required
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Label htmlFor="firstName">First Name</Label>
        <Input
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
        <Button type="submit" disabled={isPending}>
          Sign Up
        </Button>
        <span>
          Already have an account? <Link href={`/login`}>Login</Link>
        </span>
      </form>
    </div>
  );
}
