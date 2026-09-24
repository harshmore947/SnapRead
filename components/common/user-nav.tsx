"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, LayoutDashboard, UploadCloud, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserNav() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-rose-100 animate-pulse" />
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/sign-in">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-700 hover:text-rose-600 font-medium"
          >
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button
            size="sm"
            className="rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 shadow-sm transition-all"
          >
            Get Started
          </Button>
        </Link>
      </div>
    );
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user.email
    ? user.email[0].toUpperCase()
    : "U";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full p-1 pl-2 pr-2.5 bg-white border border-rose-200 hover:border-rose-300 shadow-sm transition-all hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        aria-expanded={isOpen}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-rose-600 text-white font-medium text-xs flex items-center justify-center">
            {initials}
          </div>
        )}
        <span className="text-xs font-medium text-gray-700 max-w-[100px] truncate hidden sm:inline-block">
          {user.name || user.email?.split("@")[0]}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in-0 zoom-in-95 duration-100 border border-gray-100">
          <div className="px-3 py-2 border-b border-gray-100 mb-1">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {user.name || "SnapRead User"}
            </p>
            <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
          </div>

          <div className="space-y-0.5">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-rose-500" />
              Dashboard
            </Link>

            <Link
              href="/upload"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-colors"
            >
              <UploadCloud className="w-4 h-4 text-rose-500" />
              Upload Document
            </Link>
          </div>

          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
