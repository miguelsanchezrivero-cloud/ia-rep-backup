import { Badge, Card, PageHeader } from '../components/ui'
import { useAppStore } from '../store/useAppStore'

export function Crm() {
  const { doctors, pharmacyStaff, realReps, campaigns } = useAppStore()

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="CRM y audiencias"
        subtitle="Conexión con el CRM del laboratorio: todos, por especialidad, zona, tags, visitador saliente o listas específicas."
      />

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        {[
          { t: 'Todos los médicos', n: doctors.length },
          { t: 'Cubiertos', n: doctors.filter((d) => d.covered).length },
          { t: 'No alcanzados', n: doctors.filter((d) => !d.covered).length },
          { t: 'Farmacia', n: pharmacyStaff.length },
        ].map((x) => (
          <Card key={x.t} className="p-4">
            <p className="text-xs text-ink-500">{x.t}</p>
            <p className="mt-1 text-2xl font-semibold">{x.n}</p>
          </Card>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="mb-2 text-sm font-semibold">Visitadores reales (apoyo, no reemplazo)</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {realReps.map((r) => (
            <Card key={r.id} className="p-4">
              <p className="font-semibold">{r.name}</p>
              <p className="text-xs text-ink-500">{r.territory}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {r.specialtyFocus.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-ink-400">
                Médicos asignados: {doctors.filter((d) => d.realRepId === r.id).length}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-ink-100 px-5 py-4">
          <h3 className="text-sm font-semibold">Base médica</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Médico</th>
                <th className="px-4 py-3">Especialidad</th>
                <th className="px-4 py-3">Zona</th>
                <th className="px-4 py-3">Cobertura</th>
                <th className="px-4 py-3">VM real</th>
                <th className="px-4 py-3">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {doctors.map((d) => (
                <tr key={d.id} className="hover:bg-ink-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{d.title} {d.name}</p>
                    <p className="text-xs text-ink-400">{d.email ?? d.phone ?? '—'}</p>
                  </td>
                  <td className="px-4 py-3">{d.specialty}</td>
                  <td className="px-4 py-3">{d.zone}</td>
                  <td className="px-4 py-3">
                    {d.covered ? <Badge tone="success">Cubierto</Badge> : <Badge tone="warn">No alcanzado</Badge>}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {realReps.find((r) => r.id === d.realRepId)?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {d.tags.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-4 overflow-hidden">
        <div className="border-b border-ink-100 px-5 py-4">
          <h3 className="text-sm font-semibold">Dependientes de farmacia</h3>
        </div>
        <div className="divide-y divide-ink-100">
          {pharmacyStaff.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-ink-500">{p.pharmacy} · {p.city} · {p.role}</p>
              </div>
              <Badge tone="brand">Entrenamiento</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-4 p-5">
        <p className="text-sm font-semibold">Ejemplos de segmentación usados en campañas</p>
        <ul className="mt-3 space-y-2 text-sm text-ink-600">
          {campaigns.map((c) => (
            <li key={c.id}>
              <span className="font-medium text-ink-900">{c.name}:</span>{' '}
              {c.audience.replaceAll('_', ' ')}
              {c.filters.specialties ? ` · ${c.filters.specialties.join(', ')}` : ''}
              {c.filters.zones ? ` · ${c.filters.zones.join(', ')}` : ''}
              {c.filters.tags ? ` · tags ${c.filters.tags.join(', ')}` : ''}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
