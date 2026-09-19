import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center px-4 py-10">
      <div className="w-full">
        <p className="mb-6 text-center font-serif text-2xl text-bordeaux-deep">
          Les Protégés de Bianca
        </p>
        <Suspense fallback={<p className="text-center">Chargement…</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted hover:text-bordeaux">
            Retour au site
          </Link>
        </p>
      </div>
    </div>
  );
}
