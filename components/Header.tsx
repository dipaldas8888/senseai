import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function Header() {
  const user = await currentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            S
          </span>
          <span>
            Sense<span className="text-indigo-400">AI</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Dashboard
          </Link>

          {user ? (
            <div className="flex items-center gap-4 border-l border-zinc-800 pl-4">
              <span className="hidden text-sm text-zinc-400 sm:inline">
                {user.firstName || user.username}
              </span>
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
