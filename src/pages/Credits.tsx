import { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  Plus,
  DollarSign,
  TrendingUp,
  Receipt,
  Sparkles,
  ShieldCheck,
  Building2,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Input,
  Label,
  PageHeader,
  Stat,
} from "../components/ui";
import { useAppStore } from "../store/useAppStore";

export function Credits() {
  const { credits, topUpCredits } = useAppStore();
  const [amount, setAmount] = useState(1000);

  // Paleta de degradados para las tarjetas de estadísticas (estilo consistente con Dashboard/Analytics)
  const statCardStyles = [
    "border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-white text-emerald-700",
    "border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-white text-blue-700",
    "border-violet-100 bg-gradient-to-br from-violet-50/60 via-white to-white text-violet-700",
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Modelo económico y créditos"
        subtitle="Instalación + saldo acreditado. La clave: costo muy bajo por VM enviada para masificar la comunicación."
      />

      {/* 1. SECCIÓN DE MÉTRICAS / KPI INTERACTIVAS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600/80">
              Saldo actual
            </span>
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 transition-transform group-hover:scale-110">
              <Wallet size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            ${credits.balance.toLocaleString()}
          </p>
          <p className="mt-2 text-xs font-medium text-emerald-700/80">
            Moneda: {credits.currency}
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600/80">
              Costo por visita
            </span>
            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 transition-transform group-hover:scale-110">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            ${credits.costPerVisit}
          </p>
          <p className="mt-2 text-xs font-medium text-blue-700/80">
            Promesa: vehículo económico
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600/80">
              Plus por CTA
            </span>
            <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-600 transition-transform group-hover:scale-110">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {credits.costPerCta ? `$${credits.costPerCta}` : "$0"}
          </p>
          <p className="mt-2 text-xs font-medium text-violet-700/80">
            Opcional / desempeño
          </p>
        </div>
      </div>

      {/* 2. GRILLA PRINCIPAL INTERACTIVA */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* COLUMNA IZQUIERDA: RECARGAR SALDO */}
        <Card className="p-5 lg:col-span-1 border-ink-200/60 bg-gradient-to-br from-slate-50/40 via-white to-white shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-700 flex items-center gap-1.5">
                <Sparkles size={14} className="text-brand-600" />
                Recargar saldo
              </p>
              <span className="text-[11px] text-ink-400 italic">
                Créditos inmediatos
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Monto a acreditar (USD)</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              {/* Botones de selección rápida interactivos */}
              <div className="flex gap-1.5">
                {[500, 1000, 5000, 10000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`flex-1 text-[10px] font-bold py-1 rounded-lg border transition-all ${
                      amount === preset
                        ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                        : "bg-white text-ink-600 border-ink-200 hover:border-brand-300"
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>

              <Button
                className="w-full shadow-md shadow-brand-700/20 mt-2"
                onClick={() => amount > 0 && topUpCredits(amount)}
              >
                <Plus size={16} />
                Acreditar saldo
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-2 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/30 p-4 text-xs text-ink-600 border border-ink-100">
            <p className="font-bold text-ink-900 flex items-center gap-1.5">
              <Building2 size={14} className="text-brand-600" />
              Estructura de cobro
            </p>
            <p>• Instalación y puesta en marcha inicial</p>
            <p>• Conexión bidireccional con el CRM</p>
            <p>• Valor por mensaje / VM enviada optimizado</p>
            <p>• Operación in-house y soporte opcional</p>
          </div>
        </Card>

        {/* COLUMNA DERECHA: MOVIMIENTOS Y TRANSACCIONES */}
        <Card className="lg:col-span-2 border-ink-200/60 bg-gradient-to-br from-slate-50/40 via-white to-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4 bg-gradient-to-r from-ink-50/50 to-white">
            <div className="flex items-center gap-2">
              <Receipt size={16} className="text-brand-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-700">
                Historial de movimientos
              </h3>
            </div>
            <Badge tone="brand">{credits.transactions.length} registros</Badge>
          </div>

          <div className="divide-y divide-ink-100 max-h-[420px] overflow-y-auto">
            {credits.transactions.length === 0 ? (
              <div className="px-5 py-8 text-center text-xs text-ink-400 italic">
                No hay movimientos registrados en este período.
              </div>
            ) : (
              credits.transactions.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 transition-all duration-200 hover:bg-slate-50/80 hover:-translate-x-0.5 cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-ink-900">{t.label}</p>
                    <p className="text-xs text-ink-400 font-medium">{t.at}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p
                      className={`text-sm font-black tracking-tight ${
                        t.amount >= 0 ? "text-emerald-700" : "text-rose-600"
                      }`}
                    >
                      {t.amount >= 0 ? "+" : ""}
                      {t.amount.toLocaleString()}
                    </p>
                    <div>
                      <Badge tone={t.amount >= 0 ? "success" : "neutral"}>
                        {t.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
