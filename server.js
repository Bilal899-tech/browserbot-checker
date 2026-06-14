import express from 'express';
import ollama from 'ollama';

const app = express();
app.use(express.json());
app.use(express.static('.'));

const MODEL = 'minimax-m2.1:cloud';

const CC_RE = /\b(?:\d[ -]*?){13,19}\b/g;
const EMAIL_RE = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
const SSN_RE = /\b\d{3}-\d{2}-\d{4}\b/g;

function regexMask(text) {
  return text
    .replace(CC_RE, '[REDACTED-CC]')
    .replace(EMAIL_RE, '[REDACTED-EMAIL]')
    .replace(SSN_RE, '[REDACTED-SSN]');
}

app.post('/mask', async (req, res) => {
  const input = req.body.text || '';
  if (!input.trim()) return res.json({ original: input, masked: input, changes: [] });

  const changes = [];
  let masked = input;

  const ccMatches = [...input.matchAll(CC_RE)];
  for (const m of ccMatches) {
    changes.push({ type: 'credit_card', value: m[0], position: m.index });
  }
  const emailMatches = [...input.matchAll(EMAIL_RE)];
  for (const m of emailMatches) {
    changes.push({ type: 'email', value: m[0], position: m.index });
  }
  const ssnMatches = [...input.matchAll(SSN_RE)];
  for (const m of ssnMatches) {
    changes.push({ type: 'ssn', value: m[0], position: m.index });
  }

  masked = regexMask(input);
  const tempMasked = masked;

  try {
    const response = await ollama.chat({
      model: MODEL,
      messages: [{
        role: 'user',
        content: `Find all PERSONAL NAMES, PHONE NUMBERS, ADDRESSES, and any other PII in this text. Return ONLY a JSON array of objects with keys "type", "value", "position". Types: "name", "phone", "address", "other". If none, return [].

Text: "${input}"`
      }],
      options: { temperature: 0.1 }
    });

    const raw = response.message.content;
    const cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    let aiMatches = [];
    try { aiMatches = JSON.parse(cleaned); } catch {
      try { aiMatches = JSON.parse(`[${cleaned}]`); } catch {}
    }

    if (Array.isArray(aiMatches)) {
      for (const m of aiMatches) {
        if (m.value && m.type) {
          const tag = `[REDACTED-${m.type.toUpperCase()}]`;
          if (tempMasked.includes(m.value)) {
            masked = masked.replaceAll(m.value, tag);
          }
          changes.push({ type: m.type, value: m.value, position: m.position || -1 });
        }
      }
    }
  } catch (err) {
    console.error('Ollama error:', err.message);
  }

  const hasPii = changes.length > 0;
  const details = hasPii ? [...new Set(changes.map(c => `${c.type}: "${c.value}"`))].join(', ') : '';

  res.json({
    original: input,
    masked: hasPii ? masked : input,
    action: hasPii ? 'REJECTED' : 'PASSED',
    status: hasPii ? 'PII detected — blocked' : 'No PII — safe to pass',
    summary: details || 'No PII detected',
    piiCount: changes.length
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`\n[browserbot-checker] http://localhost:${PORT}`);
  console.log(`nexagaze project — built by Founder Bilal`);
  console.log(`Contact: ai@nexagaze.com | WhatsApp: 03103860653\n`);
});
