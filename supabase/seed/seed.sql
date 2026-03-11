-- ============================================================
-- AgentPick Seed Data
-- Development only — 2 fake users, 5 fake listings
-- ============================================================

-- NOTE: These UUIDs are static for reproducibility in dev
-- Supabase Auth users must be created separately (or use service role)

-- Fake user profiles (bypass auth for seed purposes)
INSERT INTO public.users (id, username, full_name, bio, type, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'alice_creator', 'Alice Rossi', 'AI builder, ex-Google. Creator of productivity agents.', 'creator', NOW()),
  ('00000000-0000-0000-0000-000000000002', 'bob_buyer', 'Bob Esposito', 'SaaS founder, loves AI tools.', 'buyer', NOW())
ON CONFLICT (id) DO NOTHING;

-- Fake listings
INSERT INTO public.listings (id, creator_id, title, slug, description, short_desc, type, price_monthly, price_once, tags, status, install_count, avg_rating) VALUES
  (
    'aaaa0000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Email Triage Agent',
    'email-triage-agent',
    'An AI agent that reads your inbox, categorizes emails by urgency, drafts replies, and surfaces action items. Integrates with Gmail and Outlook via OAuth.',
    'Auto-triage your inbox with AI',
    'agent',
    9.99, NULL,
    ARRAY['email', 'productivity', 'gmail', 'outlook'],
    'published', 142, 4.7
  ),
  (
    'aaaa0000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'SEO Content Skill',
    'seo-content-skill',
    'A skill that generates SEO-optimized blog posts given a keyword, target audience, and tone. Outputs structured markdown with meta tags.',
    'Generate SEO blog posts from a keyword',
    'skill',
    NULL, 29.00,
    ARRAY['seo', 'content', 'writing', 'marketing'],
    'published', 88, 4.4
  ),
  (
    'aaaa0000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Slack Standup Bot',
    'slack-standup-bot',
    'Agent that collects daily standups from your Slack team, summarizes blockers, and posts a digest to a channel of your choice.',
    'Automate team standups in Slack',
    'agent',
    14.99, NULL,
    ARRAY['slack', 'team', 'productivity', 'standup'],
    'published', 210, 4.8
  ),
  (
    'aaaa0000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'CSV Analyzer Skill',
    'csv-analyzer-skill',
    'Upload any CSV and get instant data analysis: distributions, anomalies, correlation matrix, and natural-language summary.',
    'Instant AI analysis for any CSV',
    'skill',
    NULL, 19.00,
    ARRAY['data', 'analytics', 'csv', 'no-code'],
    'published', 55, 4.2
  ),
  (
    'aaaa0000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Social Media Scheduler Agent',
    'social-media-scheduler-agent',
    'AI agent that drafts, schedules, and posts content to Twitter/X, LinkedIn, and Instagram. Includes performance analytics and best-time recommendations.',
    'Schedule AI-generated posts across social platforms',
    'agent',
    19.99, NULL,
    ARRAY['social', 'marketing', 'twitter', 'linkedin', 'instagram'],
    'published', 301, 4.6
  )
ON CONFLICT (id) DO NOTHING;
