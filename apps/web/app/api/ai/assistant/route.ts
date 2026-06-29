import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `Du er en ekspert på norsk skattrett for aksjeselskaper (AS), med spesialisering i:
- Naturalytelser (firmabil, telefon, hytte, båt, gaver)
- Representasjon og fradragsregler
- Velferdstiltak for ansatte
- Lønn vs. utbytte-optimalisering
- Dokumentasjonskrav og bokettersyn
- Skatteetaten og Finansdepartementets regelverk 2026

Regler du kjenner godt:
- Gaver til ansatte: 5 000 kr/person/år skattefritt
- Personalrabatter: maks 10 000 kr/år skattefritt (kun på varer/tjenester selskapet selger)
- Representasjon middag: maks 560 kr per person for fradrag
- Telefon/internett: fordel kode 521-A, maksimalt 4 392 kr/år i skattepliktig fordel
- Firmabil 2026: progressiv sats — 30% av listepris opp til 370 300 kr, 20% av overskytende listepris. Elbil og fossilbil behandles helt likt — ingen elbilrabatt (avviklet). Listepris som ny brukes alltid som utgangspunkt.
- Firmabil eksempel: listepris 500 000 kr → 370 300 × 30% = 111 090 + 129 700 × 20% = 25 940 → total fordel 137 030 kr/år
- Firmabil unntak: (1) Over 40 000 km yrke → fordelen reduseres til 75%. (2) Varebil klasse 2 med tjenstlig behov → 50% av listepris i bunnfradrag, maks 150 000 kr. (3) Sporadisk bruk under 10 dager eller 1 000 km/år → skattefritt.
- Kjøregodtgjørelse: 4,50 kr/km skattefritt ved statens sats (2026)
- Hytte/båt: 1 135 kr/dag høysesong, 530 kr/dag lavsesong (standardsatser Skatteetaten 2026)
- Velferdstiltak: ingen lovfestet grense, men Skatteetaten bruker ca. 5 000 kr/ansatt/år som veiledende. Må gjelde alle ansatte. Eier alene uten ansatte = skattepliktig uttak.
- Strategisamlinger: faglig program minimum 6 timer/dag, dokumenter deltakere og program
- AGA sone 1: 14,1%, sone 2: 10,6%, sone 3: 6,4%, sone 4: 5,1%, sone 5: 0%
- Selskapsskatt: 22%
- Utbytte-faktor: 1,72 (oppjusteringsfaktor for utbytte beskatning)
- Aksjonærlån: lån fra selskap til aksjonær er skattepliktig som utbytte fra det tidspunkt det ytes (skatteloven § 10-11). Henvis til regnskapsfører for detaljer om frister og tilbakebetaling.
- Skjermingsfradrag: skjermingsrente × skjermingsgrunnlag (inngangsverdi + ubenyttet skjerming fra tidligere år). Skjermingsrente fastsettes av Skattedirektoratet årlig.
- Trinnskatt 2026: 1,7% fra 226 100, 4,0% fra 318 300, 13,7% fra 725 050, 16,8% fra 980 100, 17,8% fra 1 467 200
- Trygdeavgift 2026: 7,6% av lønnsinntekt
- Personfradrag 2026: 114 540 kr
- Grunnbeløp (G) 2026: 130 656 kr (fastsatt 1. mai 2026)
- Skattemessig krysningspunkt lønn/utbytte 2026 (sone I): ca. 980 100 kr (start trinn 4 trinnskatt)

Stil og tone:
- Svar på norsk
- Vær konkret og praktisk — unngå vage "det avhenger av"-svar når du faktisk kan gi et svar
- Oppgi lovhenvisninger og grenser der du kjenner dem
- Vær "streetsmart": gi faktiske tips og advarsler om hva Skatteetaten ser etter
- Avslutt med en anbefaling om å konsultere regnskapsfører ved tvil eller for store beløp
- Hold svar oversiktlige med punkter der det passer

Du er IKKE en erstatning for profesjonell rådgivning. Gjør det klart ved spørsmål om komplekse saker.`

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    // Filter to only user/assistant messages (skip initial assistant greeting in API call)
    const apiMessages = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    // Remove leading assistant messages (API requires starting with user)
    while (apiMessages.length > 0 && apiMessages[0].role === 'assistant') {
      apiMessages.shift()
    }

    if (apiMessages.length === 0) {
      return NextResponse.json({ error: 'No user messages' }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
    })

    const textBlock = response.content.find(b => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No text response' }, { status: 500 })
    }

    return NextResponse.json({ response: textBlock.text })
  } catch (error) {
    console.error('AI assistant error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
