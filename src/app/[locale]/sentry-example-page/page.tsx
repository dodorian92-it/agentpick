"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryExamplePage() {
  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Sentry Test Page</h1>
      <p>Click the button to trigger a test error and verify Sentry is working.</p>
      <button
        style={{ padding: "10px 20px", marginRight: 10, cursor: "pointer" }}
        onClick={() => {
          throw new Error("Sentry test error from agentpick.co — pipeline active");
        }}
      >
        Trigger Frontend Error
      </button>
      <button
        style={{ padding: "10px 20px", cursor: "pointer" }}
        onClick={async () => {
          await fetch("/api/sentry-test");
        }}
      >
        Trigger Server Error
      </button>
    </div>
  );
}
