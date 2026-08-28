import { Crown, Loader2, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

import { Modal } from '@/components/ui/Modal'
import { errorMessage, statusOf } from '@/lib/api'
import { useAskQueen } from '@/lib/queries'

interface Message {
  id: number
  author: 'queen' | 'subject'
  text: string
}

const GREETING: Message = {
  id: 0,
  author: 'queen',
  text: 'Falai, nobre. A Mestre da Moeda ouve as vossas duvidas sobre o ouro do reino.',
}

interface Props {
  open: boolean
  onClose: () => void
}

export function ChatModal({ open, onClose }: Props) {
  const ask = useAskQueen()
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [question, setQuestion] = useState('')
  const [remaining, setRemaining] = useState<number | null>(null)
  const [blocked, setBlocked] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const text = question.trim()
    if (text.length < 3 || ask.isPending) return

    setQuestion('')
    setMessages((current) => [
      ...current,
      { id: Date.now(), author: 'subject', text },
    ])

    try {
      const answer = await ask.mutateAsync(text)
      setRemaining(answer.remaining_requests)
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, author: 'queen', text: answer.answer },
      ])
    } catch (cause) {
      // On 429 the API already speaks in the Queen's voice, so the copy is
      // rendered straight from `detail` instead of being duplicated here.
      if (statusOf(cause) === 429) {
        setBlocked(true)
        setRemaining(0)
      }
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 2,
          author: 'queen',
          text: errorMessage(cause, 'A corte esta em silencio. Tentai novamente em instantes.'),
        },
      ])
    }
  }

  return (
    <Modal
      open={open}
      title="Consulte a Gold Queen"
      subtitle={
        remaining === null
          ? 'Soberana e Mestre da Moeda'
          : `${remaining} consultas restantes hoje`
      }
      onClose={onClose}
    >
      <div className="flex h-[52dvh] flex-col sm:h-[420px]">
        <div className="scrollbar-none flex-1 space-y-3 overflow-y-auto pb-3">
          {messages.map((message) =>
            message.author === 'queen' ? (
              <div key={message.id} className="flex gap-2">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-surface-raised">
                  <Crown size={13} className="text-gold" />
                </span>
                <p className="max-w-[80%] rounded-2xl rounded-tl-sm border border-gold/15 bg-surface-raised px-3.5 py-2.5 text-sm leading-relaxed text-parchment/85">
                  {message.text}
                </p>
              </div>
            ) : (
              <p
                key={message.id}
                className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-mystic/35 px-3.5 py-2.5 text-sm leading-relaxed text-parchment"
              >
                {message.text}
              </p>
            ),
          )}

          {ask.isPending && (
            <p className="flex items-center gap-2 pl-9 text-xs text-parchment/40">
              <Loader2 className="animate-spin text-gold" size={13} />A Rainha pondera...
            </p>
          )}

          <div ref={endRef} />
        </div>

        <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-gold/10 pt-3">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            disabled={blocked || ask.isPending}
            maxLength={500}
            placeholder={blocked ? 'A Rainha recolheu-se' : 'Pergunte sobre o seu ouro...'}
            className="min-w-0 flex-1 rounded-full border border-gold/15 bg-surface-raised px-4 py-2.5 text-sm text-parchment outline-none transition focus:border-gold/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={blocked || ask.isPending || question.trim().length < 3}
            aria-label="Enviar pergunta"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-aged text-void transition hover:brightness-110 disabled:opacity-40"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </Modal>
  )
}
