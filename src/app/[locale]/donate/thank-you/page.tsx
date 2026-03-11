"use client";

import { useLocale } from "next-intl";
import Link from "next/link";

export default function DonateThankYouPage() {
  const locale = useLocale();
  const isIT = locale === "it";

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="text-6xl mb-6">💜</div>

        {/* Heading */}
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          {isIT ? "Grazie mille!" : "Thank you!"}
        </h1>

        {/* Message */}
        <p className="text-gray-300 text-lg mb-3">
          {isIT
            ? "La tua donazione ci aiuta a mantenere AgentPick aperto e gratuito per tutti."
            : "Your donation helps us keep AgentPick open and free for everyone."}
        </p>
        <p className="text-gray-500 text-sm mb-10">
          {isIT
            ? "Ogni contributo conta davvero — grazie per il tuo supporto."
            : "Every contribution truly matters — thanks for your support."}
        </p>

        {/* Back home */}
        <Link
          href={`/${locale}`}
          className="inline-block px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-sm font-medium"
        >
          {isIT ? "← Torna alla home" : "← Back to home"}
        </Link>
      </div>
    </main>
  );
}
