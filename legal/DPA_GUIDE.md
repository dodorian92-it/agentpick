# Guida DPA Supabase — AgentPick
**A cura di:** Harvey (Legal Strategist)
**Destinatario:** Michele Telesca
**Tempo stimato:** 10–15 minuti

---

## 1. Cos'è il DPA e perché è necessario

Il **Data Processing Agreement (DPA)** — o Accordo sul Trattamento dei Dati — è un contratto obbligatorio tra il titolare del trattamento (AgentPick / Michele Telesca) e il responsabile del trattamento (Supabase, che ospita il database).

**Perché è obbligatorio:**
- L'**Art. 28 del GDPR** impone che ogni trasferimento di dati personali a un fornitore esterno sia regolato da un DPA scritto.
- Supabase gestisce i dati degli utenti di AgentPick (email, profili, attività). Senza DPA, AgentPick è **non conforme al GDPR** e soggetta a sanzioni fino al 4% del fatturato globale o €20M.
- Se AgentPick ha utenti nell'UE (anche solo uno), il DPA è **non negoziabile**.

---

## 2. Accedere alle impostazioni Supabase

1. Apri il browser e vai su **[dashboard.supabase.com](https://dashboard.supabase.com)**
2. Effettua il login con il tuo account Supabase
3. Nel menu in alto a sinistra, clicca sul nome della tua **Organization** (es. "AgentPick")
4. Nel menu laterale della Organization, seleziona **Settings**
5. Scorri verso il basso o cerca la sezione **Legal**

> 💡 **Nota:** Se non vedi la sezione "Legal", assicurati di essere nella vista Organization (non nel singolo progetto). La sezione Legal è disponibile solo a livello organizzativo.

---

## 3. Steps per accettare/firmare il DPA

### Step 1 — Apri la sezione Legal
Dalla pagina `Organization → Settings → Legal`, troverai il pannello **"Data Processing Agreement"**.

### Step 2 — Leggi il DPA
Clicca su **"View DPA"** o **"Read Agreement"** per aprire il documento completo. Scorri rapidamente per verificare:
- Che il titolare del trattamento sia identificato correttamente (la tua organizzazione)
- Le clausole sulle Sub-Processors (Supabase usa AWS, Cloudflare, ecc.)
- Il meccanismo di trasferimento dati extra-UE (Standard Contractual Clauses)

### Step 3 — Accetta il DPA
Clicca su **"Accept DPA"** o **"Sign DPA"**. Supabase potrebbe chiedere:
- Conferma del nome dell'organizzazione
- Tuo nome e ruolo (es. "Michele Telesca, Founder")
- Email di riferimento

### Step 4 — Scarica la copia firmata
Dopo l'accettazione, apparirà un pulsante **"Download DPA"** o riceverai una email con la copia firmata. **Scarica subito il PDF.**

---

## 4. Cosa fare dopo la firma

### ✅ Conserva la copia
- Salva il PDF firmato in: `agentpick-legal/signed/DPA_Supabase_signed.pdf`
- Tieni una copia anche su Google Drive o storage sicuro

### ✅ Aggiorna il Registro dei Trattamenti
Nel tuo Registro delle Attività di Trattamento (obbligatorio ex Art. 30 GDPR), aggiungi:

| Campo | Valore |
|-------|--------|
| Responsabile del trattamento | Supabase Inc. |
| Finalità | Hosting database applicativo AgentPick |
| Dati trattati | Email, profili utente, dati attività |
| Base giuridica | Contratto (DPA Art. 28 GDPR) |
| Trasferimento extra-UE | Sì — Standard Contractual Clauses (SCCs) |
| Data firma DPA | [inserire data]<!-- TODO: completare prima del go-live --> |

### ✅ Aggiorna la Privacy Policy di AgentPick
Nella sezione **"Sub-processors"** o **"Fornitori"** della Privacy Policy, aggiungi Supabase come responsabile del trattamento con link al loro [DPA pubblico](https://supabase.com/privacy).

---

## 5. Checklist rapida

- [ ] Accesso a dashboard.supabase.com effettuato
- [ ] DPA letto e accettato
- [ ] PDF scaricato e salvato
- [ ] Registro trattamenti aggiornato
- [ ] Privacy Policy aggiornata con Supabase come sub-processor

---

**Tempo totale stimato:** 10–15 minuti
**Priorità:** Alta — da completare prima del lancio pubblico di AgentPick

---

*Harvey — Legal Strategist, AgentPick*
