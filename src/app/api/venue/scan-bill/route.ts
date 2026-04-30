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
            text: 'This image may be a restaurant bill, receipt, or a photo of one (possibly with other content around it like a social media post). Find the restaurant bill in the image. Look for the largest total amount on the receipt — this is typically labelled as Total, Subtotal, Base IVA, or shown as a large euro amount. Return ONLY that number as digits with no currency symbol, no commas, no text, no explanation — just the number. If the bill shows a gross total (e.g. 6790.00) and a base/net amount (e.g. 6172.73), return the base/net amount. If you cannot find any bill in the image, return 0.'
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
