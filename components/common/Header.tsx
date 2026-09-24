"use client";

import { FileText } from "lucide-react";
import NavLink from "./nav-link";
import UserNav from "./user-nav";
import { useSession } from "next-auth/react";

function Header() {
  const { status } = useSession();
  const isSignedIn = status === "authenticated";

  return (
    <header className="w-full bg-rose-50/80 backdrop-blur-md sticky top-0 z-50 nav-frosted border-b border-rose-100/50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-3.5 px-4 lg:px-8">
        {/* Left: Logo and Brand */}
        <div className="flex items-center gap-2 lg:gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-sm shadow-rose-500/20 flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <NavLink href="/" className="flex items-center gap-1">
            <span className="font-display font-extrabold text-lg lg:text-xl text-gray-900 tracking-tight whitespace-nowrap">
              Snap<span className="text-rose-600">Read</span>
            </span>
          </NavLink>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8 flex-shrink-0">
          <NavLink href="/#pricing" className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors">
            Pricing
          </NavLink>

          {isSignedIn && (
            <>
              <NavLink href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors">
                Dashboard
              </NavLink>
              <NavLink href="/upload" className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors">
                Upload PDF
              </NavLink>
            </>
          )}
        </div>

        {/* Right: User navigation & Auth */}
        <div className="flex items-center gap-3 justify-end min-w-0">
          <UserNav />
        </div>
      </nav>
    </header>
  );
}

export default Header;
