import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, type } = await req.json();

    if (!email || !type) {
      return NextResponse.json({ error: "Email and type are required" }, { status: 400 });
    }

    if (!["buyer", "creator"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Lazy init to avoid build-time errors
    const { createClient } = await import("@supabase/supabase-js");
    const { Resend } = await import("resend");

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
    const resend = new Resend(process.env.RESEND_API_KEY!);

    // Insert into Supabase
    const { error: dbError } = await supabase
      .from("waitlist")
      .insert({ email, type });

    if (dbError) {
      if (dbError.code === "23505") {
        return NextResponse.json({ error: "You're already on the waitlist!" }, { status: 409 });
      }
      console.error("Supabase error:", dbError);
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
    }

    // Send confirmation email
    const isBuyer = type === "buyer";
    await resend.emails.send({
      from: "AgentPick <onboarding@resend.dev>",
      to: email,
      subject: "You're on the AgentPick waitlist! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #030712; color: #e5e7eb; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 40px auto; padding: 40px; background: #111827; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); }
              .logo { font-size: 24px; font-weight: 800; background: linear-gradient(to right, #a855f7, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 32px; }
              h1 { font-size: 28px; font-weight: 700; color: #f9fafb; margin: 0 0 12px; }
              p { color: #9ca3af; line-height: 1.7; margin: 0 0 16px; }
              .highlight { background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 12px; padding: 20px; margin: 24px 0; }
              .highlight p { color: #d8b4fe; margin: 0; font-weight: 600; }
              .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); }
              .footer p { font-size: 12px; color: #4b5563; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">AgentPick</div>
              <h1>You're on the list! 🎉</h1>
              <p>Thanks for joining the AgentPick waitlist. We're building the AI agent marketplace you can actually trust — curated, maintained, and verified.</p>
              <p>You signed up as a <strong style="color: #f9fafb;">${isBuyer ? "buyer" : "creator"}</strong>. Here's what that means for you:</p>
              <div class="highlight">
                <p>${isBuyer
                  ? "🎁 AgentPick is completely free to use. Discover and install skills and agents at no cost — forever."
                  : "🚀 Early creator perk: publish your skills and agents for free. No fees, no revenue split — ever."
                }</p>
              </div>
              <p>We'll reach out when we're ready to open the doors. Expect:</p>
              <ul style="color: #9ca3af; line-height: 2; padding-left: 20px;">
                <li>Launch announcement with your exclusive link</li>
                <li>${isBuyer ? "Instant free access to the full catalog" : "Creator onboarding with zero fees"}</li>
                <li>Early access before the general public</li>
              </ul>
              <div class="footer">
                <p>© 2026 AgentPick — Built for the OpenClaw ecosystem</p>
                <p>You're receiving this because you joined our waitlist. No spam, ever.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
