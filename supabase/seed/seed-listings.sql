-- ============================================================
-- AgentPick Seed Listings — Founder Content
-- From SEED_LISTINGS.md — 5 listings by AgentPick (alice_creator)
-- Run AFTER seed.sql
-- ============================================================

-- Site Health Monitor
INSERT INTO public.listings (id, creator_id, title, slug, description, short_desc, type, price_monthly, price_once, tags, status, install_count, avg_rating) VALUES
  (
    'bbbb0000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Site Health Monitor',
    'site-health-monitor',
    'Controlla periodicamente che il tuo sito (o quello del cliente) sia up, risponda entro soglia di latenza, e non abbia errori evidenti. In caso di problema, notifica immediatamente su Telegram. Configurabile su più URL.',
    'Monitor your site uptime and get instant Telegram alerts',
    'skill',
    NULL, NULL,
    ARRAY['monitoring', 'uptime', 'telegram', 'devops', 'automation'],
    'published', 0, NULL
  ),
  -- Daily Briefing Agent
  (
    'bbbb0000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Daily Briefing Agent',
    'daily-briefing-agent',
    'Ogni mattina ti manda un briefing personalizzato su Telegram: notizie dal tuo settore, meteo, to-do del giorno, e un insight da una fonte a scelta. Si configura in 2 minuti, gira autonomamente ogni giorno alle 7:00.',
    'Wake up to a personalized AI briefing on Telegram every morning',
    'agent',
    NULL, NULL,
    ARRAY['productivity', 'telegram', 'news', 'automation', 'morning-routine'],
    'published', 0, NULL
  ),
  -- Web Scraper + Digest
  (
    'bbbb0000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Web Scraper + Digest',
    'web-scraper-digest',
    'Scrapa una o più URL e produce un riassunto pulito in markdown — perfetto per monitorare competitor, prezzi, offerte di lavoro, o qualsiasi pagina che cambia. Configura URL e frequenza, ricevi digest su Telegram.',
    'Monitor any URL and receive clean markdown digests on Telegram',
    'skill',
    4.99, NULL,
    ARRAY['scraping', 'monitoring', 'telegram', 'competitor-analysis', 'automation'],
    'published', 0, NULL
  ),
  -- GitHub PR Reviewer
  (
    'bbbb0000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'GitHub PR Reviewer',
    'github-pr-reviewer',
    'Analizza le Pull Request aperte su un repo GitHub e produce un report dettagliato: quality check, potenziali bug, suggerimenti di miglioramento. Si integra con GitHub via gh CLI e manda il report su Telegram o Discord.',
    'Automated AI code review for your GitHub PRs',
    'agent',
    9.99, NULL,
    ARRAY['github', 'code-review', 'developer', 'telegram', 'discord'],
    'published', 0, NULL
  ),
  -- Lead Research Agent
  (
    'bbbb0000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Lead Research Agent',
    'lead-research-agent',
    'Dai un nome o un dominio azienda, l''agent trova informazioni pubbliche rilevanti: sito, LinkedIn, news recenti, tech stack, dimensione stimata. Output strutturato in markdown, pronto da incollare nel CRM.',
    'Research any company or lead in 30 seconds — structured markdown output',
    'agent',
    9.99, NULL,
    ARRAY['sales', 'lead-research', 'outreach', 'b2b', 'crm'],
    'published', 0, NULL
  )
ON CONFLICT (id) DO NOTHING;
