import {
  ShieldCheck,
  Ban,
  BookLock,
  Scale,
  MessageSquareQuote,
} from "lucide-react";
import { Badge, Card, PageHeader, Button } from "../components/ui";
import { useAppStore } from "../store/useAppStore";

export function Governance() {
  const { governanceRules, setRuleEnforcement } = useAppStore();

  // Mismos estilos dinámicos por tarjeta que se usan en el Dashboard
  const ruleStyles = [
    {
      activeBg:
        "bg-gradient-to-br from-emerald-50/60 via-white to-white border-emerald-200/80",
      activeIconBg: "bg-emerald-500/10 text-emerald-600",
      accent: "text-emerald-700",
    },
    {
      activeBg:
        "bg-gradient-to-br from-blue-50/60 via-white to-white border-blue-200/80",
      activeIconBg: "bg-blue-500/10 text-blue-600",
      accent: "text-blue-700",
    },
    {
      activeBg:
        "bg-gradient-to-br from-indigo-50/60 via-white to-white border-indigo-200/80",
      activeIconBg: "bg-indigo-500/10 text-indigo-600",
      accent: "text-indigo-700",
    },
    {
      activeBg:
        "bg-gradient-to-br from-violet-50/60 via-white to-white border-violet-200/80",
      activeIconBg: "bg-violet-500/10 text-violet-600",
      accent: "text-violet-700",
    },
    {
      activeBg:
        "bg-gradient-to-br from-amber-50/60 via-white to-white border-amber-200/80",
      activeIconBg: "bg-amber-500/10 text-amber-600",
      accent: "text-amber-700",
    },
    {
      activeBg:
        "bg-gradient-to-br from-rose-50/60 via-white to-white border-rose-200/80",
      activeIconBg: "bg-rose-500/10 text-rose-600",
      accent: "text-rose-700",
    },
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Capa de gobernanza"
        subtitle="Prioridad 1 del sistema. Sin gobernanza no hay respuesta. Luego campaña. Luego solo documentación interna."
      />

      {/* 1. PILARES / PASOS SUPERIORES */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Scale,
            n: "01",
            t: "Gobernanza",
            d: "Políticas, ética promocional y compliance.",
            color: "from-brand-50/60 to-white border-brand-100/80",
            iconBg: "bg-brand-500/10 text-brand-600",
          },
          {
            icon: BookLock,
            n: "02",
            t: "Campaña",
            d: "Script y mensajes exactos del gerente de producto.",
            color: "from-blue-50/50 to-white border-blue-100/80",
            iconBg: "bg-blue-500/10 text-blue-600",
          },
          {
            icon: Ban,
            n: "03",
            t: "Sin terceros",
            d: "RAG solo en docs aprobados. Anti-alucinación + escalamiento.",
            color: "from-emerald-50/50 to-white border-emerald-100/80",
            iconBg: "bg-emerald-500/10 text-emerald-600",
          },
        ].map((x) => (
          <Card
            key={x.t}
            className={`relative overflow-hidden border bg-gradient-to-b ${x.color} p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-3xl font-black text-brand-700/25">
                {x.n}
              </span>
              <div className={`rounded-xl p-2.5 ${x.iconBg}`}>
                <x.icon size={20} />
              </div>
            </div>
            <p className="mt-3 text-sm font-bold text-ink-900">{x.t}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">{x.d}</p>
          </Card>
        ))}
      </div>

      {/* 2. REGLAS DE GOBERNANZA CON ESTILO DASHBOARD */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-ink-400 px-1">
          Reglas del Sistema ({governanceRules.filter((r) => r.enforced).length}{" "}
          Activas / {governanceRules.length} Total)
        </p>

        {governanceRules.map((r, index) => {
          const style = ruleStyles[index % ruleStyles.length];
          const isEnforced = r.enforced;

          return (
            <Card
              key={r.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition-all duration-200 border hover:shadow-md ${
                isEnforced
                  ? style.activeBg
                  : "bg-slate-50/40 border-ink-200/60 opacity-75"
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                <div
                  className={`rounded-2xl p-3 shrink-0 transition-transform ${
                    isEnforced ? style.activeIconBg : "bg-ink-100 text-ink-400"
                  }`}
                >
                  <ShieldCheck size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-ink-900">{r.title}</p>
                    <Badge tone={isEnforced ? "brand" : "neutral"}>
                      Prioridad {r.priority}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-ink-600">
                    {r.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-ink-100 w-full sm:w-auto justify-between sm:justify-end">
                {isEnforced ? (
                  <Badge tone="success">Activo</Badge>
                ) : (
                  <Badge tone="neutral">Desactivado</Badge>
                )}

                <Button
                  size="sm"
                  variant={isEnforced ? "outline" : "primary"}
                  onClick={() => setRuleEnforcement(r.id, !isEnforced)}
                  className="whitespace-nowrap shadow-sm"
                >
                  {isEnforced ? "Desactivar" : "Activar regla"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. BLOQUE DE RESPUESTA CANÓNICA */}
      <Card className="overflow-hidden border-ink-200/60 bg-gradient-to-br from-slate-50/80 via-white to-brand-50/20 p-6">
        <div className="flex items-center gap-2 text-ink-900">
          <MessageSquareQuote size={18} className="text-brand-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-700">
            Respuesta canónica fuera de límites
          </h3>
        </div>
        <blockquote className="mt-3 rounded-2xl border border-ink-200/60 bg-white/80 p-4 text-xs italic leading-relaxed text-ink-700 shadow-sm">
          “No dispongo de esa información en este momento, pero haré la pregunta
          al departamento médico, legal u otro correspondiente y le traeré la
          respuesta en su próxima visita.”
        </blockquote>
      </Card>
    </div>
  );
}
