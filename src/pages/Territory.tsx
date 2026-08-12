import { Card, PageHeader, Stat } from '../components/ui'
import { useAppStore } from '../store/useAppStore'

export function Territory() {
  const { territoryInsights, realReps } = useAppStore()

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Apoyo al visitador · territorio"
        subtitle="Análisis de zona para una mejor planeación estratégica del visitador humano."
      />

      <div className="space-y-4">
        {territoryInsights.map((t) => {
          const rep = realReps.find((r) => r.id === t.repId)
          return (
            <Card key={t.repId} className="p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{t.zone}</p>
                  <h2 className="text-xl font-semibold">{rep?.name ?? t.repId}</h2>
                </div>
                <p className="text-xs text-ink-500">
                  Ciclo anterior: {t.lastCyclePerformance.visits} visitas · {t.lastCyclePerformance.samples} muestras ·{' '}
                  {t.lastCyclePerformance.events} eventos
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Stat label="Médicos en zona" value={t.totalDoctors} />
                <Stat label="Cubiertos" value={t.covered} />
                <Stat label="Alto potencial no cubierto" value={t.highPotentialUncovered} />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Top especialidades</p>
                  <div className="mt-2 space-y-2">
                    {t.topSpecialties.map((s) => (
                      <div key={s.name} className="flex items-center justify-between rounded-xl bg-ink-50 px-3 py-2 text-sm">
                        <span>{s.name}</span>
                        <span className="font-semibold">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Acciones sugeridas</p>
                  <ul className="mt-2 space-y-2">
                    {t.suggestedActions.map((a) => (
                      <li key={a} className="rounded-xl border border-brand-100 bg-brand-50/40 px-3 py-2 text-sm text-ink-700">
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
