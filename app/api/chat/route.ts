import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

interface StoreConfig {
  name: string;
  info: string;
}

interface ChatRequest {
  message: string;
  storeConfig?: StoreConfig;
}

const PC_ADVISOR_SYSTEM_PROMPT = `You are Lyna AI, a professional PC building advisor for Machi PC.
Tone: Helpful, honest, expert advisor (not a salesperson). Avoid marketing fluff like "Extreme performance" or "High CP value".
Instead Focus on: Why this build fits the user, where they compromised, and how they can upgrade later.

CRITICAL RULES:
1. BUDGET IS A HARD LIMIT: Do NOT exceed the user's budget. If the user says 30k, the total price MUST be <= 30000. If impossible, explain why and offer the best possible build within budget.
2. OFFICE/HOME USE: If usage is "Office", "Home", "Web browsing", "Zoom", or "Light work", PRIORITIZE CPUs with Integrated Graphics (cpu-1, cpu-2, cpu-5) and OMIT the discrete GPU (unless they explicitly ask for one). Explain that a discrete GPU is unnecessary for their needs and saves money.
3. COMPATIBILITY:
   - LGA1700 (cpu-1, cpu-4, cpu-5) needs mb-1 or mb-4.
   - AM5 (cpu-2, cpu-3) needs mb-2 or mb-3.
   - mb-4 and ram-3 are DDR4. Others are DDR5.
4. PSU: Total TDP must be < PSU Wattage.
5. RECOMMENDATION LOGIC:
   - AI/Deep Learning: Prioritize GPU VRAM (gpu-1, gpu-2).
   - Video Editing: Prioritize high-core CPU (cpu-1, cpu-2) + 32GB/64GB RAM.
   - Gaming: Prioritize GPU, but don't bottleneck with a weak CPU.

CATALOG (Use ONLY these IDs):
CPU: cpu-1 (Core i9-14900K, $18500, iGPU), cpu-2 (Ryzen 7 7800X3D, $13500, iGPU), cpu-3 (Ryzen 5 7500F, $5200, NO iGPU), cpu-4 (Core i5-12400F, $4200, NO iGPU), cpu-5 (Core i5-12400, $4800, iGPU)
GPU: gpu-1 (RTX 4090, $59990), gpu-2 (RX 7900 XTX, $33000), gpu-3 (RTX 4060 Ti, $13500), gpu-4 (RX 7600, $8990)
Motherboard: mb-1 (Z790, $19990, LGA1700, DDR5), mb-2 (X670E, $15990, AM5, DDR5), mb-3 (B650M, $4990, AM5, DDR5), mb-4 (H610M, $2490, LGA1700, DDR4)
RAM: ram-1 (64GB DDR5, $6800), ram-2 (32GB DDR5, $3400), ram-3 (16GB DDR4, $1100)
SSD: ssd-1 (2TB NVMe, $4500), ssd-2 (1TB NVMe, $1850)
PSU: psu-1 (1200W, $7200), psu-2 (850W, $4200), psu-3 (550W, $1790)
Case: case-1 (O11D, $4800), case-2 (AIR 903, $1890)
Cooler: cooler-1 (360 AIO, $8900), cooler-2 (Air Cooler PA120, $1400)
`;

const PC_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    message: {
      type: Type.STRING,
      description: 'Personalized advisor message. Start with fitting the user\'s needs, then explain why, then mention trade-offs.',
    },
    build: {
      type: Type.OBJECT,
      properties: {
        CPU: { type: Type.STRING },
        GPU: { type: Type.STRING },
        Motherboard: { type: Type.STRING },
        RAM: { type: Type.STRING },
        SSD: { type: Type.STRING },
        PSU: { type: Type.STRING },
        Case: { type: Type.STRING },
        Cooler: { type: Type.STRING },
      },
    },
    reasons: {
      type: Type.OBJECT,
      description: 'Short reason for choosing each component (max 20 chars).',
      properties: {
        CPU: { type: Type.STRING },
        GPU: { type: Type.STRING },
        Motherboard: { type: Type.STRING },
        RAM: { type: Type.STRING },
        SSD: { type: Type.STRING },
        PSU: { type: Type.STRING },
        Case: { type: Type.STRING },
        Cooler: { type: Type.STRING },
      },
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        totalPrice: { type: Type.NUMBER },
        tdp: { type: Type.NUMBER },
        compatibility: { type: Type.STRING },
        targetResolution: { type: Type.STRING },
      },
    },
    notes: {
      type: Type.OBJECT,
      properties: {
        upgradeTip: { type: Type.STRING },
        saveTip: { type: Type.STRING },
      },
    },
  },
  required: ['message'],
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[api/chat] GEMINI_API_KEY is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const body: ChatRequest = await req.json();
    const { message, storeConfig } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (storeConfig) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: message,
        config: {
          systemInstruction: `你是「${storeConfig.name}」的客服助理。門市資訊：${storeConfig.info}。請以繁體中文簡短、友善、專業地回答顧客問題。若問題超出範圍，請建議顧客直接電話或到訪詢問。`,
        },
      });
      return NextResponse.json({ reply: response.text?.trim() ?? '抱歉，我目前無法回應，請稍後再試。' });
    }

    // PC advisor mode — returns JSON string parsed by the assistant page
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message,
      config: {
        systemInstruction: PC_ADVISOR_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: PC_RESPONSE_SCHEMA,
      },
    });

    return NextResponse.json({ reply: response.text?.trim() ?? '{}' });
  } catch (e) {
    console.error('[api/chat]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
