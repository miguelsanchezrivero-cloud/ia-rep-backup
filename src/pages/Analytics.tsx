import { useState } from "react";
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
} from "recharts";
import {
  TrendingUp,
  Users,
  MousePointerClick,
  PackageOpen,
  Send,
  Sparkles,
  Filter,
  Layers,
  Stethoscope,
} from "lucide-react";
import { Badge, Button, Card, PageHeader, Stat } from "../components/ui";
import { useAppStore } from "../store/useAppStore";

export function Analytics() {
  const { analytics, campaigns } = useAppStore();

  // Estado interactivo para filtrar o enfocar métricas y canales (estilo compatible con el resto de la app)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null,
  );

  // Filtrado dinámico interactivo por canal en los gráficos de barras y líneas
  const filteredDailyData = analytics.daily;

  const filteredChannelData = selectedChannel
    ? analytics.byChannel.filter((c) => c.channel === selectedChannel)
    : analytics.byChannel;

  const filteredSpecialtyData = selectedSpecialty
    ? analytics.bySpecialty.filter((s) => s.specialty === selectedSpecialty)
    : analytics.bySpecialty;

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Analítica de campaña"
        subtitle="Reach real (click al link), engagement, CTAs, muestras y desempeño por canal y especialidad."
        actions={
          (selectedChannel || selectedSpecialty) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedChannel(null);
                setSelectedSpecialty(null);
              }}
              className="text-xs"
            >
              <Filter size={14} />
              Limpiar filtros interactivos
            </Button>
          )
        }
      />

      {/* 1. SECCIÓN DE MÉTRICAS / KPI INTERACTIVAS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600/80">
              Enviados
            </span>
            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 transition-transform group-hover:scale-110">
              <Send size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {analytics.sent}
          </p>
          <p className="mt-2 text-xs font-medium text-blue-700/80">
            Total despachos omnicanal
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600/80">
              Abiertos
            </span>
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 transition-transform group-hover:scale-110">
              <Users size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {analytics.opened}
          </p>
          <p className="mt-2 text-xs font-medium text-emerald-700/80">
            {analytics.reachRate}% reach real
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600/80">
              Engaged
            </span>
            <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-600 transition-transform group-hover:scale-110">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {analytics.engaged}
          </p>
          <p className="mt-2 text-xs font-medium text-violet-700/80">
            {analytics.engagementRate}% interacción
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600/80">
              CTA clicks
            </span>
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 transition-transform group-hover:scale-110">
              <MousePointerClick size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {analytics.ctaClicks}
          </p>
          <p className="mt-2 text-xs font-medium text-amber-700/80">
            Acciones en enlaces
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600/80">
              Muestras
            </span>
            <div className="rounded-xl bg-teal-500/10 p-2.5 text-teal-600 transition-transform group-hover:scale-110">
              <PackageOpen size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {analytics.samplesRequested}
          </p>
          <p className="mt-2 text-xs font-medium text-teal-700/80">
            Solicitudes procesadas
          </p>
        </div>
      </div>

      {/* 2. GRILLA DE GRÁFICOS INTERACTIVOS */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* GRÁFICO 1: Aperturas y CTAs (diario) */}
        <Card
          interactive
          className="p-5 border-ink-200/60 bg-gradient-to-br from-slate-50/40 via-white to-white shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-700 flex items-center gap-1.5">
              <Sparkles size={14} className="text-brand-600" />
              Aperturas y CTAs (diario)
            </p>
            <span className="text-[11px] text-ink-400 italic">
              Evolución temporal
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredDailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="opens"
                  name="Aperturas"
                  stroke="#0f766e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="ctas"
                  name="CTAs"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* GRÁFICO 2: Por canal (Interactivo con opción "Todos") */}
        <Card
          interactive
          className="p-5 border-ink-200/60 bg-gradient-to-br from-slate-50/40 via-white to-white shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-700 flex items-center gap-1.5">
              <Layers size={14} className="text-brand-600" />
              Desempeño por canal{" "}
              {selectedChannel && (
                <span className="text-brand-600 lowercase">
                  ({selectedChannel})
                </span>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedChannel(null)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                  selectedChannel === null
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                    : "bg-white text-ink-600 border-ink-200 hover:border-brand-300"
                }`}
              >
                Todos
              </button>
              {analytics.byChannel.map((c) => (
                <button
                  key={c.channel}
                  onClick={() =>
                    setSelectedChannel(
                      selectedChannel === c.channel ? null : c.channel,
                    )
                  }
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                    selectedChannel === c.channel
                      ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                      : "bg-white text-ink-600 border-ink-200 hover:border-brand-300"
                  }`}
                >
                  {c.channel}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredChannelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="channel" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="sent"
                  name="Enviados"
                  fill="#94a3b8"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="opened"
                  name="Abiertos"
                  fill="#0d9488"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* GRÁFICO 3: Aperturas por especialidad / farmacia (Con opción "Todas") */}
        <Card
          interactive
          className="p-5 lg:col-span-2 border-ink-200/60 bg-gradient-to-br from-slate-50/40 via-white to-white shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-700 flex items-center gap-1.5">
              <Stethoscope size={14} className="text-brand-600" />
              Aperturas por especialidad / farmacia
            </p>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedSpecialty(null)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                  selectedSpecialty === null
                    ? "bg-brand-700 text-white border-brand-700 shadow-sm"
                    : "bg-white text-ink-600 border-ink-200 hover:border-brand-300"
                }`}
              >
                Todas
              </button>
              {analytics.bySpecialty.map((s) => (
                <button
                  key={s.specialty}
                  onClick={() =>
                    setSelectedSpecialty(
                      selectedSpecialty === s.specialty ? null : s.specialty,
                    )
                  }
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                    selectedSpecialty === s.specialty
                      ? "bg-brand-700 text-white border-brand-700 shadow-sm"
                      : "bg-white text-ink-600 border-ink-200 hover:border-brand-300"
                  }`}
                >
                  {s.specialty}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredSpecialtyData}
                layout="vertical"
                margin={{ left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="specialty"
                  width={140}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar
                  dataKey="opened"
                  name="Aperturas"
                  fill="#115e59"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
