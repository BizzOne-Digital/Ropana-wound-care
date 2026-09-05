import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { Skeleton } from "@/components/ui/States";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-surface-2 px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            {site.name}
          </p>
          <h1 className="mt-3 text-3xl">Dashboard sign in</h1>
          <p className="mt-2 text-[15px] text-body">
            Authorised staff only.
          </p>
        </div>

        <div className="rounded-card border border-line bg-surface p-6 md:p-8">
          <Suspense
            fallback={
              <div className="flex flex-col gap-5">
                <Skeleton className="h-[4.5rem]" />
                <Skeleton className="h-[4.5rem]" />
                <Skeleton className="h-11" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
