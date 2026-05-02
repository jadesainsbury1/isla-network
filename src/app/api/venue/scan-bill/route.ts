export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { base64, mediaType: rawMediaType } = await req.json()
  // Normalise media type — Claude API accepts image/webp, image/jpeg, image/png, image/gif
  const mediaType = rawMediaType === 'image/webp' ? 'image/webp' : 
                    rawMediaType?.startsWith('image/') ? rawMediaType : 'image/jpeg'

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 }
          },
          {
            type: 'text',
            text: 'This is a restaurant or beach club bill. I need the NET F&B total excluding IVA and excluding service charge. On Spanish receipts this is the "Base Imponible" or "Sin IVA" or "Base IVA 10%" figure — NOT the final total which includes tax. For example: if the bill shows Base IVA 10%: 6445.91, IVA: 644.59, Total: 7090.50 — return 6445.91. If there is no IVA breakdown and only a single total, return that total. Return ONLY the number as digits, no currency symbol, no commas, no text, no explanation. If you cannot find a bill, return 0.'
          }
        ]
      }]
    })
  })

  const data = await response.json()
  const text = data.content?.[0]?.text?.trim() || '0'
  const amount = parseFloat(text.replace(/[^0-9.]/g, ''))

  return NextResponse.json({ amount: isNaN(amount) || amount === 0 ? null : amount })
}
