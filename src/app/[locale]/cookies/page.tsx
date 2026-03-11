import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

const COOKIES_EN = `# Cookie Policy

**Platform:** AgentPick  
**Domain:** agentpick.co  
**Effective Date:** March 11, 2026  
**Last Updated:** March 11, 2026  
**Contact:** legal@agentpick.co

---

## 1. What Are Cookies?

Cookies are small text files placed on your device (computer, tablet, or smartphone) when you visit a website. They help websites remember information about your visit — such as whether you are logged in, your preferences, or how you navigate the site.

Similar technologies include **local storage**, **session storage**, and **pixel tags**. We refer to all of these collectively as "cookies" in this policy.

---

## 2. How We Use Cookies

We use cookies to:

- Keep you logged in and maintain your session
- Remember your preferences
- Understand how users navigate the Platform so we can improve it
- Detect security issues and prevent fraud

---

## 3. Types of Cookies We Use

We distinguish three categories of cookies, as recommended by EU regulators.

### 3.1 Strictly Necessary Cookies

These cookies are **essential** for the Platform to function. Without them, core features such as login and account management cannot work. They do not require your consent under the ePrivacy Directive.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| session_token | Maintains your authenticated session | Session (deleted when browser closes) |
| csrf_token | Protects against cross-site request forgery attacks | Session |
| auth_refresh | Keeps you logged in across page loads | 7 days |

These cookies contain no personally identifiable information beyond what is necessary to keep your session secure.

### 3.2 Functional Cookies

These cookies remember your choices and preferences to provide a more personalised experience. They are **optional** but improve usability. We ask for your consent before setting them.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| ui_theme | Remembers your dark/light mode preference | 1 year |
| lang_pref | Remembers your language preference | 1 year |
| onboarding_dismissed | Remembers if you have dismissed the onboarding prompt | 90 days |

### 3.3 Analytics Cookies

These cookies help us understand how users interact with the Platform — which pages are most visited, where users drop off, and how we can improve. They collect information in aggregate and do not identify you individually. We ask for your consent before setting them.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| _analytics_session | Tracks a single visit session for page-view analytics | Session |
| _analytics_user | Distinguishes unique visitors (anonymised ID) | 12 months |

We do **not** share analytics data with advertising networks. Analytics data is processed to improve AgentPick only.

---

## 4. Third-Party Cookies

We currently use the following third-party services that may set cookies:

| Provider | Purpose | Type | Privacy Policy |
|----------|---------|------|---------------|
| Supabase | Backend infrastructure (no tracking cookies) | Strictly Necessary | https://supabase.com/privacy |

We do not use Google Analytics, Facebook Pixel, or any advertising/retargeting cookies. If this changes, we will update this policy and request consent.

---

## 5. Your Consent and Choices

When you first visit AgentPick, we will present a **cookie consent banner** asking for your consent to functional and analytics cookies. Strictly necessary cookies are enabled automatically and do not require consent.

You can change your cookie preferences at any time by:

- Clicking the **"Cookie Settings"** link in the footer of the Platform
- Adjusting your browser settings (see below)

**Browser-level controls:**

Most browsers allow you to view, manage, delete, and block cookies. Here are links to instructions for common browsers:

- [Chrome](https://support.google.com/chrome/answer/95647)
- [Firefox](https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences)
- [Safari](https://support.apple.com/en-gb/guide/safari/sfri11471/mac)
- [Edge](https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09)

Please note: blocking all cookies may affect the functionality of the Platform, including your ability to stay logged in.

---

## 6. Do Not Track

Some browsers send a "Do Not Track" (DNT) signal. We currently do not change our data collection practices in response to DNT signals, as there is no uniform standard for interpreting them. We will revisit this as standards develop.

---

## 7. Changes to This Cookie Policy

We may update this Cookie Policy as we introduce new features or change our use of cookies. We will notify you of significant changes via the cookie consent banner or, if you have an account, by email.

---

## 8. More Information

For questions about our use of cookies, contact us at **legal@agentpick.co**.

For more on your rights and how we handle your personal data, see our **Privacy Policy**.`;

const COOKIES_IT = `# Cookie Policy

**Piattaforma:** AgentPick  
**Dominio:** agentpick.co  
**Data di entrata in vigore:** 11 marzo 2026  
**Ultimo aggiornamento:** 11 marzo 2026  
**Contatto:** legal@agentpick.co

---

## 1. Cosa Sono i Cookie?

I cookie sono piccoli file di testo che vengono salvati sul tuo dispositivo (computer, tablet o smartphone) quando visiti un sito web. Aiutano i siti web a ricordare informazioni sulla tua visita — come se sei autenticato, le tue preferenze o come navighi nel sito.

Tecnologie simili includono **local storage**, **session storage** e **pixel tag**. Nella presente Cookie Policy, ci riferiamo collettivamente a tutte queste tecnologie con il termine "cookie".

---

## 2. Come Utilizziamo i Cookie

Utilizziamo i cookie per:

- Mantenere attiva la tua sessione di accesso
- Ricordare le tue preferenze
- Capire come gli utenti navigano nella Piattaforma, in modo da poterla migliorare
- Rilevare problemi di sicurezza e prevenire frodi

---

## 3. Tipologie di Cookie che Utilizziamo

Distinguiamo tre categorie di cookie, come raccomandato dalle autorità di regolamentazione dell'UE.

### 3.1 Cookie Strettamente Necessari

Questi cookie sono **essenziali** per il funzionamento della Piattaforma. Senza di essi, le funzionalità principali come l'accesso e la gestione dell'account non possono funzionare. Non richiedono il tuo consenso ai sensi della Direttiva ePrivacy.

| Cookie | Finalità | Durata |
|--------|---------|--------|
| session_token | Mantiene attiva la tua sessione autenticata | Sessione (eliminato alla chiusura del browser) |
| csrf_token | Protegge dagli attacchi cross-site request forgery | Sessione |
| auth_refresh | Ti mantiene connesso tra un caricamento di pagina e l'altro | 7 giorni |

Questi cookie non contengono informazioni personali identificabili, se non quanto strettamente necessario per mantenere la sessione sicura.

### 3.2 Cookie Funzionali

Questi cookie ricordano le tue scelte e preferenze per offrirti un'esperienza più personalizzata. Sono **facoltativi** ma migliorano l'usabilità. Ti chiediamo il consenso prima di attivarli.

| Cookie | Finalità | Durata |
|--------|---------|--------|
| ui_theme | Ricorda la tua preferenza per la modalità chiara/scura | 1 anno |
| lang_pref | Ricorda la tua preferenza linguistica | 1 anno |
| onboarding_dismissed | Ricorda se hai chiuso il prompt di onboarding | 90 giorni |

### 3.3 Cookie Analitici

Questi cookie ci aiutano a capire come gli utenti interagiscono con la Piattaforma — quali pagine sono più visitate, dove gli utenti abbandonano la navigazione e come possiamo migliorare. Raccolgono informazioni in forma aggregata e non ti identificano individualmente. Ti chiediamo il consenso prima di attivarli.

| Cookie | Finalità | Durata |
|--------|---------|--------|
| _analytics_session | Traccia una singola sessione di visita per le analisi delle pagine viste | Sessione |
| _analytics_user | Distingue i visitatori unici (ID anonimizzato) | 12 mesi |

I dati analitici **non vengono condivisi** con reti pubblicitarie. I dati analitici vengono trattati esclusivamente per migliorare AgentPick.

---

## 4. Cookie di Terze Parti

Utilizziamo attualmente i seguenti servizi di terze parti che potrebbero impostare cookie:

| Fornitore | Finalità | Tipo | Informativa sulla Privacy |
|-----------|---------|------|--------------------------|
| Supabase | Infrastruttura backend (nessun cookie di tracciamento) | Strettamente Necessario | https://supabase.com/privacy |

Non utilizziamo Google Analytics, Facebook Pixel o cookie pubblicitari/di retargeting. In caso di modifica, aggiorneremo la presente Cookie Policy e richiederemo il consenso.

---

## 5. Il Tuo Consenso e le Tue Scelte

Alla tua prima visita su AgentPick, ti mostreremo un **banner di consenso ai cookie** per richiedere il tuo consenso all'uso dei cookie funzionali e analitici. I cookie strettamente necessari vengono attivati automaticamente e non richiedono il consenso.

Puoi modificare le tue preferenze sui cookie in qualsiasi momento:

- Cliccando sul link **"Impostazioni Cookie"** nel footer della Piattaforma
- Modificando le impostazioni del tuo browser (vedi di seguito)

**Controlli a livello di browser:**

La maggior parte dei browser consente di visualizzare, gestire, eliminare e bloccare i cookie. Di seguito trovi i link alle istruzioni per i browser più comuni:

- [Chrome](https://support.google.com/chrome/answer/95647?hl=it)
- [Firefox](https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie)
- [Safari](https://support.apple.com/it-it/guide/safari/sfri11471/mac)
- [Edge](https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09)

Tieni presente che il blocco di tutti i cookie potrebbe compromettere il funzionamento della Piattaforma, inclusa la possibilità di rimanere connesso.

---

## 6. Do Not Track

Alcuni browser inviano un segnale "Do Not Track" (DNT). Al momento non modifichiamo le nostre pratiche di raccolta dati in risposta ai segnali DNT, poiché non esiste uno standard uniforme per la loro interpretazione. Rivaluteremo questa posizione con l'evolversi degli standard.

---

## 7. Modifiche alla Presente Cookie Policy

Potremmo aggiornare la presente Cookie Policy man mano che introduciamo nuove funzionalità o modifichiamo il nostro utilizzo dei cookie. Ti informeremo delle modifiche significative tramite il banner di consenso ai cookie o, se hai un account, via email.

---

## 8. Ulteriori Informazioni

Per domande sull'utilizzo dei cookie da parte nostra, contattaci all'indirizzo **legal@agentpick.co**.

Per maggiori informazioni sui tuoi diritti e su come trattiamo i tuoi dati personali, consulta la nostra **Informativa sulla Privacy**.`;

const content: Record<string, string> = {
  en: COOKIES_EN,
  it: COOKIES_IT,
};

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!content[locale]) notFound();

  return (
    <main className="min-h-screen bg-gray-950 text-white font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <article className="prose prose-invert prose-purple max-w-none">
          <ReactMarkdown>{content[locale]}</ReactMarkdown>
        </article>
        <div className="mt-16 pt-8 border-t border-white/10 text-sm text-gray-500 flex gap-6">
          <a href={`/${locale}/privacy`} className="hover:text-purple-400 transition-colors">
            {locale === "it" ? "Privacy Policy" : "Privacy Policy"}
          </a>
          <a href={`/${locale}/terms`} className="hover:text-purple-400 transition-colors">
            {locale === "it" ? "Termini di Servizio" : "Terms of Service"}
          </a>
          <a href={`/${locale}`} className="hover:text-purple-400 transition-colors">
            ← {locale === "it" ? "Torna alla home" : "Back to home"}
          </a>
        </div>
      </div>
    </main>
  );
}
