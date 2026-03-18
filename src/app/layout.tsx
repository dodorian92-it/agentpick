import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentPick — The AI Agent Marketplace You Can Actually Trust",
  description:
    "Curated skills and agents for OpenClaw, Claude Code, and beyond. Every listing is reviewed, tested, and kept up-to-date. Free to use, forever.",
  metadataBase: new URL("https://agentpick.co"),
  openGraph: {
    title: "AgentPick — The AI Agent Marketplace You Can Actually Trust",
    description:
      "Curated skills and agents for OpenClaw, Claude Code, and beyond. Every listing is reviewed, tested, and kept up-to-date. Free to use, forever.",
    url: "https://agentpick.co",
    siteName: "AgentPick",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentPick — The AI Agent Marketplace You Can Actually Trust",
    description:
      "Curated skills and agents for OpenClaw, Claude Code, and beyond. Every listing is reviewed, tested, and kept up-to-date. Free to use, forever.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
