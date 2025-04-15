"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center text-primary">
              <Zap className="h-8 w-8 stroke-[1.5]" />
              <span className="font-bold text-2xl logo-gradient ml-1">SalesPro</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Sign in
            </Link>
            <Link href="/register">
              <Button size="sm" className="shadow-sm">Get Started</Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <span className="sr-only">Open menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}