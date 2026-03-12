# Parere Legale — Modello Donation Beta
**AgentPick · Legal Counsel: Harvey**  
**Data:** 11 marzo 2026 · **Classificazione:** Uso interno

---

## 1. Trattamento Fiscale — P.IVA Forfettaria

**Risposta breve: le donazioni volontarie NON sono ricavi da attività d'impresa, ma il confine è sottile.**

### Donazioni vs. Corrispettivi
- Una donazione è un atto liberale senza controprestazione (art. 769 c.c.). Non genera IVA, non rientra nel volume d'affari forfettario.
- Il rischio è la **riqualificazione**: se l'Agenzia delle Entrate ritiene che la donazione sia in realtà un corrispettivo mascherato (es. accesso a funzionalità, badge, vantaggi), la tratta come ricavo soggetto a imposta sostitutiva (5-15% regime forfettario) e potenzialmente IVA.

### Come tenersi al sicuro
- **Nessun benefit esplicito o implicito** in cambio della donazione (niente badge, niente "supporter tier", niente email di ringraziamento personalizzata con vantaggi concreti).
- Documentazione chiara: la piattaforma è gratuita con o senza donazione.
- Separare i conti: incassare le donazioni su conto distinto o con causale "erogazione liberale" e tracciarle separatamente.
- **Consulenza con commercialista:** per importi rilevanti (>€5.000/anno), valutare se intestare le donazioni a una entità separata o se aprire una causale specifica.

### Consiglio pratico
Per la fase beta con volumi bassi: trattare le donazioni come **proventi non commerciali**, non dichiararle come ricavi forfettari, conservare documentazione Stripe. Al superamento delle soglie rilevanti, rivedere con il commercialista.

---

## 2. Rimborsi e Consumer Protection

**Le donazioni volontarie NON sono soggette al diritto di recesso dei 14 giorni** (D.Lgs. 206/2005, Codice del Consumo) perché non c'è acquisto di bene o servizio.

### Tuttavia:
- Se Stripe elabora un chargeback (carta rubata, errore), è obbligatorio rimborsare — non è una scelta.
- Prevedere una **politica di rimborso volontaria** per errori dell'utente (es. importo sbagliato) è best practice e riduce dispute Stripe.
- Non si applicano obblighi di garanzia, conformità, o diritti di sostituzione.

**Raccomandazione:** aggiungere una frase tipo "Se hai effettuato una donazione per errore, contattaci entro 30 giorni per il rimborso integrale."

---

## 3. Dicitura Legale Necessaria

### Sul bottone / pagina donazione, includere obbligatoriamente:
1. **Ragione sociale e P.IVA** del destinatario dei fondi
2. **Natura non commerciale** del contributo ("liberalità volontaria, non corrispettivo di servizi")
3. **Nessun diritto a servizi aggiuntivi** in cambio della donazione
4. **Policy rimborsi** (anche breve)
5. **Privacy notice** (chi gestisce i dati di pagamento — Stripe — e base legale)

### Non serve:
- Informativa precontrattuale ex D.Lgs. 206/2005 (solo per contratti a distanza)
- Garanzia legale

---

## 4. Rischi e Gap

| Rischio | Probabilità | Impatto | Mitigazione |
|---|---|---|---|
| Riqualificazione fiscale donazioni→ricavi | Media | Alto | Zero benefit, documentazione, commercialista |
| Chargeback Stripe per frodi | Bassa | Medio | Policy rimborso chiara, verifica identità opzionale |
| GDPR — dati carta | Bassa | Alto | Stripe gestisce tutto, data processing agreement già incluso |
| Reputazionale: "donation washing" | Bassa | Medio | Copy onesto, no dark patterns |
| Volume donazioni > soglia forfettaria | Bassa (beta) | Alto | Monitorare, soglia forfettaria 2026 = €85.000 |

**Gap principale:** nessuna policy di donazione formalizzata. Da pubblicare prima del lancio.

---

## 5. Testo Suggerito — Pagina Donazione

### 🇮🇹 Italiano

> **AgentPick è gratuito, e lo rimarrà.**
>
> Non paghiamo le bollette con aria fritta — i server costano. Se AgentPick ti ha dato valore e vuoi contribuire a tenerlo in piedi, puoi farlo qui sotto.
>
> È una liberalità volontaria: non ricevi nulla di speciale in cambio, solo la nostra gratitudine e la consapevolezza di aver supportato un progetto indipendente.
>
> [€3 — Caffè] [€10 — Supporto] [€25 — Generoso] [Importo libero]
>
> *Contributo gestito tramite Stripe. Nessun abbonamento, nessun rinnovo automatico. Se hai effettuato un pagamento per errore, scrivici entro 30 giorni per il rimborso completo. I fondi vanno a Michele Telesca, P.IVA [P.IVA DA COMPLETARE]<!-- TODO: completare prima del go-live -->, a copertura dei costi operativi della piattaforma.*

---

### 🇬🇧 English

> **AgentPick is free — and will stay that way.**
>
> Servers aren't. If AgentPick has been useful to you and you'd like to help keep the lights on, you can do so below.
>
> This is a voluntary contribution: you don't receive anything extra in return — just our genuine thanks and the knowledge that you're backing an independent project.
>
> [€3 — Coffee] [€10 — Support] [€25 — Generous] [Custom amount]
>
> *Payment processed via Stripe. No subscription, no automatic renewal. If you made a payment by mistake, contact us within 30 days for a full refund. Funds go to Michele Telesca, VAT [P.IVA DA COMPLETARE]<!-- TODO: completare prima del go-live -->, to cover AgentPick's operating costs.*

---

**⚠️ Nota finale:** Questo parere è orientativo. Prima del lancio, validare con un commercialista certificato per la parte fiscale. La struttura legale è solida per la fase beta; ricalibrare se il modello evolve verso membership o tier con benefit.

— *Harvey, Legal Counsel · AgentPick*
