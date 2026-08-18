import { useState } from 'react'
import { Badge, Button, Card, Input, Label, PageHeader, Stat } from '../components/ui'
import { useAppStore } from '../store/useAppStore'

export function Credits() {
  const { credits, topUpCredits } = useAppStore()
  const [amount, setAmount] = useState(1000)

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Modelo económico y créditos"
        subtitle="Instalación + saldo acreditado. La clave: costo muy bajo por VM enviada para masificar la comunicación."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Saldo actual" value={`$${credits.balance.toLocaleString()}`} hint={credits.currency} />
        <Stat label="Costo por visita" value={`$${credits.costPerVisit}`} hint="Promesa: vehículo económico" />
        <Stat label="Plus por CTA" value={credits.costPerCta ? `$${credits.costPerCta}` : 'Opcional / $0'} hint="Pensar si aplica" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <p className="text-sm font-semibold">Recargar saldo</p>
          <div className="mt-4 space-y-3">
            <div>
              <Label>Monto (USD)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
            <Button className="w-full" onClick={() => amount > 0 && topUpCredits(amount)}>
              Acreditar saldo
            </Button>
          </div>
          <div className="mt-5 space-y-2 rounded-2xl bg-ink-50 p-4 text-xs text-ink-600">
            <p className="font-semibold text-ink-800">Cobramos</p>
            <p>• Instalación y puesta en marcha</p>
            <p>• Conexión con CRM</p>
            <p>• Valor por mensaje / VM enviada</p>
            <p>• Operación in-house opcional</p>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="border-b border-ink-100 px-5 py-4">
            <h3 className="text-sm font-semibold">Movimientos</h3>
          </div>
          <div className="divide-y divide-ink-100">
            {credits.transactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-3 px-5 py-3 transition-all duration-200 hover:bg-ink-50/50 hover:-translate-x-0.5 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-ink-800">{t.label}</p>
                  <p className="text-xs text-ink-400">{t.at}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${t.amount >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {t.amount >= 0 ? '+' : ''}
                    {t.amount.toLocaleString()}
                  </p>
                  <Badge>{t.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
