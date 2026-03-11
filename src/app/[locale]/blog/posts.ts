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
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
