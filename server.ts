import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

type ScenarioId = 'retail' | 'saas' | 'booking';

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
}

const SCENARIO_CONTEXT: Record<ScenarioId, string> = {
  retail: `You are Linden, the customer support assistant for Northwind Goods (an everyday home & travel goods store).
Use these verified store facts when answering:
- Sample order #HB-4092: Canvas Weekender Bag ($148), shipped via UPS Ground on Nov 17, currently in transit (Oakland hub), estimated delivery Nov 21. Tracking: 1Z999AA10123456784.
- Sample order #HB-4108: Ceramic Pour-Over Set ($64), delivered Nov 14 to front porch.
- Return policy: 30-day returns on unused items in original packaging with prepaid return label. Opened ceramic or personal care items are final sale unless damaged on arrival.
- Damaged items: Customers can share their order number for a replacement shipment; if they request an exception outside 30 days or a custom refund override, offer to hand off to a support specialist.`,

  saas: `You are Linden, the customer support assistant for RelayDesk (a team workspace & project billing platform).
Use these verified account & billing facts when answering:
- Plans: Starter ($29/mo, up to 5 seats), Growth ($79/mo, up to 25 seats). Annual billing saves 18%.
- Payment methods: Visa, Mastercard, Amex, and ACH bank transfer for annual plans. Billing cards can be updated under Workspace Settings > Billing > Payment Method.
- Invoices: PDF receipts are emailed automatically on the 1st of each billing cycle and downloadable from Billing History.
- Seat changes & refunds: Adding seats prorates immediately. Canceling mid-cycle keeps access through the end of the billing period. For duplicate charge investigations or custom enterprise contracts, offer to escalate to the billing specialist team.`,

  booking: `You are Linden, the customer support assistant for Harbor Wellness & Studio (an appointment and class booking service).
Use these verified studio & reservation facts when answering:
- Sample reservation #BK-884: Deep Tissue Massage (60 min) on Friday Nov 22 at 2:30 PM with Maya Lin at Downtown Studio.
- Rescheduling policy: Free rescheduling or cancellation up to 12 hours before the appointment start time. Within 12 hours, a $25 late-change fee applies.
- Arrival: Please arrive 10 minutes early; street parking and 2-hour validated garage parking on 4th St.
- Medical accommodations, group bookings (4+ people), or fee waivers require human coordinator approval—offer to escalate when requested.`,
};

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/support-chat', async (req, res) => {
    try {
      const body = req.body as {
        messages?: ChatMessageInput[];
        scenario?: ScenarioId;
      };

      const messages = Array.isArray(body?.messages) ? body.messages : [];
      const scenario: ScenarioId =
        body?.scenario && body.scenario in SCENARIO_CONTEXT ? body.scenario : 'retail';

      if (messages.length === 0) {
        res.status(400).json({ error: 'Please include at least one message.' });
        return;
      }

      const ai = getAiClient();
      if (!ai) {
        res.status(503).json({
          error:
            'GEMINI_API_KEY is not configured yet. Add your key in the Settings > Secrets panel to enable live replies.',
        });
        return;
      }

      const conversationContents = messages.slice(-14).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(msg.content ?? '').slice(0, 2000) }],
      }));

      const systemInstruction = `${SCENARIO_CONTEXT[scenario]}

Response style rules:
- Write in clear, calm, plain human language (2 to 4 concise sentences unless step-by-step instructions are needed).
- Never invent order numbers, tracking IDs, or refund promises outside the verified facts above.
- If the customer asks for something not covered in the verified facts or asks for a human agent / refund exception, politely explain what you can hand off and set shouldEscalate to true.
- Do not use markdown code blocks or excessive exclamation marks.`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: conversationContents,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: 'Helpful, concise customer support reply in plain prose.',
              },
              shouldEscalate: {
                type: Type.BOOLEAN,
                description:
                  'True if the customer requested a human agent, a policy exception, or manual account intervention.',
              },
              handoffSummary: {
                type: Type.STRING,
                description:
                  'One-sentence summary of the customer request for a human support agent.',
              },
            },
            required: ['reply', 'shouldEscalate', 'handoffSummary'],
          },
        },
      });

      const rawText = response.text?.trim() || '';
      let parsed: { reply: string; shouldEscalate: boolean; handoffSummary: string };

      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = {
          reply: rawText || 'I am here to help. Could you share a few more details about your request?',
          shouldEscalate: false,
          handoffSummary: 'Customer inquiry via Linden live support chat.',
        };
      }

      res.json({
        reply: parsed.reply,
        shouldEscalate: Boolean(parsed.shouldEscalate),
        handoffSummary: parsed.handoffSummary || '',
      });
    } catch (error: unknown) {
      const errObj = error as { status?: number; message?: string };
      const status = typeof errObj?.status === 'number' ? errObj.status : 500;
      const message = errObj?.message || 'Unable to reach the support assistant right now.';

      if (status === 403 || status === 400 || message.includes('API_KEY_INVALID')) {
        res.status(status).json({
          error: 'Invalid or missing Gemini API key. Check your key in Settings > Secrets.',
        });
        return;
      }

      if (status === 429 || message.includes('RESOURCE_EXHAUSTED')) {
        res.status(429).json({
          error: 'Support assistant rate limit reached. Please wait a moment and try again.',
        });
        return;
      }

      res.status(500).json({
        error: 'The support assistant encountered an unexpected error. Please try again.',
      });
    }
  });

  app.post('/api/contact', (req, res) => {
    const body = req.body as {
      name?: string;
      email?: string;
      volume?: string;
      plan?: string;
      message?: string;
    };

    const name = String(body?.name ?? '').trim();
    const email = String(body?.email ?? '').trim();
    const message = String(body?.message ?? '').trim();

    if (!name || name.length < 2) {
      res.status(400).json({ error: 'Please enter your name.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please enter a valid work email address.' });
      return;
    }

    if (!message || message.length < 5) {
      res.status(400).json({ error: 'Please share a brief note about your support needs.' });
      return;
    }

    const ticketId = `SUP-${Math.floor(10000 + Math.random() * 90000)}`;
    res.json({
      ok: true,
      ticketId,
      receivedAt: new Date().toISOString(),
    });
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
