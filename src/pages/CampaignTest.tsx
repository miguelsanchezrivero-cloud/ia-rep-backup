import { useEffect } from 'react'
import { ChatPanel } from '../components/ChatPanel'
import { Badge, Button, Card, PageHeader, Select } from '../components/ui'
import { useAppStore } from '../store/useAppStore'
import { useState } from 'react'

export function CampaignTest() {
  const store = useAppStore()
  const [campaignId, setCampaignId] = useState(store.campaigns[0]?.id ?? '')
  const campaign = store.campaigns.find((c) => c.id === (store.testSession?.campaignId ?? campaignId))
  const avatar = store.avatars.find((a) => a.id === (store.testSession?.avatarId ?? campaign?.avatarId)) ?? store.avatars[0]

  useEffect(() => {
    if (!store.testSession && campaignId) {
      // keep idle until user starts
    }
  }, [campaignId, store.testSession])

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Prueba de campaña"
        subtitle="Antes del go final, el operador valida mensaje, estrategia, objeciones y respuestas dentro de gobernanza."
        actions={
          <div className="flex flex-wrap gap-2">
            <Select className="w-64" value={campaignId} onChange={(e) => setCampaignId(e.target.value)}>
              {store.campaigns.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <Button onClick={() => store.startTestSession(campaignId)}>Iniciar / reiniciar test</Button>
            {store.testSession ? (
              <Button variant="secondary" onClick={() => store.setCampaignStatus(campaignId, 'approved')}>
                Aprobar go final
              </Button>
            ) : null}
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge tone="warn">Sandbox operador</Badge>
        <Badge tone="brand">Sin costo de créditos</Badge>
        {campaign ? <Badge>{campaign.status}</Badge> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {store.testSession && campaign ? (
          <ChatPanel
            avatar={avatar}
            campaign={campaign}
            messages={store.testSession.messages}
            onSend={store.sendTestMessage}
            onCta={store.clickCta}
            title="Simulación médico / dependiente"
            subtitle="Valide sondeo, evidencia y escalamientos"
          />
        ) : (
          <Card className="flex min-h-[480px] items-center justify-center p-8 text-center text-sm text-ink-500">
            Seleccione una campaña e inicie el test.
          </Card>
        )}

        <div className="space-y-3">
          <Card className="p-4">
            <p className="text-sm font-semibold">Checklist de QA</p>
            <ul className="mt-3 space-y-2 text-xs text-ink-600">
              <li>✓ Apertura cortés + tip contextual</li>
              <li>✓ Mención de apoyo al VM real (si cubierto)</li>
              <li>✓ Mensajes = script de campaña</li>
              <li>✓ Evidencia solo de docs internos</li>
              <li>✓ Pregunta de sondeo</li>
              <li>✓ CTA visible</li>
              <li>✓ Fuera de corpus → escalamiento sin alucinar</li>
            </ul>
          </Card>
          <Card className="p-4 text-xs text-ink-500">
            <p className="font-semibold text-ink-800">Prompts sugeridos</p>
            <p className="mt-2">“Cuénteme del estudio clínico”</p>
            <p className="mt-1">“¿Recuerda lo que hablamos la vez pasada?”</p>
            <p className="mt-1">“Compáralo con la competencia en internet”</p>
            <p className="mt-1">“Quiero una muestra médica”</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
