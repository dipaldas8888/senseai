"use client";

import { UserButton, Show } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function HeaderAuth() {
  return (
    <>
      <Show when="signed-in">
        <div className="flex items-center gap-4 border-l border-zinc-800 pl-4">
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
      </Show>
      <Show when="signed-out">
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
      </Show>
    </>
  );
}
