"use client";
import { FileText } from "lucide-react";
import NavLink from "./nav-link";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/clerk-react";

function Header() {
  return (
    <header className="w-full bg-rose-50/80 backdrop-blur-md sticky top-0 z-50 nav-frosted">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
        {/* Left: Logo and Brand */}
        <div className="flex items-center gap-2 lg:gap-4 min-w-0">
          <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-gray-900 hover:rotate-12 transition-transform duration-200 ease-in-out flex-shrink-0" />
          <NavLink href="/" className="flex items-center gap-1 lg:gap-2">
            <span className="font-extrabold text-lg lg:text-2xl text-gray-900 whitespace-nowrap">
              SnapRead
            </span>
          </NavLink>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-12 flex-shrink-0">
          <NavLink href="/#pricing" className="nav-link">
            Pricing
          </NavLink>

          <SignedIn>
            <NavLink href="/dashboard" className="nav-link">
              Dashboard
            </NavLink>
          </SignedIn>
        </div>

        {/* Right: Upload & Sign In */}
        <div className="flex items-center gap-2 justify-end min-w-0">
          <SignedIn>
            <div className="flex gap-2 items-center flex-wrap">
              <NavLink href="/upload" className="nav-link whitespace-nowrap">
                Upload a PDF
              </NavLink>
              <div className="text-sm bg-rose-100 text-rose-700 px-2 py-1 rounded-full flex-shrink-0">
                Pro
              </div>
              <div className="flex-shrink-0">
                <UserButton />
              </div>
            </div>
          </SignedIn>

          <SignedOut>
            <NavLink
              href="/sign-in"
              className="nav-link border border-gray-300 rounded px-3 py-1 ml-2 whitespace-nowrap flex-shrink-0"
            >
              Sign In
            </NavLink>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}

export default Header;