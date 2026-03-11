import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

const PRIVACY_EN = `# Privacy Policy

**Platform:** AgentPick  
**Domain:** agentpick.co  
**Effective Date:** March 11, 2026  
**Last Updated:** March 11, 2026  
**Contact:** legal@agentpick.co

---

## 1. Who We Are

AgentPick ("we", "us", "our") operates the platform available at agentpick.co — an online marketplace where users can discover, subscribe to, and publish AI agents and skills. This Privacy Policy explains how we collect, use, store, and protect your personal data, in accordance with the EU General Data Protection Regulation (GDPR), Regulation (EU) 2016/679.

> **Note:** AgentPick is in the process of incorporation. Until formal incorporation is complete, the platform is operated by its founders. This policy will be updated upon incorporation with full company details.

For any privacy-related questions, contact us at: **legal@agentpick.co**

---

## 2. What Data We Collect and Why (Art. 13 GDPR)

We collect only the data we need to run the platform. Below is a full account of what we collect, why, and on what legal basis.

### 2.1 Account Registration

| Data | Purpose | Legal Basis |
|------|---------|-------------|
| Email address | Account creation, login, transactional emails | Art. 6(1)(b) — performance of a contract |
| Account type (buyer / creator) | To provide the correct experience and features | Art. 6(1)(b) — performance of a contract |
| Password (hashed, never stored in plain text) | Authentication | Art. 6(1)(b) — performance of a contract |

### 2.2 Usage Data

| Data | Purpose | Legal Basis |
|------|---------|-------------|
| Pages visited, features used, session duration | Improve the platform, detect bugs, understand user behaviour | Art. 6(1)(f) — legitimate interests (platform improvement) |
| Device type, browser, operating system | Technical compatibility and debugging | Art. 6(1)(f) — legitimate interests |
| IP address (anonymised after 30 days) | Security, fraud prevention, geolocation (country-level) | Art. 6(1)(f) — legitimate interests |

### 2.3 Creator-Specific Data

| Data | Purpose | Legal Basis |
|------|---------|-------------|
| Payment information (processed by third-party provider) | Revenue share payouts | Art. 6(1)(b) — performance of a contract |
| Published agent/skill content | Platform display and marketplace operation | Art. 6(1)(b) — performance of a contract |

### 2.4 Communications

| Data | Purpose | Legal Basis |
|------|---------|-------------|
| Email address | Service notifications, security alerts, platform updates | Art. 6(1)(b) — performance of a contract |
| Email address (marketing) | Promotional emails about new features or agents | Art. 6(1)(a) — consent (opt-in) |

We do **not** collect: sensitive personal data (health, religion, ethnicity, etc.), data from minors under 16, or data unrelated to the operation of the platform.

---

## 3. How We Store Your Data

Your data is stored securely using **Supabase**, hosted in the **European Union (EU region)**. This means your data never leaves the EU, ensuring compliance with GDPR's data transfer rules.

Email communications are sent via **Resend**, a transactional email provider. Resend processes your email address solely to deliver messages on our behalf under a data processing agreement.

All data is stored using encryption at rest and in transit (TLS).

---

## 4. How Long We Keep Your Data (Retention)

| Data Type | Retention Period |
|-----------|----------------|
| Account data | Until account deletion + 30 days (for recovery) |
| Usage data (raw) | 12 months, then aggregated/anonymised |
| IP addresses | 30 days, then anonymised |
| Marketing consent records | Until withdrawn + 3 years (legal compliance) |
| Creator payment records | 7 years (Italian tax law obligations) |
| Support correspondence | 3 years after last contact |

When your account is deleted, we delete or anonymise your personal data within 30 days, except where we are legally required to retain it (e.g., financial records).

---

## 5. Who We Share Your Data With

We do not sell your data. We share data only with:

| Recipient | Role | Purpose |
|-----------|------|---------|
| Supabase | Data processor | Database hosting (EU region) |
| Resend | Data processor | Transactional email delivery |
| Payment processor (TBD) | Data processor | Creator payout processing |
| Public authorities | Independent controller | If legally required (e.g., court order) |

All processors are bound by data processing agreements (DPAs) and are obligated to process your data only on our instructions.

---

## 6. International Data Transfers

Your data is stored and processed within the EU. If any processor transfers data outside the EU/EEA, we ensure appropriate safeguards are in place, including:

- Standard Contractual Clauses (SCCs) approved by the European Commission
- Adequacy decisions where applicable

---

## 7. Your Rights Under GDPR

You have the following rights regarding your personal data:

| Right | What It Means |
|-------|--------------|
| **Access** (Art. 15) | Request a copy of all data we hold about you |
| **Rectification** (Art. 16) | Ask us to correct inaccurate data |
| **Erasure** (Art. 17) | Request deletion of your data ("right to be forgotten") |
| **Restriction** (Art. 18) | Ask us to limit how we use your data |
| **Portability** (Art. 20) | Receive your data in a machine-readable format |
| **Objection** (Art. 21) | Object to processing based on legitimate interests or direct marketing |
| **Withdraw Consent** (Art. 7) | Withdraw consent at any time, without affecting prior processing |

To exercise any right, email us at **legal@agentpick.co**. We will respond within **30 days**. In complex cases, we may extend this by an additional 60 days with notice.

You also have the right to **lodge a complaint** with your national data protection authority. In Italy, this is the **Garante per la protezione dei dati personali** (www.garanteprivacy.it).

---

## 8. Automated Decision-Making

We do not use fully automated decision-making (including profiling) that produces legal or similarly significant effects on you.

---

## 9. Cookies

We use cookies and similar tracking technologies. For full details, see our **Cookie Policy**.

---

## 10. Children

AgentPick is not directed at children under 16. We do not knowingly collect data from minors. If you believe a minor has provided us with personal data, contact us at legal@agentpick.co and we will delete it promptly.

---

## 11. Changes to This Policy

We may update this Privacy Policy from time to time. When we make significant changes, we will notify you by email (if you have an account) or via a banner on the platform. The "Last Updated" date at the top of this document reflects the most recent revision.

Continued use of the platform after changes constitutes acceptance of the updated policy.

---

## 12. Contact

**AgentPick**  
agentpick.co  
Email: legal@agentpick.co

For urgent data protection concerns, we aim to acknowledge your message within **48 hours**.`;

const PRIVACY_IT = `# Informativa sulla Privacy

**Piattaforma:** AgentPick  
**Dominio:** agentpick.co  
**Data di entrata in vigore:** 11 marzo 2026  
**Ultimo aggiornamento:** 11 marzo 2026  
**Contatto:** legal@agentpick.co

---

## 1. Chi Siamo

AgentPick ("noi", "ci", "nostro") gestisce la piattaforma disponibile all'indirizzo agentpick.co — un marketplace online dove gli utenti possono scoprire, sottoscrivere e pubblicare agenti AI e skill. La presente Informativa sulla Privacy spiega come raccogliamo, utilizziamo, conserviamo e proteggiamo i tuoi dati personali, in conformità con il Regolamento Generale sulla Protezione dei Dati dell'UE (GDPR), Regolamento (UE) 2016/679.

> **Nota:** AgentPick è in fase di costituzione societaria. Fino al completamento della procedura, la piattaforma è gestita dai suoi fondatori. La presente informativa sarà aggiornata con i dati societari completi al momento della costituzione.

Per qualsiasi domanda relativa alla privacy, contattaci all'indirizzo: **legal@agentpick.co**

---

## 2. Quali Dati Raccogliamo e Perché (Art. 13 GDPR)

Raccogliamo solo i dati necessari al funzionamento della piattaforma. Di seguito trovi un resoconto completo di cosa raccogliamo, per quale finalità e su quale base giuridica.

### 2.1 Registrazione dell'Account

| Dato | Finalità | Base Giuridica |
|------|---------|----------------|
| Indirizzo email | Creazione account, accesso, email transazionali | Art. 6(1)(b) — esecuzione di un contratto |
| Tipo di account (acquirente / creatore) | Fornire l'esperienza e le funzionalità appropriate | Art. 6(1)(b) — esecuzione di un contratto |
| Password (con hash, mai in chiaro) | Autenticazione | Art. 6(1)(b) — esecuzione di un contratto |

### 2.2 Dati di Utilizzo

| Dato | Finalità | Base Giuridica |
|------|---------|----------------|
| Pagine visitate, funzionalità utilizzate, durata sessione | Miglioramento della piattaforma, rilevamento bug, analisi del comportamento degli utenti | Art. 6(1)(f) — legittimo interesse (miglioramento della piattaforma) |
| Tipo di dispositivo, browser, sistema operativo | Compatibilità tecnica e debug | Art. 6(1)(f) — legittimo interesse |
| Indirizzo IP (anonimizzato dopo 30 giorni) | Sicurezza, prevenzione frodi, geolocalizzazione (livello paese) | Art. 6(1)(f) — legittimo interesse |

### 2.3 Dati Specifici dei Creatori

| Dato | Finalità | Base Giuridica |
|------|---------|----------------|
| Informazioni di pagamento (gestite da fornitore terzo) | Liquidazione quota ricavi | Art. 6(1)(b) — esecuzione di un contratto |
| Contenuto di agenti/skill pubblicati | Visualizzazione sulla piattaforma e funzionamento del marketplace | Art. 6(1)(b) — esecuzione di un contratto |

### 2.4 Comunicazioni

| Dato | Finalità | Base Giuridica |
|------|---------|----------------|
| Indirizzo email | Notifiche di servizio, avvisi di sicurezza, aggiornamenti della piattaforma | Art. 6(1)(b) — esecuzione di un contratto |
| Indirizzo email (marketing) | Email promozionali su nuove funzionalità o agenti | Art. 6(1)(a) — consenso (opt-in) |

**Non raccogliamo:** dati personali sensibili (salute, religione, etnia, ecc.), dati di minori di 16 anni, né dati non pertinenti al funzionamento della piattaforma.

---

## 3. Come Conserviamo i Tuoi Dati

I tuoi dati sono conservati in modo sicuro tramite **Supabase**, ospitato nella **regione europea dell'UE**. Ciò significa che i tuoi dati non escono mai dall'UE, garantendo la conformità alle norme GDPR sui trasferimenti di dati.

Le comunicazioni email vengono inviate tramite **Resend**, un fornitore di email transazionali. Resend tratta il tuo indirizzo email esclusivamente per la consegna dei messaggi per nostro conto, nell'ambito di un accordo sul trattamento dei dati.

Tutti i dati sono protetti con cifratura a riposo e in transito (TLS).

---

## 4. Per Quanto Tempo Conserviamo i Tuoi Dati (Conservazione)

| Tipo di Dato | Periodo di Conservazione |
|--------------|--------------------------|
| Dati dell'account | Fino alla cancellazione dell'account + 30 giorni (per il ripristino) |
| Dati di utilizzo (grezzi) | 12 mesi, poi aggregati/anonimizzati |
| Indirizzi IP | 30 giorni, poi anonimizzati |
| Registri del consenso marketing | Fino alla revoca + 3 anni (conformità legale) |
| Registri pagamenti creatori | 7 anni (obblighi fiscali ai sensi della legge italiana) |
| Corrispondenza con il supporto | 3 anni dall'ultimo contatto |

Quando il tuo account viene eliminato, provvediamo a cancellare o anonimizzare i tuoi dati personali entro 30 giorni, salvo obbligo legale di conservazione (ad es. documentazione finanziaria).

---

## 5. Con Chi Condividiamo i Tuoi Dati

Non vendiamo i tuoi dati. Li condividiamo esclusivamente con:

| Destinatario | Ruolo | Finalità |
|--------------|-------|---------|
| Supabase | Responsabile del trattamento | Hosting del database (regione UE) |
| Resend | Responsabile del trattamento | Invio di email transazionali |
| Gestore pagamenti (da definire) | Responsabile del trattamento | Liquidazione ricavi ai creatori |
| Autorità pubbliche | Titolare autonomo | Se richiesto per legge (es. ordine del giudice) |

Tutti i responsabili del trattamento sono vincolati da accordi sul trattamento dei dati (DPA) e obbligati a trattare i tuoi dati esclusivamente su nostra istruzione.

---

## 6. Trasferimenti Internazionali di Dati

I tuoi dati sono conservati ed elaborati all'interno dell'UE. Qualora un responsabile del trattamento dovesse trasferire dati al di fuori dell'UE/SEE, ci assicuriamo che siano in vigore adeguate garanzie, tra cui:

- Clausole Contrattuali Standard (CCS) approvate dalla Commissione europea
- Decisioni di adeguatezza, ove applicabili

---

## 7. I Tuoi Diritti ai Sensi del GDPR

Hai i seguenti diritti in merito ai tuoi dati personali:

| Diritto | Cosa Significa |
|---------|---------------|
| **Accesso** (Art. 15) | Richiedere una copia di tutti i dati che conserviamo su di te |
| **Rettifica** (Art. 16) | Chiederci di correggere dati inesatti |
| **Cancellazione** (Art. 17) | Richiedere la cancellazione dei tuoi dati ("diritto all'oblio") |
| **Limitazione** (Art. 18) | Chiederci di limitare l'utilizzo dei tuoi dati |
| **Portabilità** (Art. 20) | Ricevere i tuoi dati in un formato leggibile da macchina |
| **Opposizione** (Art. 21) | Opporti al trattamento basato sul legittimo interesse o sul marketing diretto |
| **Revoca del Consenso** (Art. 7) | Revocare il consenso in qualsiasi momento, senza pregiudicare il trattamento precedente |

Per esercitare uno qualsiasi di questi diritti, scrivi a **legal@agentpick.co**. Risponderemo entro **30 giorni**. Nei casi più complessi potremmo estendere il termine di ulteriori 60 giorni, con relativa comunicazione.

Hai inoltre il diritto di **presentare un reclamo** all'autorità nazionale di protezione dei dati. In Italia, si tratta del **Garante per la protezione dei dati personali** (www.garanteprivacy.it).

---

## 8. Decisioni Automatizzate

Non utilizziamo processi decisionali interamente automatizzati (inclusa la profilazione) che producano effetti giuridici o decisioni di analoga rilevanza nei tuoi confronti.

---

## 9. Cookie

Utilizziamo cookie e tecnologie di tracciamento similari. Per tutti i dettagli, consulta la nostra **Cookie Policy**.

---

## 10. Minori

AgentPick non è destinata a minori di 16 anni. Non raccogliamo consapevolmente dati di minori. Se ritieni che un minore ci abbia fornito dati personali, contattaci all'indirizzo legal@agentpick.co e provvederemo alla cancellazione tempestiva.

---

## 11. Modifiche alla Presente Informativa

Potremmo aggiornare la presente Informativa sulla Privacy di tanto in tanto. In caso di modifiche significative, ti informeremo via email (se hai un account) o tramite un banner sulla piattaforma. La data "Ultimo aggiornamento" in cima al documento riflette la revisione più recente.

L'utilizzo continuato della piattaforma dopo le modifiche costituisce accettazione dell'informativa aggiornata.

---

## 12. Contatti

**AgentPick**  
agentpick.co  
Email: legal@agentpick.co

Per problemi urgenti relativi alla protezione dei dati, ci impegniamo a confermare la ricezione del tuo messaggio entro **48 ore**.`;

const content: Record<string, string> = {
  en: PRIVACY_EN,
  it: PRIVACY_IT,
};

export default async function PrivacyPage({
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
          <a href={`/${locale}/terms`} className="hover:text-purple-400 transition-colors">
            {locale === "it" ? "Termini di Servizio" : "Terms of Service"}
          </a>
          <a href={`/${locale}/cookies`} className="hover:text-purple-400 transition-colors">
            Cookie Policy
          </a>
          <a href={`/${locale}`} className="hover:text-purple-400 transition-colors">
            ← {locale === "it" ? "Torna alla home" : "Back to home"}
          </a>
        </div>
      </div>
    </main>
  );
}
