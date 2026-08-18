import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  MousePointerClick,
  PackageOpen,
  Send,
  ShieldCheck,
  Users,
  Target,
  Sparkles,
  TrendingUp,
  Wallet,
  Building2,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Badge, Button, Card, Modal, PageHeader } from "../components/ui";
import { useAppStore } from "../store/useAppStore";

export function Dashboard() {
  const {
    analytics,
    campaigns,
    credits,
    governanceRules,
    dispatches,
    doctors,
  } = useAppStore();

  const live = campaigns.filter(
    (c) => c.status === "live" || c.status === "approved",
  ).length;
  const covered = doctors.filter((d) => d.covered).length;
  const uncovered = doctors.filter((d) => !d.covered).length;

  // Estado para la regla de gobernanza seleccionada
  const [selectedRule, setSelectedRule] = useState<
    (typeof governanceRules)[0] | null
  >(null);

  // Estado para controlar la apertura del modal "Estado rápido"
  const [isQuickStatusOpen, setIsQuickStatusOpen] = useState(false);

  // Configuración visual para cada una de las 6 reglas de gobernanza
  const ruleStyles = [
    {
      bg: "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40 text-emerald-700",
      icon: "text-emerald-600",
    },
    {
      bg: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40 text-blue-700",
      icon: "text-blue-600",
    },
    {
      bg: "bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/40 text-indigo-700",
      icon: "text-indigo-600",
    },
    {
      bg: "bg-violet-500/10 border-violet-500/20 hover:border-violet-500/40 text-violet-700",
      icon: "text-violet-600",
    },
    {
      bg: "bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40 text-amber-700",
      icon: "text-amber-600",
    },
    {
      bg: "bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40 text-rose-700",
      icon: "text-rose-600",
    },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Centro de mando"
        subtitle="Defina avatares, alimente productos y campañas, pruebe el mensaje, dé el go final y mida reach y engagement."
        actions={
          <>
            <Link to="/campanas">
              <Button className="shadow-md shadow-brand-700/20">
                Nueva campaña
              </Button>
            </Link>
            <Link to="/visita">
              <Button variant="outline">Ver visita demo</Button>
            </Link>
          </>
        }
      />

      {/* 1. SECCIÓN DE MÉTRICAS / KPI */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Visitas enviadas */}
        <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600/80">
              Visitas enviadas
            </span>
            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 transition-transform group-hover:scale-110">
              <Send size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {analytics.sent}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-blue-700">
            <TrendingUp size={14} />
            <span>Reach {analytics.reachRate}%</span>
          </div>
        </div>

        {/* Aperturas reales */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600/80">
              Aperturas reales
            </span>
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 transition-transform group-hover:scale-110">
              <Users size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {analytics.opened}
          </p>
          <p className="mt-2 text-xs font-medium text-emerald-700/80">
            Click en el link del VM
          </p>
        </div>

        {/* CTA / Engagement */}
        <div className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600/80">
              CTA / Engagement
            </span>
            <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-600 transition-transform group-hover:scale-110">
              <MousePointerClick size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {analytics.ctaClicks}
          </p>
          <p className="mt-2 text-xs font-medium text-violet-700/80">
            {analytics.engagementRate}% engagement
          </p>
        </div>

        {/* Muestras solicitadas */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600/80">
              Muestras solicitadas
            </span>
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 transition-transform group-hover:scale-110">
              <PackageOpen size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {analytics.samplesRequested}
          </p>
          <p className="mt-2 text-xs font-medium text-amber-700/80">
            Despacho automático MM
          </p>
        </div>
      </div>

      {/* 2. PILARES OPERATIVOS & GOBERNANZA (ANCHO COMPLETO HORIZONTAL) */}
      <Card className="overflow-hidden border-ink-200/60 w-full">
        <div className="flex items-center gap-2 border-b border-ink-100 bg-gradient-to-r from-ink-50/80 to-white px-6 py-4">
          <Sparkles size={18} className="text-brand-600" />
          <h3 className="text-sm font-bold tracking-wide text-ink-900 uppercase">
            Pilares operativos & Gobernanza
          </h3>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3">
          {[
            {
              n: "01",
              t: "Gobernanza",
              d: "Compliance y límites antes de cada respuesta.",
              color: "from-brand-50 to-white border-brand-100",
            },
            {
              n: "02",
              t: "Campaña",
              d: "Script del gerente de producto, sin desviaciones.",
              color: "from-blue-50/50 to-white border-blue-100",
            },
            {
              n: "03",
              t: "Corpus interno",
              d: "Solo docs de la compañía. Cero terceros. Anti-alucinación.",
              color: "from-emerald-50/50 to-white border-emerald-100",
            },
          ].map((p) => (
            <div
              key={p.n}
              className={`relative rounded-2xl border bg-gradient-to-b ${p.color} p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
            >
              <span className="font-display text-3xl font-black text-brand-700/30">
                {p.n}
              </span>
              <p className="mt-1 text-sm font-bold text-ink-900">{p.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">{p.d}</p>
            </div>
          ))}
        </div>

        {/* 6 REGLAS DE GOBERNANZA INTERACTIVAS */}
        <div className="border-t border-ink-100 bg-slate-50/50 p-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-400">
            Reglas de Gobernanza Activas
          </p>

          {governanceRules.filter((r) => r.enforced).length === 0 ? (
            <p className="text-xs text-ink-400 italic">
              No hay reglas de gobernanza activas actualmente.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {governanceRules
                .filter((r) => r.enforced)
                .slice(0, 6)
                .map((r, index) => {
                  const style = ruleStyles[index % ruleStyles.length];
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRule(r)}
                      className={`group flex items-center justify-between gap-2.5 rounded-xl border p-3.5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${style.bg}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ShieldCheck
                          size={18}
                          className={`shrink-0 ${style.icon}`}
                        />
                        <p className="text-xs font-semibold line-clamp-2 leading-snug">
                          {r.title}
                        </p>
                      </div>
                      <ChevronRight
                        size={14}
                        className="shrink-0 opacity-40 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </Card>

      {/* 3. BOTÓN/TARJETA DE ESTADO RÁPIDO (JUSTO DEBAJO DE PILARES, ANCHO COMPLETO) */}
      <Card
        onClick={() => setIsQuickStatusOpen(true)}
        className="group relative flex items-center justify-between overflow-hidden border-emerald-200/80 bg-gradient-to-r from-emerald-50/60 via-white to-brand-50/30 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md cursor-pointer w-full"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 transition-transform group-hover:scale-105 shrink-0">
            <Wallet size={24} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                Resumen Financiero
              </span>
              <span className="text-xs text-ink-400 hidden sm:inline">
                · Clic para abrir métricas de cobertura y saldo
              </span>
            </div>
            <h3 className="text-base font-bold text-ink-900 mt-0.5">
              Estado rápido, Cobertura & Saldo
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-ink-400">Saldo disponible</p>
            <p className="text-lg font-black text-emerald-600">
              ${credits.balance.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-600 p-2.5 text-white shadow-sm transition-transform group-hover:translate-x-0.5">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </Card>

      {/* 4. BLOQUE INFERIOR: ÚLTIMOS DESPACHOS Y AUDIENCIAS / TARGETS (2 COLUMNAS) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ÚLTIMOS DESPACHOS */}
        <Card className="overflow-hidden border-ink-200/60">
          <div className="flex items-center justify-between border-b border-ink-100 bg-gradient-to-r from-ink-50/50 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wide">
                Últimos despachos
              </h3>
            </div>
            <Badge tone="brand">En vivo</Badge>
          </div>
          <div className="divide-y divide-ink-100">
            {dispatches.map((d) => {
              const camp = campaigns.find((c) => c.id === d.campaignId);
              return (
                <div
                  key={d.id}
                  className="flex items-center justify-between gap-3 px-6 py-3.5 transition-colors duration-150 hover:bg-brand-50/30 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-emerald-100 p-1.5 text-emerald-700">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-800">
                        {camp?.name ?? d.campaignId}
                      </p>
                      <p className="text-xs text-ink-400">
                        {d.recipientCount} dest. ·{" "}
                        <span className="font-medium text-ink-600">
                          {d.channel}
                        </span>{" "}
                        · -{d.costCredits} cr
                      </p>
                    </div>
                  </div>
                  <Badge tone="success">{d.status}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        {/* AUDIENCIAS / TARGETS */}
        <Card className="overflow-hidden border-ink-200/60">
          <div className="flex items-center gap-2 border-b border-ink-100 bg-gradient-to-r from-ink-50/50 to-white px-6 py-4">
            <Target size={18} className="text-rose-600" />
            <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wide">
              Audiencias / Targets
            </h3>
          </div>
          <div className="space-y-3 p-6">
            {[
              {
                t: "Médicos que ya vemos",
                d: "Refuerzo del visitador real. El VM siempre aclara que no lo reemplaza.",
                tag: "Refuerzo",
                border: "border-l-4 border-l-blue-500 bg-blue-50/20",
              },
              {
                t: "Médicos no alcanzados",
                d: "Visita multiproducto con CTA de muestra por producto.",
                tag: "Expansion",
                border: "border-l-4 border-l-amber-500 bg-amber-50/20",
              },
              {
                t: "Dependientes de farmacia",
                d: "Entrenamiento, recordación de marca y certificado.",
                tag: "Training",
                border: "border-l-4 border-l-purple-500 bg-purple-50/20",
              },
            ].map((x) => (
              <div
                key={x.t}
                className={`rounded-xl border border-ink-100 ${x.border} p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-ink-900">{x.t}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400 bg-white px-2 py-0.5 rounded-full border border-ink-100">
                    {x.tag}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-500">
                  {x.d}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* MODAL PARA EL ESTADO RÁPIDO */}
      <Modal
        isOpen={isQuickStatusOpen}
        onClose={() => setIsQuickStatusOpen(false)}
        title="Estado rápido del sistema"
        actions={
          <Button variant="outline" onClick={() => setIsQuickStatusOpen(false)}>
            Cerrar
          </Button>
        }
      >
        <div className="space-y-5">
          <div className="space-y-3">
            <Row k="Campañas activas / aprobadas" v={String(live)} highlight />
            <Row k="Médicos cubiertos" v={String(covered)} />
            <Row k="Médicos no alcanzados" v={String(uncovered)} />
            <div className="my-2 border-t border-dashed border-ink-200" />
            <Row
              k="Saldo créditos"
              v={`$${credits.balance.toLocaleString()}`}
              isCurrency
            />
            <Row k="Costo por VM" v={`$${credits.costPerVisit}`} />
          </div>

          <div className="rounded-2xl border border-brand-200/80 bg-gradient-to-br from-brand-50/70 via-white to-brand-50/30 p-4">
            <div className="flex items-center gap-2 text-brand-700">
              <Building2 size={16} />
              <p className="text-xs font-bold uppercase tracking-wider">
                Promesa económica
              </p>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
              Vehículo masivo y barato: el laboratorio recarga saldo y escala
              envíos sin fricción.
            </p>
          </div>
        </div>
      </Modal>

      {/* MODAL INTERACTIVO DE REGLAS DE GOBERNANZA */}
      <Modal
        isOpen={selectedRule !== null}
        onClose={() => setSelectedRule(null)}
        title={selectedRule?.title}
        actions={
          <Button variant="outline" onClick={() => setSelectedRule(null)}>
            Cerrar
          </Button>
        }
      >
        {selectedRule && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge tone="brand">Gobernanza</Badge>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-1.5">
                Descripción completa de la regla
              </p>
              <p className="text-sm text-ink-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80 leading-relaxed">
                {selectedRule.description}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Row({
  k,
  v,
  highlight = false,
  isCurrency = false,
}: {
  k: string;
  v: string;
  highlight?: boolean;
  isCurrency?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-xs font-medium text-ink-500">{k}</span>
      <span
        className={`font-bold ${
          isCurrency
            ? "text-emerald-600 text-base"
            : highlight
              ? "text-brand-700"
              : "text-ink-900"
        }`}
      >
        {v}
      </span>
    </div>
  );
}
