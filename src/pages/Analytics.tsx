import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, PageHeader, Stat } from '../components/ui'
import { useAppStore } from '../store/useAppStore'

export function Analytics() {
  const { analytics } = useAppStore()

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Analítica de campaña"
        subtitle="Reach real (click al link), engagement, CTAs, muestras y desempeño por canal y especialidad."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Enviados" value={analytics.sent} />
        <Stat label="Abiertos" value={analytics.opened} hint={`${analytics.reachRate}% reach`} />
        <Stat label="Engaged" value={analytics.engaged} hint={`${analytics.engagementRate}%`} />
        <Stat label="CTA clicks" value={analytics.ctaClicks} />
        <Stat label="Muestras" value={analytics.samplesRequested} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="mb-4 text-sm font-semibold">Aperturas y CTAs (diario)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="opens" name="Aperturas" stroke="#0f766e" strokeWidth={2} />
                <Line type="monotone" dataKey="ctas" name="CTAs" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <p className="mb-4 text-sm font-semibold">Por canal</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.byChannel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="channel" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="sent" name="Enviados" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="opened" name="Abiertos" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <p className="mb-4 text-sm font-semibold">Aperturas por especialidad / farmacia</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.bySpecialty} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="specialty" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="opened" name="Aperturas" fill="#115e59" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
