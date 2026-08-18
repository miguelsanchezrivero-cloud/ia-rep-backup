import { Link } from 'react-router-dom'
import { Activity, MousePointerClick, PackageOpen, Send, ShieldCheck, Users } from 'lucide-react'
import { Badge, Button, Card, PageHeader, Stat } from '../components/ui'
import { useAppStore } from '../store/useAppStore'

export function Dashboard() {
  const { analytics, campaigns, credits, governanceRules, dispatches, doctors } = useAppStore()
  const live = campaigns.filter((c) => c.status === 'live' || c.status === 'approved').length
  const covered = doctors.filter((d) => d.covered).length
  const uncovered = doctors.filter((d) => !d.covered).length

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Centro de mando"
        subtitle="Defina avatares, alimente productos y campañas, pruebe el mensaje, dé el go final y mida reach y engagement."
        actions={
          <>
            <Link to="/campanas"><Button>Nueva campaña</Button></Link>
            <Link to="/visita"><Button variant="outline">Ver visita demo</Button></Link>
          </>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Visitas enviadas" value={analytics.sent} hint={`Reach ${analytics.reachRate}%`} icon={<Send size={18} />} />
        <Stat label="Aperturas reales" value={analytics.opened} hint="Click en el link del VM" icon={<Users size={18} />} />
        <Stat label="CTA / engagement" value={analytics.ctaClicks} hint={`${analytics.engagementRate}% engagement`} icon={<MousePointerClick size={18} />} />
        <Stat label="Muestras solicitadas" value={analytics.samplesRequested} hint="Despacho automático MM" icon={<PackageOpen size={18} />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="border-b border-ink-100 px-5 py-4">
            <h3 className="text-sm font-semibold">Pilares operativos</h3>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-3">
            {[
              { n: '01', t: 'Gobernanza', d: 'Compliance y límites antes de cada respuesta.' },
              { n: '02', t: 'Campaña', d: 'Script del gerente de producto, sin desviaciones.' },
              { n: '03', t: 'Corpus interno', d: 'Solo docs de la compañía. Cero terceros. Anti-alucinación.' },
            ].map((p) => (
              <div
                key={p.n}
                className="rounded-2xl border border-ink-100 bg-ink-50/60 p-4 transition-all duration-200 hover:border-brand-200 hover:bg-brand-50/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                <p className="font-display text-2xl text-brand-700">{p.n}</p>
                <p className="mt-1 text-sm font-semibold text-ink-900">{p.t}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">{p.d}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-2 border-t border-ink-100 px-5 py-4 sm:grid-cols-2">
            {governanceRules.slice(0, 4).map((r) => (
              <div
                key={r.id}
                className="flex items-start gap-2 rounded-xl bg-white p-2 transition-all duration-200 hover:bg-brand-50/40 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer"
              >
                <ShieldCheck size={16} className="mt-0.5 text-brand-600" />
                <div>
                  <p className="text-xs font-semibold text-ink-800">{r.title}</p>
                  <p className="text-[11px] text-ink-500 line-clamp-2">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Estado rápido</p>
          <div className="mt-4 space-y-3">
            <Row k="Campañas activas / aprobadas" v={String(live)} />
            <Row k="Médicos cubiertos" v={String(covered)} />
            <Row k="Médicos no alcanzados" v={String(uncovered)} />
            <Row k="Saldo créditos" v={`$${credits.balance.toLocaleString()}`} />
            <Row k="Costo por VM" v={`$${credits.costPerVisit}`} />
          </div>
          <div className="mt-5 rounded-2xl bg-ink-900 p-4 text-white">
            <p className="text-sm font-semibold">Promesa económica</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-300">
              Vehículo masivo y barato: el laboratorio recarga saldo y escala envíos sin fricción.
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h3 className="text-sm font-semibold">Últimos despachos</h3>
            <Activity size={16} className="text-ink-400" />
          </div>
          <div className="divide-y divide-ink-100">
            {dispatches.map((d) => {
              const camp = campaigns.find((c) => c.id === d.campaignId)
              return (
                <div
                  key={d.id}
                  className="flex items-center justify-between gap-3 px-5 py-3 transition-all duration-200 hover:bg-ink-50/50 hover:-translate-x-0.5 cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-800">{camp?.name ?? d.campaignId}</p>
                    <p className="text-xs text-ink-500">{d.recipientCount} dest. · {d.channel} · -{d.costCredits} cr</p>
                  </div>
                  <Badge tone="success">{d.status}</Badge>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <div className="border-b border-ink-100 px-5 py-4">
            <h3 className="text-sm font-semibold">Targets</h3>
          </div>
          <div className="space-y-3 p-5">
            {[
              { t: 'Médicos que ya vemos', d: 'Refuerzo del visitador real. El VM siempre aclara que no lo reemplaza.' },
              { t: 'Médicos no alcanzados', d: 'Visita multiproducto con CTA de muestra por producto.' },
              { t: 'Dependientes de farmacia', d: 'Entrenamiento, recordación de marca y certificado.' },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-2xl border border-ink-100 p-4 transition-all duration-200 hover:border-brand-200 hover:bg-brand-50/30 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer"
              >
                <p className="text-sm font-semibold text-ink-900">{x.t}</p>
                <p className="mt-1 text-xs text-ink-500">{x.d}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-ink-500">{k}</span>
      <span className="font-semibold text-ink-900">{v}</span>
    </div>
  )
}
