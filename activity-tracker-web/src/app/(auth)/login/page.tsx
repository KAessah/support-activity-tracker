import type { Metadata } from "next";
import { LoginContent } from "@/components/auth/LoginContent";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return <LoginContent />;
}
