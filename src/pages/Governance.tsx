import { Shield, Ban, BookLock, Scale } from 'lucide-react'
import { Badge, Card, PageHeader } from '../components/ui'
import { useAppStore } from '../store/useAppStore'

export function Governance() {
  const rules = useAppStore((s) => s.governanceRules)

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Capa de gobernanza"
        subtitle="Prioridad 1 del sistema. Sin gobernanza no hay respuesta. Luego campaña. Luego solo documentación interna."
      />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {[
          { icon: Scale, t: '1. Gobernanza', d: 'Políticas, ética promocional y compliance.' },
          { icon: BookLock, t: '2. Campaña', d: 'Script y mensajes exactos del gerente de producto.' },
          { icon: Ban, t: '3. Sin terceros', d: 'RAG solo en docs aprobados. Anti-alucinación + escalamiento.' },
        ].map((x) => (
          <Card key={x.t} className="p-5">
            <x.icon className="text-brand-700" size={22} />
            <p className="mt-3 text-sm font-semibold">{x.t}</p>
            <p className="mt-1 text-xs text-ink-500">{x.d}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        {rules.map((r) => (
          <Card key={r.id} className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-800">
              <Shield size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-ink-900">{r.title}</p>
                <Badge tone="brand">Prioridad {r.priority}</Badge>
                {r.enforced ? <Badge tone="success">Enforced</Badge> : <Badge>Off</Badge>}
              </div>
              <p className="mt-1 text-sm text-ink-600">{r.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <p className="text-sm font-semibold">Respuesta canónica fuera de límites</p>
        <blockquote className="mt-3 rounded-2xl bg-ink-50 p-4 text-sm italic leading-relaxed text-ink-700">
          “No dispongo de esa información en este momento, pero haré la pregunta al departamento médico, legal u otro
          correspondiente y le traeré la respuesta en su próxima visita.”
        </blockquote>
      </Card>
    </div>
  )
}
