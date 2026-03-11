import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";

const OPENCLAW_HOOK_URL = process.env.OPENCLAW_HOOK_URL!;
const OPENCLAW_HOOK_TOKEN = process.env.OPENCLAW_HOOK_TOKEN!;
const SENTRY_WEBHOOK_SECRET = process.env.SENTRY_WEBHOOK_SECRET!;

function verifySentrySignature(body: string, signature: string): boolean {
  if (!SENTRY_WEBHOOK_SECRET) return true; // skip in dev
  const expected = crypto
    .createHmac("sha256", SENTRY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature.replace("sha256=", ""), "hex"),
    Buffer.from(expected, "hex")
  );
}

// Auto-fixable patterns — Jarvis fix autonomamente
const AUTO_FIX_PATTERNS = [
  /null/i,
  /undefined/i,
  /TypeError/i,
  /cannot read prop/i,
  /is not a function/i,
  /missing import/i,
  /ReferenceError/i,
];

// Escalate sempre — richiedono revisione umana
const ESCALATE_PATTERNS = [
  /auth/i,
  /payment/i,
  /stripe/i,
  /migration/i,
  /security/i,
  /sql injection/i,
  /permission/i,
];

function triage(issue: { title: string; culprit: string }): "auto-fix" | "escalate" {
  const text = `${issue.title} ${issue.culprit}`;
  if (ESCALATE_PATTERNS.some((p) => p.test(text))) return "escalate";
  if (AUTO_FIX_PATTERNS.some((p) => p.test(text))) return "auto-fix";
  return "escalate"; // default safe
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("sentry-hook-signature") ?? "";

  if (SENTRY_WEBHOOK_SECRET && !verifySentrySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = payload.action as string;
  if (action !== "created" && action !== "triggered") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const issue = payload.data as { issue: { title: string; culprit: string; id: string; permalink: string } };
  const { title, culprit, id, permalink } = issue?.issue ?? {};
  const decision = triage({ title, culprit });

  // Invia al webhook OpenClaw per triage e azione
  const message =
    decision === "auto-fix"
      ? `🔧 Sentry alert AUTO-FIX: "${title}" in ${culprit}\nIssue: ${permalink}\nRepo: /tmp/agentpick-v2\n\nEsegui: 1) Analizza il bug, 2) Crea un fix nel repo, 3) Commit su branch fix/sentry-${id}, 4) Apri PR su GitHub targeting main, 5) Notifica Michele su Telegram con il link alla PR.`
      : `🚨 Sentry alert ESCALATE: "${title}" in ${culprit}\nIssue: ${permalink}\n\nRichiede revisione umana — non auto-fixare. Notifica Michele su Telegram con dettagli.`;

  if (OPENCLAW_HOOK_URL && OPENCLAW_HOOK_TOKEN) {
    await fetch(`${OPENCLAW_HOOK_URL}/hooks/agent`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENCLAW_HOOK_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        name: "Sentry",
        deliver: true,
        channel: "telegram",
        to: "625253348",
        timeoutSeconds: 180,
      }),
    }).catch(console.error);
  }

  return NextResponse.json({ ok: true, decision });
}
