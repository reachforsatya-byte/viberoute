declare const process: { env: Record<string, string | undefined> };

const ALLOWED_ORIGINS = [
  'https://viberoute-tau.vercel.app',
  'http://localhost:5173',
];

const ipHits = new Map<string, { count: number; resetAt: number }>();

interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: {
    prompt?: unknown;
    temperature?: unknown;
  };
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  setHeader?: (name: string, value: string) => void;
  json: (data: unknown) => void;
  end?: () => void;
}

function setCorsHeaders(req: ApiRequest, res: ApiResponse) {
  const rawOrigin = req.headers.origin;
  const origin = Array.isArray(rawOrigin) ? rawOrigin[0] : rawOrigin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader?.('Access-Control-Allow-Origin', origin);
    res.setHeader?.('Vary', 'Origin');
  }
  res.setHeader?.('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader?.('Access-Control-Allow-Headers', 'Content-Type');
}

function pruneExpiredIps(now: number) {
  if (ipHits.size < 200) return;
  for (const [key, val] of ipHits.entries()) {
    if (now > val.resetAt) {
      ipHits.delete(key);
    }
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end?.();
    return res.status(204).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawOrigin = req.headers.origin;
  const origin = Array.isArray(rawOrigin) ? rawOrigin[0] : rawOrigin || '';
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden origin' });
  }

  // Rate limit: max 12 requests per minute per IP
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || 'unknown')
    .split(',')[0]
    .trim();
  const now = Date.now();
  pruneExpiredIps(now);

  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + 60_000 });
  } else if (entry.count >= 12) {
    return res.status(429).json({ error: 'Too many requests — wait a minute.' });
  } else {
    entry.count++;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const { prompt, temperature = 0.7 } = req.body ?? {};
  if (typeof prompt !== 'string' || prompt.trim().length === 0 || prompt.length > 4000) {
    return res.status(400).json({ error: 'Invalid prompt' });
  }

  const safeTemp =
    typeof temperature === 'number' && Number.isFinite(temperature)
      ? Math.max(0, Math.min(2, temperature))
      : 0.7;

  const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];

  for (const model of models) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt.trim() }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: safeTemp,
            },
          }),
        }
      );
      clearTimeout(timeoutId);

      if (response.status === 503 || response.status === 429 || response.status === 404) {
        continue;
      }

      if (!response.ok) {
        return res.status(response.status >= 400 && response.status < 500 ? 400 : 502).json({
          error: 'Unable to generate itinerary right now.',
        });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch {
      clearTimeout(timeoutId);
    }
  }

  return res.status(503).json({ error: 'All models temporarily busy' });
}