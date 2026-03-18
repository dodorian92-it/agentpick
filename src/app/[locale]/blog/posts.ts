export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export const posts: Post[] = [
  {
    slug: "how-to-build-your-first-ai-agent-with-openclaw",
    title: "How to build your first AI agent with OpenClaw",
    date: "2026-03-11",
    excerpt:
      "OpenClaw is the open-source runtime for personal AI agents. In this guide you'll go from zero to a running agent in under 10 minutes.",
    content: `## What is OpenClaw?

OpenClaw is an open-source runtime that turns a large language model into a personal AI agent that actually *does things*. Instead of just chatting, your agent can browse the web, send Telegram messages, run shell commands, manage files, and call APIs — all without you lifting a finger.

Think of it as the operating system for your AI. You define the agent's identity and goals; OpenClaw handles scheduling, tool access, memory, and delivery.

## Installation

Getting started takes about two minutes:

\`\`\`bash
npm install -g openclaw
openclaw init
openclaw gateway start
\`\`\`

That's it. Your agent is now running locally. Point your Telegram bot token at it and you have a personal assistant reachable from your phone 24/7.

## What can you automate?

### Heartbeats
Schedule recurring tasks — nightly revenue reviews, site health checks, daily briefings — using OpenClaw's built-in cron system. Your agent wakes up, does the work, and reports back.

\`\`\`bash
openclaw cron add "0 8 * * *" "Send me a morning summary"
\`\`\`

### Telegram integration
Your agent lives in Telegram out of the box. Send it a message and it replies with real actions: searching the web, reading files, calling your APIs, or triggering other agents.

### Web scraping & research
The \`browser\` and \`web_fetch\` tools let your agent pull live data from any public site — competitor prices, news, job listings, whatever you need — and summarize or act on it automatically.

### Multi-agent workflows
Spawn sub-agents for long-running tasks. Your main agent stays responsive while a coding agent refactors your codebase or a research agent compiles a report.

## Skills — packaged automation

OpenClaw has a skill system. Each skill is a self-contained module with a \`SKILL.md\` that tells the agent how to use it. Install community skills from ClawHub or write your own:

\`\`\`bash
clawhub install revenue-metrics
clawhub install x-posting
\`\`\`

## Publish your agent on AgentPick

Once your agent is doing something useful, share it. AgentPick is the marketplace for OpenClaw agents and skills. List what your agent does, set a price, and let other developers run it without building from scratch.

Publishing takes minutes: package your skill folder, write a short description, and submit. You keep full control — your agent runs on your infrastructure, AgentPick just handles discovery and payments.

## Next steps

- **[openclaw.com](https://openclaw.com)** — docs, quickstart, and examples
- **ClawHub** — community skill registry
- **AgentPick** — list your agent and start earning

The best way to learn is to ship something. Pick one repetitive task in your workflow, describe it to your agent, and watch it run.`,
  },
  {
    slug: "best-openclaw-skills-2026",
    title: "The 10 best OpenClaw skills to install right now",
    date: "2026-03-15",
    excerpt:
      "OpenClaw's skill system lets you extend your AI agent in minutes. Here are the ten skills worth installing today — from revenue tracking to social posting.",
    content: `## What are OpenClaw skills?

Skills are packaged modules that give your OpenClaw agent new capabilities. Each skill ships with a \`SKILL.md\` — a plain-text instruction file your agent reads at runtime — plus any scripts, configs, or assets it needs.

Install one in seconds:

\`\`\`bash
clawhub install revenue-metrics
\`\`\`

Your agent immediately knows how to pull Stripe revenue, compare periods, and send you a nightly summary. No code changes. No API wiring. Just install and ask.

Here are the ten skills that consistently deliver the most value.

## 1. revenue-metrics

Connects to your Stripe account and surfaces daily, weekly, and monthly revenue with period-over-period comparisons. Pair it with a nightly heartbeat and you wake up to a P&L in your inbox.

**Best for:** Founders, indie hackers, SaaS operators.

## 2. x-posting

Post tweets, read mentions, reply, like, and search on X/Twitter via the official v2 API. Schedule posts, monitor competitors, or auto-reply to keywords — all from a single agent instruction.

**Best for:** Creators, marketers, anyone building a personal brand.

## 3. coding-agent

Delegates coding tasks to Codex, Claude Code, or other AI coding agents running in background PTY sessions. Describe a feature; come back to a PR.

**Best for:** Developers who want AI doing the grunt work while they think.

## 4. gh-issues

Fetches open GitHub issues, spawns sub-agents to implement fixes, opens PRs, and monitors review comments. Close your backlog on autopilot.

**Best for:** Open-source maintainers, small engineering teams.

## 5. research

Uses Grok's web search and X/Twitter search to find real-time information — news, media appearances, company data, people. Returns cited summaries, not hallucinations.

**Best for:** Anyone who needs live data before making a decision.

## 6. weather

Pulls current conditions and forecasts from wttr.in and Open-Meteo. No API key needed. Useful as a dependency for other workflows (e.g. "only schedule the outdoor event if it's not raining").

**Best for:** Utility / building blocks for more complex agents.

## 7. site-health

Checks production URLs for uptime and correct HTTP status codes. Runs every heartbeat and alerts you immediately if something goes down. Simple, reliable, essential.

**Best for:** Anyone running a web product.

## 8. cron-guide

Documents OpenClaw's built-in cron system so your agent can create, modify, and reason about scheduled tasks correctly. Meta-skill: it makes your agent better at scheduling everything else.

**Best for:** Power users building complex automation pipelines.

## 9. daily-review

Runs a nightly revenue review and proposes tomorrow's plan. Pulls metrics, summarizes what got done, identifies wins and blockers, and sends a structured briefing. The backbone of a CEO-mode agent.

**Best for:** Founders who want to wake up briefed.

## 10. tavily

Uses Tavily's search API for high-quality web discovery — lead research, cited summaries, URL harvesting. More structured than a generic search when you need reliable sources.

**Best for:** Research-heavy workflows, content creation, lead gen.

## Where to find more skills

The community is building fast. Browse the full catalog on **[AgentPick](https://agentpick.co)** — every listing is reviewed, tested against a real OpenClaw install, and kept up to date.

If you've built something useful, publish it. The marketplace is open to any creator.`,
  },
  {
    slug: "ai-agent-marketplace-guide",
    title: "AI agent marketplaces explained: what they are and why they matter",
    date: "2026-03-18",
    excerpt:
      "AI agent marketplaces are emerging as the app stores of the agentic era. Here's what they are, how they work, and what to look for when choosing one.",
    content: `## The shift from chatbots to agents

For the first two years of the generative AI wave, most products were chatbots. You asked, they answered. Useful, but passive.

The next wave is agents — AI systems that take actions, not just produce text. They browse the web, write and run code, send emails, manage calendars, call APIs, spawn other agents. The difference is not subtle: a chatbot tells you how to do something; an agent does it.

As agents proliferate, a new category of infrastructure has emerged: **agent marketplaces**.

## What is an AI agent marketplace?

An agent marketplace is a platform where developers publish packaged agents or skills, and users install them into their own AI runtime. Think of it as an app store — but instead of mobile apps, the "apps" are autonomous capabilities your AI agent can use.

A good marketplace entry includes:
- What the agent or skill does
- What runtime it targets (OpenClaw, Claude Code, custom harness, etc.)
- Installation instructions
- A demo or screenshot
- Pricing or license terms
- Creator reputation and version history

## Why they matter

**For users:** You don't have to build from scratch. Someone has already solved "post to X/Twitter on a schedule" or "pull Stripe revenue nightly." Install their work, customize it, ship faster.

**For creators:** Packaging your automation as a skill turns one-off work into recurring income. Build once, sell many times. The best skills address problems thousands of developers share.

**For the ecosystem:** Marketplaces create standards. When skills follow a common format, agents can reason about and compose them. The whole becomes more than the sum of its parts.

## What to look for in a marketplace

### 1. Quality filtering
An open catalog with no curation is a junk drawer. The best marketplaces review submissions — they verify the skill works, the documentation is accurate, and the creator responds to issues.

### 2. Runtime compatibility
Make sure skills target the runtime you use. An OpenClaw skill won't work in a LangChain setup without porting. The best marketplaces are explicit about compatibility.

### 3. Trust signals
Who built this? When was it last updated? Does it have real installs and reviews? A skill that hasn't been touched in six months and has zero installs is a risk.

### 4. Business model alignment
One-time purchases favor creators but leave users with no guarantee of updates. Subscription models create ongoing incentives to maintain and improve. Neither is universally better — the right model depends on the skill type.

### 5. Discovery
Can you find what you need? Good marketplaces invest in search, tagging, and curation. If you have to scroll through 500 undifferentiated listings, the marketplace isn't doing its job.

## The current landscape

The agent marketplace space is early. Most runtimes have a community repository of some kind — ClawHub for OpenClaw, the Claude Code Skills directory — but few have the polish of a real marketplace.

**[AgentPick](https://agentpick.co)** is building toward the standard: curated catalog, tested listings, multi-runtime support, free to browse. It's early, but the direction is clear.

## What's coming

As agent runtimes mature, marketplaces will evolve from simple directories into active infrastructure:

- **Composition layers** — marketplaces that let you stack skills into pipelines without writing code
- **Agent-to-agent discovery** — your agent searches the marketplace at runtime to acquire new capabilities on demand
- **Reputation systems** — creator scores, skill reliability metrics, community reviews
- **Revenue sharing** — transparent splits between marketplace and creator, with usage-based pricing

The agentic era is just starting. The platforms that establish trust and quality standards now will be the Rails or npm of the next decade.`,
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
