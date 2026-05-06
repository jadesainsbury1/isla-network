export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { base64, mediaType: rawMediaType } = await req.json()
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
      model: 'claude-sonnet-4-5',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: 'This is a restaurant or beach club bill from Spain. Extract two figures and return ONLY a JSON object on a single line, no other text:\n\n{"net": <number>, "gross": <number>}\n\nWhere:\n- "net" is the F&B subtotal BEFORE IVA tax and BEFORE service charge (Base Imponible / Sin IVA / Base IVA 10%)\n- "gross" is the FINAL total the customer paid INCLUDING IVA and service charge (Total / TOTAL A PAGAR)\n\nIf you can only find one figure, put the same number in both. If you cannot read the bill, return {"net": 0, "gross": 0}. Return ONLY the JSON, no markdown, no explanation.' }
        ]
      }]
    })
  })

  const data = await response.json()
  const text = data.content?.[0]?.text?.trim() || '{"net":0,"gross":0}'

  let parsed = { net: 0, gross: 0 }
  try {
    const cleaned = text.replace(/```json|```/g, '').trim()
    parsed = JSON.parse(cleaned)
  } catch {
    const num = parseFloat(text.replace(/[^0-9.]/g, ''))
    if (!isNaN(num) && num > 0) parsed = { net: num, gross: num }
  }

  const net = Number(parsed.net) || 0
  const gross = Number(parsed.gross) || 0

  return NextResponse.json({
    net: net > 0 ? net : null,
    gross: gross > 0 ? gross : null,
    amount: net > 0 ? net : (gross > 0 ? gross : null)
  })
}
