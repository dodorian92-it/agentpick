import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://28687108cd066afc1d669bf7e6e222c2@o4511026396856320.ingest.de.sentry.io/4511026423398480",
  tracesSampleRate: 1.0,
  debug: false,
});
