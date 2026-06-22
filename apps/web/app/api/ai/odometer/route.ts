import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { image } = await req.json() // base64 image string (without data: prefix)

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: image,
              },
            },
            {
              type: 'text',
              text: `Dette er et bilde av en kilometerstand (odometer/speedometer) i en bil.

Les av kilometerantallet (totalt kjørte kilometer) og returner KUN det eksakte tallet som et heltall uten mellomrom eller punktum.

Eksempel: hvis det står "45 231 km" eller "45231", returner: 45231

Hvis du ikke kan lese km-standen tydelig, returner: ERROR

Svar KUN med tallverdien (eller ERROR). Ingen forklaring, ingen tekst.`,
            },
          ],
        },
      ],
    })

    const text = response.content[0]?.type === 'text' ? response.content[0].text.trim() : 'ERROR'

    if (text === 'ERROR' || !/^\d+$/.test(text)) {
      return NextResponse.json({ error: 'Could not read odometer', raw: text }, { status: 422 })
    }

    return NextResponse.json({ km: parseInt(text, 10) })
  } catch (error) {
    console.error('Odometer OCR error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
