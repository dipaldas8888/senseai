import Link from "next/link";
import Image from "next/image";
import HeaderAuth from "./HeaderAuth";

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

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/15 backdrop-blur-md transition-colors">
      <div className="flex h-16 w-full items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 pl-5"
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
              "hidden items-center gap-2 text-zinc-300 hover:bg-white/10 hover:text-white md:flex",
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
              "text-zinc-300 hover:bg-white/10 hover:text-white md:hidden",
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
          </Link>

          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  data-slot="dropdown-menu-trigger"
                  className="flex items-center gap-2 rounded-xl bg-white text-black hover:bg-zinc-200"
                >
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
          <HeaderAuth />
        </nav>
      </div>
    </header>
  );
}
