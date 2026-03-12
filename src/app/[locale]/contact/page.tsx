export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isIt = locale === 'it';
  return (
    <main className="min-h-screen bg-gray-950 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <a href={`/${locale}`} className="text-sm text-blue-400 hover:text-blue-300 mb-8 block">
          ← {isIt ? 'Torna alla home' : 'Back to home'}
        </a>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-white mb-6">{isIt ? 'Contatti' : 'Contact'}</h1>
          <div className="text-gray-300 space-y-4 text-sm leading-relaxed">
            <p>Email: <a href="mailto:support@agentpick.co" className="text-blue-400">support@agentpick.co</a></p>
            <p>Discord: <a href="https://discord.gg/agentpick" className="text-blue-400">discord.gg/agentpick</a></p>
          </div>
        </div>
      </div>
    </main>
  );
}
