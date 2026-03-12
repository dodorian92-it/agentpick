export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIt = locale === 'it';
  return (
    <main className="min-h-screen bg-gray-950 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <a href={`/${locale}`} className="text-sm text-blue-400 hover:text-blue-300 mb-8 block">
          ← {isIt ? 'Torna alla home' : 'Back to home'}
        </a>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-white mb-6">{isIt ? 'Chi siamo' : 'About'}</h1>
          <div className="text-gray-300 space-y-4 text-sm leading-relaxed">
            <p>{isIt ? 'AgentPick è un marketplace gratuito di AI agent e skill per OpenClaw, Claude Code e beyond.' : 'AgentPick is a free marketplace for AI agents and skills for OpenClaw, Claude Code, and beyond.'}</p>
            <p>{isIt ? 'Fondato da Michele Telesca. Nessun prezzo, nessuna commissione. La piattaforma è sostenuta da donazioni volontarie.' : 'Founded by Michele Telesca. No pricing, no commissions. The platform is supported by voluntary donations.'}</p>
            <p>Email: <a href="mailto:support@agentpick.co" className="text-blue-400">support@agentpick.co</a></p>
          </div>
        </div>
      </div>
    </main>
  );
}
