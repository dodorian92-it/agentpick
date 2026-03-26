"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

export default function Footer() {
  const locale = useLocale();

  return (
    <footer className="border-t border-white/5 py-10 px-6 mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link
              href={`/${locale}`}
              className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            >
              AgentPick
            </Link>
            <p className="text-xs text-gray-500 max-w-xs text-center md:text-left">
              The AI Agent Marketplace you can actually trust.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 text-sm text-gray-500">
            <Link href={`/${locale}`} className="hover:text-purple-400 transition-colors">
              Home
            </Link>
            <Link href={`/${locale}/marketplace`} className="hover:text-purple-400 transition-colors">
              Browse
            </Link>
            <Link href={`/${locale}/blog`} className="hover:text-purple-400 transition-colors">
              Blog
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-purple-400 transition-colors">
              Terms
            </Link>
            <Link href={`/${locale}/privacy`} className="hover:text-purple-400 transition-colors">
              Privacy
            </Link>
            <Link href={`/${locale}/cookies`} className="hover:text-purple-400 transition-colors">
              Cookies
            </Link>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© 2026 AgentPick. All rights reserved.</span>
          <span>Built for the OpenClaw ecosystem 🦞</span>
        </div>
      </div>
    </footer>
  );
}
