import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, Input, Label, PageHeader, Select, Textarea, Drawer, ConfirmDialog } from '../components/ui'
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showStatusConfirm, setShowStatusConfirm] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<CampaignStatus | null>(null)

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
              onClick={() => {
                setSelected(c.id)
                setIsDrawerOpen(true)
              }}
              className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                selected === c.id
                  ? 'border-brand-600 bg-brand-50 shadow-md'
                  : 'border-ink-200 bg-white hover:border-ink-300 hover:shadow-sm hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink-900">{c.name}</p>
                <Badge tone={statusTone[c.status]}>{c.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-ink-500">{c.cycle} · {c.audience.replaceAll('_', ' ')}</p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          {!isDrawerOpen ? (
            <Card className="flex min-h-[480px] items-center justify-center p-8 text-center text-sm text-ink-500">
              Selecciona una campaña para ver los detalles
            </Card>
          ) : null}
        </div>
      </div>

      {campaign && (
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={campaign.name}
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsDrawerOpen(false)}>
                Cerrar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Información</p>
              <div className="mt-2 space-y-1 text-sm">
                <p>
                  <span className="text-ink-600">Avatar:</span>{' '}
                  <span className="font-medium text-ink-900">
                    {store.avatars.find((a) => a.id === campaign.avatarId)?.name}
                  </span>
                </p>
                <p>
                  <span className="text-ink-600">Audiencia estimada:</span>{' '}
                  <span className="font-medium text-ink-900">{audienceCount}</span>
                </p>
                <p>
                  <span className="text-ink-600">Costo est.:</span>{' '}
                  <span className="font-medium text-ink-900">
                    ${(audienceCount * store.credits.costPerVisit).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <Field label="Estado">
                <Select
                  value={campaign.status}
                  onChange={(e) => {
                    setPendingStatus(e.target.value as CampaignStatus)
                    setShowStatusConfirm(true)
                  }}
                >
                  {Object.keys(statusTone).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div>
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

            <div className="rounded-2xl bg-ink-50 p-3">
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
                {campaign.filters.specialties?.map((s) => (
                  <Badge key={s} tone="brand">
                    {s}
                  </Badge>
                ))}
                {campaign.filters.zones?.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
                {campaign.filters.tags?.map((s) => (
                  <Badge key={s} tone="warn">
                    #{s}
                  </Badge>
                ))}
                {campaign.filters.coveredOnly ? <Badge tone="success">solo cubiertos</Badge> : null}
                {campaign.filters.uncoveredOnly ? <Badge tone="warn">solo no cubiertos</Badge> : null}
                {campaign.multiProduct ? <Badge>multiproducto</Badge> : null}
              </div>
            </div>

            <div className="space-y-2 border-t border-ink-100 pt-3">
              <div>
                <Field label="Canal de envío">
                  <Select value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                  </Select>
                </Field>
              </div>

              <div>
                <Field label="Nombre campaña">
                  <Input
                    value={campaign.name}
                    onChange={(e) => store.upsertCampaign({ ...campaign, name: e.target.value })}
                  />
                </Field>
              </div>

              <div>
                <Field label="Pregunta de sondeo">
                  <Textarea
                    value={campaign.script.probingQuestion}
                    onChange={(e) =>
                      store.upsertCampaign({
                        ...campaign,
                        script: { ...campaign.script, probingQuestion: e.target.value },
                      })
                    }
                    rows={3}
                  />
                </Field>
              </div>

              <div className="flex gap-2 pt-2">
                <Link to="/prueba" onClick={() => store.startTestSession(campaign.id)} className="flex-1">
                  <Button variant="outline" className="w-full" size="sm">
                    Probar campaña
                  </Button>
                </Link>
                <Button onClick={dispatch} className="flex-1" size="sm">
                  Enviar
                </Button>
              </div>

              {msg && (
                <div className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-xs text-brand-900">
                  {msg}
                </div>
              )}
            </div>
          </div>
        </Drawer>
      )}

      <ConfirmDialog
        isOpen={showStatusConfirm}
        onClose={() => {
          setShowStatusConfirm(false)
          setPendingStatus(null)
        }}
        title="Cambiar estado de campaña"
        description={`¿Cambiar estado a "${pendingStatus}"?`}
        confirmText="Cambiar"
        cancelText="Cancelar"
        onConfirm={() => {
          if (pendingStatus) {
            store.setCampaignStatus(campaign.id, pendingStatus)
          }
        }}
      />
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
