export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { base64, mediaType } = await req.json()

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
            text: 'This is a restaurant or venue bill. Extract the net food and beverage total, excluding any service charge, IVA, or VAT. Return ONLY a number with no currency symbol, no text, no explanation. If you cannot find a clear net F&B total, return 0.'
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
