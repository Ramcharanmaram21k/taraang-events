import { AuthProvider } from "@/components/providers/auth-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Taraang Events",
  description: "Manage your events and generate invoices",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
