# LEGAL_GAPS.md — Gap Critici Pre-Lancio AgentPick

**Redatto da:** Harvey (Legal Counsel, AgentPick)  
**Data:** 11 marzo 2026  
**Giurisdizione:** Italia / GDPR

---

## Priorità 1 — BLOCCANTI (non si lancia senza)

### GAP-001 · Entità giuridica non costituita
**Problema:** Tutti i documenti legali fanno riferimento ad "AgentPick" come entità, ma la società non risulta ancora incorporata.  
**Rischio:** I ToS, la Privacy Policy e il Creator Agreement non hanno controparte legale valida. Contratti potenzialmente non opponibili.  
**Azione richiesta:** Costituire SRL (o altra forma) prima del lancio. Aggiornare tutti i doc legali con ragione sociale, P.IVA, sede legale.  
**Chi:** Michele + commercialista/notaio  
**Stima:** 2-4 settimane (SRL semplificata)

---

### GAP-002 · Nessun DPA con Supabase
**Problema:** Supabase tratta dati personali degli utenti (email, profili, acquisti). Il GDPR richiede un Data Processing Agreement firmato tra titolare e responsabile del trattamento.  
**Rischio:** Violazione art. 28 GDPR. Sanzione fino a €10M o 2% fatturato mondiale.  
**Azione richiesta:** Eseguire il DPA standard Supabase (disponibile sul loro portale). Archiviare copia firmata.  
**Chi:** Harvey / Michele  
**Stima:** 1-2 giorni (è un click-through DPA, ma va documentato)

---

### GAP-003 · Nessun DPA con Resend
**Problema:** Resend gestisce email transazionali contenenti dati personali (email utente, contenuto delle notifiche).  
**Rischio:** Come GAP-002. Stessa base normativa GDPR art. 28.  
**Azione richiesta:** Firmare/accettare il DPA di Resend. Verificare che Resend sia certificato per trasferimenti UE (SCCs o adeguatezza).  
**Chi:** Harvey / Michele  
**Stima:** 1 giorno

---

### GAP-004 · Payment processor non nominato nei ToS
**Problema:** I Termini di Servizio non specificano quale provider di pagamento viene usato (Stripe presumibilmente). Gli utenti non possono dare un consenso informato al trattamento dei dati di pagamento.  
**Rischio:** Violazione GDPR (trasparenza), potenziale contestazione da parte dei buyer su chi tratta i loro dati finanziari.  
**Azione richiesta:**  
  1. Nominare Stripe nei ToS e Privacy Policy  
  2. Aggiungere link alla Privacy Policy di Stripe  
  3. Firmare DPA con Stripe (disponibile nel loro dashboard)  
**Chi:** Harvey  
**Stima:** 2 ore per aggiornare doc + 1 ora per DPA Stripe

---

### GAP-005 · Cookie Banner (CMP) non implementato
**Problema:** La cookie policy esiste come documento, ma il sito non ha un meccanismo di consenso reale (cookie banner/CMP). Il Garante italiano richiede consenso preventivo per cookie non tecnici.  
**Rischio:** Sanzione dal Garante Privacy. Casi analoghi in Italia: €50K-€300K.  
**Azione richiesta:** Implementare cookie banner con opt-in prima di qualsiasi analytics o tracking non essenziale. Opzione raccomandata: Cookiebot, Iubenda CMP, o soluzione custom con localStorage (già nel PRD Fase 5).  
**Chi:** Team dev  
**Stima:** 1-3 giorni (soluzione custom minimal già pianificata in PRD)

---

## Priorità 2 — IMPORTANTI (risolvere entro 30 giorni dal lancio)

### GAP-006 · Registro dei trattamenti (art. 30 GDPR) mancante
**Problema:** Il GDPR richiede un Registro delle Attività di Trattamento interno.  
**Azione richiesta:** Creare documento interno che mappa: finalità, categorie di dati, responsabili, tempi di conservazione, misure di sicurezza.  
**Stima:** 1 giorno

---

### GAP-007 · Procedura breach notification non definita
**Problema:** In caso di data breach, il GDPR richiede notifica al Garante entro 72 ore (art. 33) e, in certi casi, agli interessati (art. 34).  
**Azione richiesta:** Creare playbook interno: chi fa cosa, in quale ordine, entro quali tempi.  
**Stima:** Mezza giornata

---

### GAP-008 · Nessuna procedura per esercizio diritti GDPR
**Problema:** Gli utenti hanno diritto di accesso, rettifica, cancellazione, portabilità. Non esiste ancora un flusso operativo per gestire queste richieste.  
**Azione richiesta:** Implementare form/email dedicata + SLA di risposta (max 30 giorni per legge). Possibilmente automatizzare "cancella account" dal dashboard.  
**Stima:** 2-3 giorni (dev + procedura)

---

### GAP-009 · Clausole AI Act non presenti
**Problema:** L'EU AI Act (in vigore progressivamente dal 2024-2027) impone obblighi ai marketplace di sistemi AI, in particolare per sistemi ad alto rischio. AgentPick è un distributore/marketplace di agenti AI.  
**Azione richiesta:** Valutare classificazione dei listing (la maggior parte sarà "rischio minimo" ma alcuni potrebbero essere "rischio limitato" o superiore). Aggiungere clausola nei ToS/Creator Agreement che scarica la responsabilità di classificazione sul creator e impone la conformità AI Act.  
**Chi:** Harvey (richiede anche parere legale esterno per mappatura rischio)  
**Stima:** 3-5 giorni per bozza clausole

---

### GAP-010 · Mancano i termini commerciali specifici di Stripe nei ToS
**Problema:** Il checkout con Stripe Billing implica che i buyer accettino anche i termini Stripe. Va reso trasparente.  
**Azione richiesta:** Aggiungere sezione "Servizi di pagamento" nei ToS con link a Stripe Terms e Stripe Privacy Policy.  
**Stima:** 1 ora

---

## Priorità 3 — DA FARE (entro 90 giorni)

### GAP-011 · Politica rimborsi non dettagliata
I ToS citano i rimborsi ma non specificano le condizioni precise per abbonamenti vs one-time. Da dettagliare in linea con Codice del Consumo italiano.

### GAP-012 · Politica per minori
Nessuna verifica età. Se AgentPick potesse essere usato da under-18, servono misure specifiche.

### GAP-013 · Termini B2B vs B2C non differenziati
Il Codice del Consumo italiano offre protezioni aggiuntive ai consumatori privati vs business. Valutare se separare i ToS o aggiungere sezione specifica.

---

## Riepilogo Esecutivo

| Gap | Priorità | Bloccante al lancio? | Stima |
|-----|----------|---------------------|-------|
| GAP-001 Entità legale | 🔴 Critico | ✅ Sì | 2-4 sett |
| GAP-002 DPA Supabase | 🔴 Critico | ✅ Sì | 1-2 gg |
| GAP-003 DPA Resend | 🔴 Critico | ✅ Sì | 1 gg |
| GAP-004 Payment processor | 🔴 Critico | ✅ Sì | 2h doc |
| GAP-005 Cookie banner | 🔴 Critico | ✅ Sì | 1-3 gg |
| GAP-006 Registro trattamenti | 🟡 Importante | No | 1 gg |
| GAP-007 Breach notification | 🟡 Importante | No | 0.5 gg |
| GAP-008 Diritti GDPR | 🟡 Importante | No | 2-3 gg |
| GAP-009 AI Act | 🟡 Importante | No | 3-5 gg |
| GAP-010 Stripe in ToS | 🟡 Importante | No | 1h |
| GAP-011 Rimborsi | 🟢 Futuro | No | TBD |
| GAP-012 Minori | 🟢 Futuro | No | TBD |
| GAP-013 B2B/B2C | 🟢 Futuro | No | TBD |

---

## Nota Harvey

I gap 001-005 sono **bloccanti assoluti**. Lanciare senza entità costituita o senza DPA espone Michele personalmente a responsabilità. GAP-001 è il più critico e richiede il tempo più lungo — va avviato subito, in parallelo a tutto il resto.

Questo documento non sostituisce il parere di un avvocato abilitato in Italia. Per GAP-001 (costituzione societaria) e GAP-009 (AI Act) si raccomanda esplicitamente consulenza legale esterna.

— Harvey, Legal Counsel AgentPick

## Update 2026-03-11 (sessione 1)
**GAP-001 CHIUSO:** Michele ha P.IVA forfettaria attiva — sufficiente per operare, emettere fatture e firmare contratti come titolare. Nessuna costituzione societaria necessaria nella fase attuale.

Implicazioni:
- Aggiornare Privacy Policy e ToS con "Titolare del Trattamento: Michele Telesca P.IVA [numero]"
- Stripe accetta P.IVA forfettaria per account business Italia
- Creator Agreement firmabile come persona fisica con P.IVA

---

## Update 2026-03-11 (legal review Harvey — sessione 2)

### Status pagine legali live
| Pagina | HTTP | Stato |
|--------|------|-------|
| /en/privacy | 404 | ❌ NON LIVE |
| /en/terms | 404 | ❌ NON LIVE |
| /en/cookies | 404 | ❌ NON LIVE |

**Le pagine legali non sono raggiungibili sul dominio agentpick.co.** I documenti esistono in repo ma non sono deployati. Questo è bloccante pre-lancio.

---

### Review singoli gap — stato aggiornato

**GAP-001 · Entità giuridica** → ✅ CHIUSO (P.IVA forfettaria)  
Confermato da update precedente. P.IVA forfettaria sufficiente per fase beta.  
**PENDING:** P.IVA e nome titolare ancora NON inseriti nei doc legali in repo (da completare prima del deploy).

**GAP-002 · DPA Supabase** → 🔴 APERTO  
Nessuna evidenza di DPA firmato. Da completare prima del lancio.

**GAP-003 · DPA Resend** → 🔴 APERTO  
Nessuna evidenza di DPA firmato. Da completare prima del lancio.

**GAP-004 · Payment processor nei ToS** → 🟡 PARZIALE  
La pricing page menziona Stripe nel disclaimer donazione. I ToS scritti non nominano ancora Stripe esplicitamente con link alla loro privacy policy. Da verificare in terms-of-service.en.md.

**GAP-005 · Cookie Banner (CMP)** → 🔴 APERTO  
Nessun cookie banner implementato nella codebase rilevata. Le pagine legali non sono nemmeno live.

**GAP-006 · Registro trattamenti** → 🔴 APERTO — non avviato.

**GAP-007 · Breach notification playbook** → 🔴 APERTO — non avviato.

**GAP-008 · Procedura diritti GDPR** → 🔴 APERTO — non avviato.

**GAP-009 · Clausole AI Act** → 🔴 APERTO — non avviato.

**GAP-010 · Stripe in ToS** → 🟡 PARZIALE — menzionato nel disclaimer donazione, non nei ToS formali.

---

### Review modello donation — pricing page

**Disclaimer presente:** ✅ Il testo della pricing page (`/tmp/agentpick-v2/src/app/[locale]/pricing/page.tsx`) contiene il disclaimer corretto in IT e EN:
- ✅ Natura liberalità volontaria (non corrispettivo di servizi)
- ✅ Stripe nominato come processore
- ✅ No abbonamento / no rinnovo automatico
- ✅ Policy rimborso entro 30 giorni
- ✅ Finalità copertura costi operativi

**Gap residuo disclaimer:** ⚠️ Mancano **Ragione Sociale e P.IVA** nel testo (il template DONATION_MODEL.md indica "Michele Telesca, P.IVA [P.IVA DA COMPLETARE]" — questi placeholder NON sono stati sostituiti con i dati reali). Il footer del disclaimer recita solo "AgentPick" senza identificativo fiscale. **Da correggere prima del lancio.**

---

### TOP 3 GAP BLOCCANTI PRE-LANCIO (con P.IVA forfettaria come entità)

**🔴 #1 — Pagine legali non deployate (GAP-005 + deploy)**  
Privacy Policy, ToS e Cookie Policy esistono in repo ma restituiscono 404 sul dominio live. Il sito non può lanciare senza pagine legali accessibili agli utenti. Priorità assoluta: deploy + link nel footer.

**🔴 #2 — P.IVA e nome titolare assenti dai documenti legali (GAP-001 residuale)**  
Tutti i template (Privacy Policy, ToS, DONATION_MODEL) contengono ancora i placeholder `Michele Telesca` e `[P.IVA DA COMPLETARE]`. Con P.IVA forfettaria, il titolare è la persona fisica. Questi dati vanno inseriti prima del deploy per rendere i documenti legalmente validi e GDPR-compliant (obbligo di identificare il Titolare del Trattamento).

**🔴 #3 — DPA con Supabase e Resend mancanti (GAP-002 + GAP-003)**  
Supabase e Resend trattano dati personali degli utenti. Senza DPA firmato, la piattaforma viola GDPR art. 28 dal momento del primo utente registrato. Entrambi i DPA si eseguono online in meno di un'ora — nessuna scusa per non farlo prima del lancio.

— *Harvey, Legal Counsel · AgentPick · 11 marzo 2026*
