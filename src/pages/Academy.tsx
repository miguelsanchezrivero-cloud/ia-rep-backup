import { useState } from 'react'
import { Badge, Button, Card, PageHeader, Textarea } from '../components/ui'
import { useAppStore } from '../store/useAppStore'

export function Academy() {
  const { academyModules, trainerStyles } = useAppStore()
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [done, setDone] = useState<Record<string, boolean>>({})

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Academia online"
        subtitle="Zona de entrenamiento: la IA aprende conocimiento, maneras de hablar y acento de cada formador. También cursos con certificado para dependientes."
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        {trainerStyles.map((t) => (
          <Card key={t.id} className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{t.trainerName}</p>
              <Badge tone="brand">acento {t.accent}</Badge>
            </div>
            <p className="mt-2 text-sm text-ink-600">{t.speakingStyle}</p>
            <div className="mt-3 space-y-1">
              {t.samplePhrases.map((p) => (
                <p key={p} className="rounded-xl bg-brand-50 px-3 py-2 text-xs italic text-brand-900">
                  “{p}”
                </p>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-500">{t.notes}</p>
            <div className="mt-3">
              <Textarea
                placeholder="Añadir frase o matiz de acento para que la IA lo incorpore…"
                value={notes[t.id] ?? ''}
                onChange={(e) => setNotes({ ...notes, [t.id]: e.target.value })}
              />
              <Button
                className="mt-2"
                size="sm"
                variant="outline"
                onClick={() => setNotes({ ...notes, [t.id]: '' })}
              >
                Registrar en modelo de estilo
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {academyModules.map((m) => (
          <Card key={m.id} className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-semibold">{m.title}</p>
              <Badge>{m.audience}</Badge>
              {m.certificateTitle ? <Badge tone="success">Certificado</Badge> : null}
            </div>
            <p className="mt-1 text-sm text-ink-500">{m.description}</p>
            <div className="mt-4 space-y-3">
              {m.lessons.map((l) => (
                <div key={l.id} className="rounded-2xl border border-ink-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-ink-900">{l.title}</p>
                    <span className="text-xs text-ink-400">{l.durationMin} min</span>
                  </div>
                  <p className="mt-2 text-sm text-ink-600">{l.content}</p>
                  <Button
                    className="mt-3"
                    size="sm"
                    variant={done[l.id] ? 'secondary' : 'outline'}
                    onClick={() => setDone({ ...done, [l.id]: true })}
                  >
                    {done[l.id] ? 'Completada' : 'Marcar completada'}
                  </Button>
                </div>
              ))}
            </div>
            {m.certificateTitle ? (
              <div className="mt-4 rounded-2xl border border-dashed border-brand-300 bg-brand-50/50 p-4 text-center">
                <p className="text-sm font-semibold text-brand-900">{m.certificateTitle}</p>
                <p className="mt-1 text-xs text-brand-700">Disponible al completar el programa de dependientes</p>
                <Button className="mt-3" size="sm">Descargar certificado</Button>
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  )
}
