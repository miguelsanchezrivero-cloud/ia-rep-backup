import { useState } from "react";
import {
  MapPin,
  Users,
  UserCheck,
  Target,
  TrendingUp,
  Calendar,
  BarChart3,
  Sparkles,
  ChevronRight,
  Briefcase,
  Award,
} from "lucide-react";
import { Badge, Button, Card, PageHeader, Modal, Stat } from "../components/ui";
import { useAppStore } from "../store/useAppStore";

export function Territory() {
  const { territoryInsights, realReps, campaigns, doctors } = useAppStore();

  // Estado para controlar el modal de detalle
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(
    null,
  );

  // Encontrar el insight seleccionado
  const selectedInsight = selectedInsightId
    ? territoryInsights.find((t) => t.repId === selectedInsightId)
    : null;

  // Encontrar el visitador real asociado
  const selectedRep = selectedInsight
    ? realReps.find((r) => r.id === selectedInsight.repId)
    : null;

  // Contar campañas activas para cada territorio (simulación con base en zonas)
  const getCampaignCountForZone = (zone: string) => {
    return campaigns.filter((c) => c.filters.zones?.includes(zone)).length;
  };

  // Paleta de degradados consistente con otras páginas
  const cardGradients = [
    "from-teal-50/60 via-white to-white border-teal-200/80 hover:border-teal-300",
    "from-sky-50/60 via-white to-white border-sky-200/80 hover:border-sky-300",
    "from-indigo-50/60 via-white to-white border-indigo-200/80 hover:border-indigo-300",
    "from-rose-50/60 via-white to-white border-rose-200/80 hover:border-rose-300",
  ];

  // Calcular totales globales
  const totalDoctors = doctors.length;
  const totalCovered = doctors.filter((d) => d.covered).length;
  const totalUncovered = totalDoctors - totalCovered;

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Apoyo al visitador · Territorio"
        subtitle="Análisis de zona para una mejor planeación estratégica del visitador humano. Haz clic en una tarjeta para ver el detalle completo."
        actions={
          <Button
            variant="outline"
            className="shadow-sm"
            onClick={() => {
              // Simular actualización de datos
              alert("Datos de territorio actualizados desde el CRM.");
            }}
          >
            <Sparkles size={16} />
            Sincronizar CRM
          </Button>
        }
      />

      {/* 1. MÉTRICAS GLOBALES (estilo Dashboard) */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600/80">
              Médicos totales
            </span>
            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 transition-transform group-hover:scale-110">
              <Users size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {totalDoctors}
          </p>
          <p className="mt-2 text-xs font-medium text-blue-700/80">
            Base de datos CRM
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600/80">
              Cubiertos
            </span>
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 transition-transform group-hover:scale-110">
              <UserCheck size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {totalCovered}
          </p>
          <p className="mt-2 text-xs font-medium text-emerald-700/80">
            {Math.round((totalCovered / totalDoctors) * 100)}% cobertura
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600/80">
              No alcanzados
            </span>
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 transition-transform group-hover:scale-110">
              <Target size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {totalUncovered}
          </p>
          <p className="mt-2 text-xs font-medium text-amber-700/80">
            Oportunidad de expansión
          </p>
        </div>
      </div>

      {/* 2. GRILLA DE TERRITORIOS (tarjetas interactivas) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Zonas y visitadores reales
          </p>
          <span className="text-xs text-ink-500 font-medium">
            {territoryInsights.length} territorios activos
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {territoryInsights.map((insight, index) => {
            const rep = realReps.find((r) => r.id === insight.repId);
            const cardStyle = cardGradients[index % cardGradients.length];
            const campaignCount = getCampaignCountForZone(insight.zone);

            return (
              <Card
                key={insight.repId}
                interactive
                onClick={() => setSelectedInsightId(insight.repId)}
                className={`relative overflow-hidden border bg-gradient-to-br ${cardStyle} p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-lg font-extrabold text-ink-900 tracking-tight">
                        {rep?.name || insight.repId}
                      </p>
                      <p className="text-xs font-semibold text-ink-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={13} className="text-brand-600 shrink-0" />
                        {insight.zone}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge tone="brand">{insight.totalDoctors} médicos</Badge>
                      {campaignCount > 0 && (
                        <Badge tone="success">{campaignCount} campañas</Badge>
                      )}
                    </div>
                  </div>

                  {/* Especialidades principales */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {insight.topSpecialties.slice(0, 3).map((s) => (
                      <Badge key={s.name} tone="neutral">
                        {s.name} ({s.count})
                      </Badge>
                    ))}
                  </div>

                  {/* Métricas rápidas */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-white/70 p-2 text-center border border-ink-100/80">
                      <p className="text-[10px] font-bold uppercase text-ink-400">
                        Cubiertos
                      </p>
                      <p className="text-sm font-black text-emerald-600">
                        {insight.covered}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/70 p-2 text-center border border-ink-100/80">
                      <p className="text-[10px] font-bold uppercase text-ink-400">
                        Alto potencial
                      </p>
                      <p className="text-sm font-black text-amber-600">
                        {insight.highPotentialUncovered}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/70 p-2 text-center border border-ink-100/80">
                      <p className="text-[10px] font-bold uppercase text-ink-400">
                        Ciclo anterior
                      </p>
                      <p className="text-sm font-black text-ink-700">
                        {insight.lastCyclePerformance.visits} v
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-ink-100/80 flex items-center justify-between text-xs font-bold text-brand-700">
                  <span>Ver análisis completo</span>
                  <ChevronRight size={16} />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 3. MODAL DE DETALLE DEL TERRITORIO */}
      <Modal
        isOpen={selectedInsight !== null}
        onClose={() => setSelectedInsightId(null)}
        title={`Análisis de territorio: ${selectedRep?.name || selectedInsight?.zone || ""}`}
        className="!max-w-4xl max-h-[85vh] overflow-y-auto"
      >
        {selectedInsight && selectedRep && (
          <div className="space-y-6 pt-1">
            {/* Cabecera con información del visitador */}
            <div className="rounded-2xl bg-gradient-to-br from-brand-50/60 via-white to-white border border-brand-100 p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-brand-100 p-3 text-brand-700">
                  <Briefcase size={28} />
                </div>
                <div>
                  <p className="text-xl font-black text-ink-900">
                    {selectedRep.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {selectedInsight.zone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {selectedInsight.totalDoctors} médicos
                    </span>
                    <span className="flex items-center gap-1">
                      <Award size={12} />{" "}
                      {selectedRep.specialtyFocus.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
              <Badge tone="brand">{selectedInsight.covered} cubiertos</Badge>
            </div>

            {/* Estadísticas detalladas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Stat
                label="Total médicos"
                value={selectedInsight.totalDoctors}
                hint="Base de datos CRM"
                icon={<Users size={18} />}
              />
              <Stat
                label="Cubiertos"
                value={selectedInsight.covered}
                hint={`${Math.round((selectedInsight.covered / selectedInsight.totalDoctors) * 100)}% cobertura`}
                icon={<UserCheck size={18} />}
              />
              <Stat
                label="Alto potencial no cubierto"
                value={selectedInsight.highPotentialUncovered}
                hint="Oportunidades de expansión"
                icon={<Target size={18} />}
              />
            </div>

            {/* Especialidades top */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-3 flex items-center gap-1.5">
                <BarChart3 size={14} className="text-brand-600" />
                Especialidades con mayor concentración
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {selectedInsight.topSpecialties.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between rounded-xl bg-ink-50/80 px-4 py-2.5 border border-ink-100/80 hover:bg-ink-100/60 transition-colors"
                  >
                    <span className="text-sm font-medium text-ink-700">
                      {s.name}
                    </span>
                    <span className="text-sm font-black text-brand-600">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones sugeridas */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-3 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-brand-600" />
                Acciones sugeridas por el sistema
              </p>
              <div className="space-y-2">
                {selectedInsight.suggestedActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-brand-200/80 bg-brand-50/40 p-3.5 hover:bg-brand-100/30 transition-colors cursor-pointer group"
                  >
                    <div className="mt-0.5 rounded-full bg-brand-500/20 p-1 text-brand-700 group-hover:scale-110 transition-transform">
                      <Sparkles size={14} />
                    </div>
                    <p className="text-sm text-ink-700 font-medium leading-relaxed">
                      {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rendimiento ciclo anterior */}
            <div className="rounded-2xl border border-ink-200/60 bg-gradient-to-br from-slate-50/80 to-white p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-3 flex items-center gap-1.5">
                <Calendar size={14} className="text-brand-600" />
                Rendimiento del ciclo anterior
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-black text-ink-900">
                    {selectedInsight.lastCyclePerformance.visits}
                  </p>
                  <p className="text-xs text-ink-500">Visitas</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-ink-900">
                    {selectedInsight.lastCyclePerformance.samples}
                  </p>
                  <p className="text-xs text-ink-500">Muestras entregadas</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-ink-900">
                    {selectedInsight.lastCyclePerformance.events}
                  </p>
                  <p className="text-xs text-ink-500">Eventos realizados</p>
                </div>
              </div>
            </div>

            {/* Botón para cerrar */}
            <div className="pt-4 border-t border-ink-100 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedInsightId(null)}
              >
                Cerrar análisis
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
