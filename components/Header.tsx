import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

import {
  LayoutDashboard,
  ChevronDown,
  FileText,
  PenBox,
  GraduationCap,
  Sparkles,
  Briefcase,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default async function Header() {
  const user = await currentUser();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90"
        >
          <Image
            src="/logo.png"
            alt="Sensai Logo"
            width={200}
            height={60}
            className="h-12 w-auto object-contain py-1"
          />
        </Link>

        {/* Right Side */}
        <nav className="flex items-center gap-2 md:gap-4">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "hidden items-center gap-2 text-zinc-300 hover:bg-white/10 hover:text-white md:flex"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          {/* Mobile Icon */}
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "text-zinc-300 hover:bg-white/10 hover:text-white md:hidden"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
          </Link>

          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button data-slot="dropdown-menu-trigger" className="flex items-center gap-2 rounded-xl bg-white text-black hover:bg-zinc-200">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden md:block">AI Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              }
            />

            <DropdownMenuContent
              align="end"
              className="w-60 border border-white/10 bg-zinc-950/95 text-white backdrop-blur-xl"
            >
              <DropdownMenuItem className="cursor-pointer gap-2 py-3 hover:bg-white/10">
                <FileText className="h-4 w-4" />
                Resume Builder
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer gap-2 py-3 hover:bg-white/10">
                <PenBox className="h-4 w-4" />
                AI Cover Letter
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer gap-2 py-3 hover:bg-white/10">
                <GraduationCap className="h-4 w-4" />
                Interview Preparation
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer gap-2 py-3 hover:bg-white/10">
                <Briefcase className="h-4 w-4" />
                Career Roadmap
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-white/10" />

              <DropdownMenuItem className="cursor-pointer gap-2 py-3 hover:bg-white/10">
                <Sparkles className="h-4 w-4" />
                More Features Coming Soon
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center gap-4 border-l border-zinc-800 pl-4">
              <span className="hidden text-sm text-zinc-400 sm:inline">
                {user.firstName || user.username}
              </span>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard:
                      "bg-zinc-900 border border-white/10 shadow-2xl",
                  },
                }}
              />
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
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
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
