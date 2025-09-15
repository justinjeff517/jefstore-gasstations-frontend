import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import UrlBreadcrumb from "@/components/dispensers/url-breadcrumb";
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-md p-4">
      <header className="mb-3">
        <UrlBreadcrumb />
      </header>
      <Separator className="mb-4" />
      {children}
    </main>
  );
}
