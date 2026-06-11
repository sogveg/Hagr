'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Lightbulb, User, Loader2, AlertTriangle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const EXAMPLE_QUESTIONS = [
  'Kan jeg kjøpe en firmabil og bruke den privat?',
  'Hva er grensen for skattefrie gaver til ansatte?',
  'Kan jeg trekke fra julebord for meg og ektefellen min?',
  'Er kjøregodtgjørelse på 4,50 kr/km skattefritt?',
  'Hva skjer om jeg tar ut mer enn egenkapitalen i lønn?',
  'Kan AS-et mitt betale for hyttetur for styret?',
]

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-600' : 'bg-gray-100'
      }`}>
        {isUser
          ? <User size={15} className="text-white" />
          : <Bot size={15} className="text-gray-600" />
        }
      </div>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-blue-600 text-white rounded-tr-md'
          : 'bg-gray-50 border border-gray-200 text-gray-800 rounded-tl-md'
      }`}>
        <div className="whitespace-pre-wrap">{msg.content}</div>
      </div>
    </div>
  )
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hei! Jeg er din norske skatteassistent. Still meg spørsmål om fradrag, naturalytelser, firmabil, representasjon, lønn vs. utbytte, og alt annet relatert til norsk skatt for AS.\n\nJeg gir veiledning basert på norske skatteregler (2026), men er ikke en erstatning for profesjonell regnskapsfører eller skatteadvokat.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading) return
    setInput('')
    setError(null)
    const newMessages: Message[] = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      if (!res.ok) throw new Error('Feil ved henting av svar')
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (e) {
      setError('Kunne ikke hente svar. Prøv igjen.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-2xl flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bot size={22} className="text-blue-600" strokeWidth={2} />
          AI-skatteassistent
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          "Kan jeg ta dette i firmaet?" — still spørsmål om norsk skatt og fradrag
        </p>
      </div>

      {/* Disclaimer */}
      <div className="shrink-0 flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-4">
        <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-500" />
        Svarene er veiledende og basert på regler per 2026. Ikke juridisk eller regnskapsrådgivning — konsulter alltid med regnskapsfører ved tvil.
      </div>

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-2">
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <Bot size={15} className="text-gray-600" />
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3">
              <Loader2 size={15} className="text-gray-400 animate-spin" />
            </div>
          </div>
        )}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
            <AlertTriangle size={14} className="shrink-0 text-red-400" />
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Example questions */}
      {messages.length <= 1 && (
        <div className="shrink-0 mb-3">
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
            <Lightbulb size={12} /> Vanlige spørsmål:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="text-xs bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 px-3 py-1.5 rounded-xl transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 flex gap-2">
        <textarea
          className="input flex-1 resize-none min-h-[44px] max-h-32 py-2.5"
          placeholder="Still et spørsmål om norsk skatt..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="btn-primary px-3 self-end disabled:opacity-40"
        >
          <Send size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
