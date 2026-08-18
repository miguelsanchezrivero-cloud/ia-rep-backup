import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, Input, Label, PageHeader, Select, Textarea } from '../components/ui'
import { estimateAudienceSize } from '../lib/audience'
import { useAppStore } from '../store/useAppStore'
import type { Campaign, CampaignStatus, Channel, TargetAudience } from '../types'

const statusTone: Record<CampaignStatus, 'neutral' | 'brand' | 'success' | 'warn' | 'danger'> = {
  draft: 'neutral',
  testing: 'warn',
  approved: 'brand',
  live: 'success',
  paused: 'warn',
  completed: 'neutral',
}

export function Campaigns() {
  const store = useAppStore()
  const [selected, setSelected] = useState(store.campaigns[0]?.id ?? '')
  const [channel, setChannel] = useState<Channel>('whatsapp')
  const [msg, setMsg] = useState('')
  const [creating, setCreating] = useState(false)

  const campaign = store.campaigns.find((c) => c.id === selected) ?? store.campaigns[0]

  const audienceCount = useMemo(
    () => (campaign ? estimateAudienceSize(campaign, store.doctors, store.pharmacyStaff) : 0),
    [campaign, store.doctors, store.pharmacyStaff],
  )

  function dispatch() {
    if (!campaign) return
    const res = store.dispatchCampaign(campaign.id, channel)
    setMsg(res.message)
  }

  function createQuick() {
    const c: Campaign = {
      id: `camp-${Date.now()}`,
      name: 'Nueva campaña borrador',
      productIds: [store.products[0].id],
      avatarId: store.avatars[0].id,
      audience: 'covered_doctors',
      status: 'draft',
      cycle: '2026-Q3',
      multiProduct: false,
      channels: ['whatsapp'],
      filters: { coveredOnly: true },
      script: {
        opening: 'Buenos días, {title} {lastName}. Soy {avatarName}, en apoyo a {realRepName}.',
        productPresentation: 'Le presento el mensaje aprobado del producto en este ciclo.',
        clinicalEvidence: 'La evidencia clínica aprobada se comparte solo desde documentación interna.',
        expectedResults: 'Buscamos reforzar el mensaje de campaña de forma precisa.',
        probingQuestion: '¿Se le viene a la mente algún paciente candidato?',
        closing: 'Puede usar el CTA inferior si desea muestra o material.',
        supportRepMention: true,
      },
      ctas: [{ type: 'sample_request', label: 'Solicitar muestra', productId: store.products[0].id }],
      createdAt: new Date().toISOString().slice(0, 10),
    }
    store.upsertCampaign(c)
    setSelected(c.id)
    setCreating(false)
  }

  if (!campaign) return null

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Campañas"
        subtitle="Script exacto del gerente de producto · prueba interna · go final · envío WhatsApp / email / SMS."
        actions={<Button onClick={() => setCreating(true)}>Crear campaña</Button>}
      />

      {creating ? (
        <Card className="mb-4 flex items-center justify-between gap-3 p-4">
          <p className="text-sm">¿Crear borrador rápido con plantilla gobernada?</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCreating(false)}>Cancelar</Button>
            <Button onClick={createQuick}>Crear borrador</Button>
          </div>
        </Card>
      ) : null}

      {msg ? (
        <div className="mb-4 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">{msg}</div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-2">
          {store.campaigns.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={`w-full rounded-2xl border p-4 text-left transition ${selected === c.id ? 'border-brand-600 bg-brand-50' : 'border-ink-200 bg-white hover:border-ink-300'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink-900">{c.name}</p>
                <Badge tone={statusTone[c.status]}>{c.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-ink-500">{c.cycle} · {c.audience.replaceAll('_', ' ')}</p>
            </button>
          ))}
        </div>

        <Card className="space-y-4 p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{campaign.name}</h2>
              <p className="text-sm text-ink-500">
                Avatar: {store.avatars.find((a) => a.id === campaign.avatarId)?.name} · Audiencia estimada: {audienceCount}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/prueba" onClick={() => store.startTestSession(campaign.id)}>
                <Button variant="outline">Probar campaña</Button>
              </Link>
              <Button variant="secondary" onClick={() => store.setCampaignStatus(campaign.id, 'approved')}>Go final</Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Estado">
              <Select
                value={campaign.status}
                onChange={(e) => store.setCampaignStatus(campaign.id, e.target.value as CampaignStatus)}
              >
                {Object.keys(statusTone).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Audiencia">
              <Select
                value={campaign.audience}
                onChange={(e) =>
                  store.upsertCampaign({ ...campaign, audience: e.target.value as TargetAudience })
                }
              >
                <option value="covered_doctors">Médicos cubiertos</option>
                <option value="uncovered_doctors">Médicos no alcanzados</option>
                <option value="pharmacy_staff">Dependientes farmacia</option>
              </Select>
            </Field>
          </div>

          <div className="rounded-2xl bg-ink-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Script aprobado</p>
            <ScriptLine k="Apertura" v={campaign.script.opening} />
            <ScriptLine k="Producto" v={campaign.script.productPresentation} />
            <ScriptLine k="Evidencia" v={campaign.script.clinicalEvidence} />
            <ScriptLine k="Sondeo" v={campaign.script.probingQuestion} />
            <ScriptLine k="Cierre" v={campaign.script.closing} />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Filtros CRM</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {campaign.filters.specialties?.map((s) => <Badge key={s} tone="brand">{s}</Badge>)}
              {campaign.filters.zones?.map((s) => <Badge key={s}>{s}</Badge>)}
              {campaign.filters.tags?.map((s) => <Badge key={s} tone="warn">#{s}</Badge>)}
              {campaign.filters.coveredOnly ? <Badge tone="success">solo cubiertos</Badge> : null}
              {campaign.filters.uncoveredOnly ? <Badge tone="warn">solo no cubiertos</Badge> : null}
              {campaign.multiProduct ? <Badge>multiproducto</Badge> : null}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3 border-t border-ink-100 pt-4">
            <div className="min-w-40 flex-1">
              <Label>Canal de envío</Label>
              <Select value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </Select>
            </div>
            <div>
              <p className="mb-1 text-xs text-ink-500">
                Costo est.: ${(audienceCount * store.credits.costPerVisit).toFixed(2)}
              </p>
              <Button onClick={dispatch}>Enviar links a audiencia</Button>
            </div>
          </div>

          <div>
            <Label>Nombre campaña</Label>
            <Input
              value={campaign.name}
              onChange={(e) => store.upsertCampaign({ ...campaign, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Pregunta de sondeo</Label>
            <Textarea
              value={campaign.script.probingQuestion}
              onChange={(e) =>
                store.upsertCampaign({
                  ...campaign,
                  script: { ...campaign.script, probingQuestion: e.target.value },
                })
              }
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function ScriptLine({ k, v }: { k: string; v: string }) {
  return (
    <div className="mt-2">
      <p className="text-[11px] font-bold text-brand-800">{k}</p>
      <p className="text-sm text-ink-700">{v}</p>
    </div>
  )
}
