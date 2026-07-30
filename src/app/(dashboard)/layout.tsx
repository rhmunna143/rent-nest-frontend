import Link from "next/link";
import { Sidebar } from "@/components/dashboard/Sidebar";
import Logo from "@/utils/images/logo";
import NavAvatar from "@/components/layout/Avatar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-muted/10">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shrink-0 shadow-sm">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-primary"
        >
          <Logo />
        </Link>
        <div className="ml-auto flex items-center gap-4">
          {/* <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
            Dashboard Portal
          </span> */}

          <NavAvatar />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Desktop */}
        <div className="hidden md:block shrink-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
