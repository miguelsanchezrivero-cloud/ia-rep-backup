import { useEffect, useRef, useState } from 'react'
import { Send, ShieldAlert, FileText } from 'lucide-react'
import type { AvatarConfig, Campaign, ConversationMessage, CtaType } from '../types'
import { AvatarFace } from './AvatarFace'
import { Badge, Button } from './ui'
import { cn } from '../lib/cn'

export function ChatPanel({
  avatar,
  campaign,
  messages,
  onSend,
  onCta,
  title,
  subtitle,
  showCtas = true,
}: {
  avatar: AvatarConfig
  campaign: Campaign
  messages: ConversationMessage[]
  onSend: (text: string) => void
  onCta?: (type: CtaType, productId?: string) => void
  title: string
  subtitle?: string
  showCtas?: boolean
}) {
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const lastAvatar = [...messages].reverse().find((m) => m.role === 'avatar')

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function submit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  return (
    <div className="flex h-full min-h-[560px] flex-col overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-xl shadow-ink-900/5">
      <div className="flex items-center gap-3 border-b border-ink-100 bg-gradient-to-r from-brand-800 to-ink-900 px-5 py-4 text-white">
        <AvatarFace avatar={avatar} size="md" speaking />
        <div className="min-w-0">
          <p className="truncate font-semibold">{avatar.name}</p>
          <p className="truncate text-xs text-brand-100">{title}</p>
          {subtitle ? <p className="truncate text-[11px] text-white/60">{subtitle}</p> : null}
        </div>
        <div className="ml-auto hidden sm:block">
          <Badge tone="brand">Gobernado</Badge>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_30%)] px-4 py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'animate-fade-up flex',
              m.role === 'user' ? 'justify-end' : m.role === 'system' ? 'justify-center' : 'justify-start',
            )}
          >
            {m.role === 'system' ? (
              <div className="max-w-[90%] rounded-full bg-ink-100 px-3 py-1.5 text-center text-[11px] font-medium text-ink-600">
                {m.content}
              </div>
            ) : (
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
                  m.role === 'user'
                    ? 'rounded-br-md bg-brand-700 text-white'
                    : 'rounded-bl-md border border-ink-100 bg-white text-ink-800',
                )}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
                {m.escalated ? (
                  <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-900">
                    <ShieldAlert size={12} /> Escalado a dpto. {m.escalationDept}
                  </div>
                ) : null}
                {m.sources?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.sources.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-800">
                        <FileText size={10} /> {s}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {showCtas && onCta && (lastAvatar?.ctaShown || campaign.ctas.length) ? (
        <div className="flex flex-wrap gap-2 border-t border-ink-100 bg-brand-50/40 px-4 py-3">
          {campaign.ctas.map((cta) => (
            <Button key={cta.label} size="sm" variant="secondary" onClick={() => onCta(cta.type, cta.productId)}>
              {cta.label}
            </Button>
          ))}
        </div>
      ) : null}

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-ink-100 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escriba como el médico o dependiente…"
          className="h-11 flex-1 rounded-2xl border border-ink-200 bg-ink-50 px-4 text-sm outline-none ring-brand-500/20 focus:bg-white focus:ring-2"
        />
        <Button type="submit" className="h-11 rounded-2xl px-4">
          <Send size={16} />
        </Button>
      </form>
    </div>
  )
}
