import type { Metadata } from "next";
import Image from "next/image";
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
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/Logo/logo.png"
            alt={site.name}
            width={500}
            height={500}
            priority
            className="h-28 w-auto object-contain dark:hidden"
          />
          <Image
            src="/Logo/logo-dark.png"
            alt=""
            width={500}
            height={500}
            priority
            className="hidden h-28 w-auto object-contain dark:block"
          />
          <span className="brand-rule mt-6" aria-hidden />
          <h1 className="mt-6 text-3xl">Dashboard sign in</h1>
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
