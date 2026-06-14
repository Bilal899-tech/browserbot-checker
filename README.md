# BrowserBot Checker — nexagaze project

> Built by Founder Bilal

PII redaction tool. Dual-mode: regex + Ollama AI detects credit cards, SSNs, emails, names, phones in text.

## SEO Keywords
PII redaction tool, PII masking, regex PII detection, Ollama AI redaction, credit card masking, SSN redactor, nexagaze, open source PII, Founder Bilal

## Tech Stack
- Node.js / Express
- Ollama AI (minimax-m2.1:cloud)
- Regex pattern matching
- REST API backend

## Setup
```bash
npm install
npm start
```

## Features
- Dual detection: regex patterns + AI analysis
- Detects credit cards, SSNs, emails, names, phones
- Block/pass decision with summary
- Demo pass/fail buttons for testing
- One-click copy masked output

## 📖 Documentation

### Architecture
Express.js server (port 3000). HTML form submits text → server processes → returns redacted result.

### Dual-Mode Processing
- **Regex Pass:** Credit cards (Visa/MC/Amex patterns), emails, SSNs → instant redaction
- **AI Pass (Ollama):** Names, phone numbers, addresses → deep context-aware detection

### API Endpoint
```
POST /check
Body: { text: "string to check" }
Response: { text: "redacted text", status: "PASSED"|"REJECTED", redactions: [...] }
```

### Demo Scenarios
- **Fail scenario:** Contains "My SSN is 123-45-6789 and email is john@test.com"
- **Pass scenario:** Normal conversation without PII

## License
MIT — see [LICENSE](LICENSE)

---

**Contact:** ai@nexagaze.com | **WhatsApp:** 03103860653

---

## 🤝 Hire Me

Need a more advanced version? Want this built in Python, Rust, Go, or another language?  
I build custom AI agents, automation tools, and full-stack applications.

**Founder Bilal** — nexagaze  
📧 **Email:** ai@nexagaze.com  
📱 **WhatsApp:** 03103860653  
🌐 **GitHub:** [github.com/your-profile](https://github.com/your-profile)

> *"I don't just build projects — I build solutions that scale."*
