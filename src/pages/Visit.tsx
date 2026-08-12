import { useMemo, useState } from 'react'
import { ChatPanel } from '../components/ChatPanel'
import { AvatarFace } from '../components/AvatarFace'
import { Badge, Button, Card, Label, PageHeader, Select } from '../components/ui'
import { useAppStore } from '../store/useAppStore'
import type { Channel } from '../types'

export function Visit() {
  const store = useAppStore()
  const liveCampaigns = store.campaigns.filter((c) =>
    ['approved', 'live', 'testing'].includes(c.status),
  )
  const [campaignId, setCampaignId] = useState(liveCampaigns[0]?.id ?? store.campaigns[0]?.id)
  const [doctorId, setDoctorId] = useState(store.doctors[0]?.id)
  const [pharmacyId, setPharmacyId] = useState(store.pharmacyStaff[0]?.id)
  const [channel, setChannel] = useState<Channel>('whatsapp')
  const [mode, setMode] = useState<'doctor' | 'pharmacy'>('doctor')

  const campaign = store.campaigns.find((c) => c.id === campaignId) ?? store.campaigns[0]
  const avatar = store.avatars.find((a) => a.id === (store.activeVisit?.avatarId ?? campaign?.avatarId)) ?? store.avatars[0]
  const doctor = store.doctors.find((d) => d.id === (store.activeVisit?.targetId ?? doctorId))
  const pharmacy = store.pharmacyStaff.find((p) => p.id === (store.activeVisit?.targetId ?? pharmacyId))
  const realRep = doctor ? store.realReps.find((r) => r.id === doctor.realRepId) : null

  const title = useMemo(() => {
    if (store.activeVisit?.targetType === 'pharmacy_staff') {
      return `${pharmacy?.name ?? ''} · ${pharmacy?.pharmacy ?? ''}`
    }
    return doctor ? `${doctor.title} ${doctor.name} · ${doctor.specialty}` : 'Visita'
  }, [store.activeVisit, doctor, pharmacy])

  function start() {
    if (!campaign) return
    if (mode === 'pharmacy' || campaign.audience === 'pharmacy_staff') {
      store.startPharmacyVisit(campaign.id, pharmacyId)
    } else {
      store.startDoctorVisit(campaign.id, doctorId, channel)
    }
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Visita del VM virtual"
        subtitle="Simula el link que llega por WhatsApp, email o SMS. Conversación gobernada, memoria, tips contextuales y CTAs."
      />

      <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-semibold">Configurar recepción del link</p>
            <div className="mt-4 space-y-3">
              <div>
                <Label>Modo</Label>
                <Select value={mode} onChange={(e) => setMode(e.target.value as 'doctor' | 'pharmacy')}>
                  <option value="doctor">Médico</option>
                  <option value="pharmacy">Dependiente farmacia</option>
                </Select>
              </div>
              <div>
                <Label>Campaña</Label>
                <Select value={campaignId} onChange={(e) => setCampaignId(e.target.value)}>
                  {store.campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </div>
              {mode === 'doctor' ? (
                <div>
                  <Label>Médico</Label>
                  <Select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                    {store.doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title} {d.name} ({d.covered ? 'cubierto' : 'no cubierto'})
                      </option>
                    ))}
                  </Select>
                </div>
              ) : (
                <div>
                  <Label>Dependiente</Label>
                  <Select value={pharmacyId} onChange={(e) => setPharmacyId(e.target.value)}>
                    {store.pharmacyStaff.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} · {p.pharmacy}</option>
                    ))}
                  </Select>
                </div>
              )}
              <div>
                <Label>Canal</Label>
                <Select value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </Select>
              </div>
              <Button className="w-full" onClick={start}>Abrir link / iniciar visita</Button>
              {store.activeVisit ? (
                <Button className="w-full" variant="outline" onClick={() => store.endVisit()}>
                  Cerrar visita
                </Button>
              ) : null}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <AvatarFace avatar={avatar} size="lg" />
              <div>
                <p className="font-semibold">{avatar.name}</p>
                <p className="text-xs text-ink-500">{avatar.region} · acento {avatar.accent}</p>
                <p className="text-xs text-ink-400">{avatar.attire}</p>
              </div>
            </div>
            {doctor && mode === 'doctor' ? (
              <div className="mt-4 space-y-2 text-xs text-ink-600">
                <p><span className="font-semibold">Target:</span> {doctor.title} {doctor.name}</p>
                <p><span className="font-semibold">Zona:</span> {doctor.zone}</p>
                {realRep ? (
                  <p>
                    <span className="font-semibold">Apoya a:</span> {realRep.name}{' '}
                    <Badge tone="brand">no reemplazo</Badge>
                  </p>
                ) : (
                  <Badge tone="warn">Visita multiproducto / no cubierto</Badge>
                )}
                {doctor.lastVisitSummary ? (
                  <p className="rounded-xl bg-ink-50 p-2"><span className="font-semibold">Memoria:</span> {doctor.lastVisitSummary}</p>
                ) : null}
              </div>
            ) : null}
            {store.activeVisit ? (
              <div className="mt-3 flex flex-wrap gap-1">
                <Badge tone="success">sesión activa</Badge>
                <Badge>{store.activeVisit.channel}</Badge>
                <Badge tone="brand">{store.activeVisit.ctaClicks.length} CTAs</Badge>
              </div>
            ) : null}
          </Card>

          <Card className="p-4 text-xs leading-relaxed text-ink-500">
            Pruebe preguntas dentro de campaña (“¿qué dice el estudio?”) y fuera de límites
            (“compáralo con la competencia en internet”) para ver el escalamiento anti-alucinación.
          </Card>
        </div>

        <div>
          {store.activeVisit && campaign ? (
            <ChatPanel
              avatar={avatar}
              campaign={campaign}
              messages={store.activeVisit.messages}
              onSend={store.sendVisitMessage}
              onCta={store.clickCta}
              title={title}
              subtitle={campaign.name}
            />
          ) : (
            <Card className="flex min-h-[560px] flex-col items-center justify-center p-8 text-center">
              <AvatarFace avatar={avatar} size="xl" />
              <p className="mt-6 font-display text-3xl text-ink-900">Su visitador médico virtual</p>
              <p className="mt-2 max-w-md text-sm text-ink-500">
                Configure la audiencia y abra el link para recibir al avatar con el mensaje exacto de la campaña.
              </p>
              <Button className="mt-6" onClick={start}>Recibir visita</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
