import { useState, useMemo, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Store,
  Search,
  MapPin,
  ChevronRight,
  Target,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Info,
  X,
  Stethoscope,
  Briefcase,
} from "lucide-react";
import { Badge, Card, Input, PageHeader } from "../components/ui";
import { useAppStore } from "../store/useAppStore";
import type { Campaign } from "../types";

export function Crm() {
  const { doctors, pharmacyStaff, realReps, campaigns } = useAppStore();

  // Estados para controlar las burbujas activas
  const [activeDoctorId, setActiveDoctorId] = useState<string | null>(null);
  const [activePharmacyId, setActivePharmacyId] = useState<string | null>(null);

  // Estado para la campaña seleccionada (burbuja de apertura bajo la tarjeta)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );

  // Filtros de búsqueda y cobertura
  const [searchTerm, setSearchTerm] = useState("");
  const [coverageFilter, setCoverageFilter] = useState<
    "all" | "covered" | "uncovered"
  >("all");

  // Ocultar automáticamente la burbuja de la campaña tras 5 segundos
  useEffect(() => {
    if (selectedCampaignId) {
      const timer = setTimeout(() => {
        setSelectedCampaignId(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [selectedCampaignId]);

  // Filtrado dinámico de la base médica
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.zone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCoverage =
        coverageFilter === "all" ||
        (coverageFilter === "covered" && doc.covered) ||
        (coverageFilter === "uncovered" && !doc.covered);

      return matchesSearch && matchesCoverage;
    });
  }, [doctors, searchTerm, coverageFilter]);

  const cardGradients = [
    "from-teal-50/60 via-white to-white border-teal-200/80",
    "from-sky-50/60 via-white to-white border-sky-200/80",
    "from-indigo-50/60 via-white to-white border-indigo-200/80",
    "from-rose-50/60 via-white to-white border-rose-200/80",
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="CRM y audiencias"
        subtitle="Conexión con el CRM del laboratorio: segmentación médica, cobertura de visitadores reales y red de dependientes de farmacia."
      />

      {/* 1. SECCIÓN DE MÉTRICAS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          onClick={() => setCoverageFilter("all")}
          className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${
            coverageFilter === "all"
              ? "border-blue-300 bg-gradient-to-br from-blue-100/70 via-white to-white ring-2 ring-blue-500/20"
              : "border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600/80">
              Todos los médicos
            </span>
            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 transition-transform group-hover:scale-110">
              <Users size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {doctors.length}
          </p>
          <p className="mt-2 text-xs font-medium text-blue-700/80">
            Base médica general registrada
          </p>
        </div>

        <div
          onClick={() => setCoverageFilter("covered")}
          className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${
            coverageFilter === "covered"
              ? "border-emerald-300 bg-gradient-to-br from-emerald-100/70 via-white to-white ring-2 ring-emerald-500/20"
              : "border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600/80">
              Cubiertos
            </span>
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 transition-transform group-hover:scale-110">
              <UserCheck size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {doctors.filter((d) => d.covered).length}
          </p>
          <p className="mt-2 text-xs font-medium text-emerald-700/80">
            Visita presencial o recurrente
          </p>
        </div>

        <div
          onClick={() => setCoverageFilter("uncovered")}
          className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer ${
            coverageFilter === "uncovered"
              ? "border-amber-300 bg-gradient-to-br from-amber-100/70 via-white to-white ring-2 ring-amber-500/20"
              : "border-amber-100 bg-gradient-to-br from-amber-50/60 via-white to-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600/80">
              No alcanzados
            </span>
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 transition-transform group-hover:scale-110">
              <UserX size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {doctors.filter((d) => !d.covered).length}
          </p>
          <p className="mt-2 text-xs font-medium text-amber-700/80">
            Objetivo de expansión omnicanal
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 via-white to-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600/80">
              Personal Farmacia
            </span>
            <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-600">
              <Store size={20} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {pharmacyStaff.length}
          </p>
          <p className="mt-2 text-xs font-medium text-violet-700/80">
            Dependientes en capacitación
          </p>
        </div>
      </div>

      {/* 2. VISITADORES REALES (ESTÁTICOS SIN HOVER) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Visitadores Médicos Reales (Fuerza de Ventas)
          </p>
          <span className="text-xs text-ink-500 font-medium">
            Soporte complementario con VM Digital
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {realReps.map((r, index) => {
            const cardStyle = cardGradients[index % cardGradients.length];
            const assignedCount = doctors.filter(
              (d) => d.realRepId === r.id,
            ).length;

            return (
              <Card
                key={r.id}
                className={`relative overflow-hidden border bg-gradient-to-br ${cardStyle} p-5 shadow-sm`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-extrabold text-ink-900 tracking-tight">
                      {r.name}
                    </p>
                    <p className="text-xs font-semibold text-ink-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-brand-600" />
                      {r.territory}
                    </p>
                  </div>
                  <Badge tone="brand">
                    {assignedCount} médico{assignedCount !== 1 ? "s" : ""}
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {r.specialtyFocus.map((s) => (
                    <Badge key={s} tone="neutral">
                      {s}
                    </Badge>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 3. BASE MÉDICA CON BURBUJAS QUE NO SE CORTAN EN LOS BORDES */}
      <Card className="border-ink-200/60 relative overflow-visible">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-100 bg-gradient-to-r from-ink-50/60 to-white px-6 py-4 rounded-t-2xl">
          <div>
            <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wide">
              Base médica segmentada
            </h3>
            <p className="text-xs text-ink-500 mt-0.5">
              Haz clic en la flecha para ver la ficha completa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <Input
                placeholder="Buscar por nombre, zona o esp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
            {coverageFilter !== "all" && (
              <button
                onClick={() => setCoverageFilter("all")}
                className="text-xs font-semibold text-brand-700 hover:underline px-2 py-1"
              >
                Limpiar filtro
              </button>
            )}
          </div>
        </div>

        <div className="overflow-visible">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-ink-500 border-b border-ink-100">
              <tr>
                <th className="px-6 py-3">Médico</th>
                <th className="px-4 py-3">Especialidad</th>
                <th className="px-4 py-3">Zona</th>
                <th className="px-4 py-3">Cobertura</th>
                <th className="px-4 py-3">Visitador Real</th>
                <th className="px-4 py-3">Etiquetas / Tags</th>
                <th className="px-4 py-3 text-right">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-ink-500"
                  >
                    No se encontraron médicos con los criterios especificados.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((d, index) => {
                  const rep = realReps.find((r) => r.id === d.realRepId);
                  const isPopOpen = activeDoctorId === d.id;
                  const isFirst = index === 0;
                  const isLast = index === filteredDoctors.length - 1;

                  let popoverPositionClass = "top-1/2 -translate-y-1/2";
                  if (isFirst) popoverPositionClass = "top-0";
                  if (isLast) popoverPositionClass = "bottom-0";

                  return (
                    <tr
                      key={d.id}
                      className="hover:bg-slate-50/80 transition-colors duration-150"
                    >
                      <td className="px-6 py-3.5">
                        <p className="font-bold text-ink-900">
                          {d.title} {d.name}
                        </p>
                        <p className="text-xs text-ink-400">
                          {d.email ?? d.phone ?? "Sin contacto directo"}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-ink-700 font-medium">
                        {d.specialty}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-ink-600">
                        {d.zone}
                      </td>
                      <td className="px-4 py-3.5">
                        {d.covered ? (
                          <Badge tone="success">Cubierto</Badge>
                        ) : (
                          <Badge tone="warn">No alcanzado</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-ink-700">
                        {rep?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {d.tags.map((t) => (
                            <Badge key={t} tone="neutral">
                              #{t}
                            </Badge>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right relative">
                        <button
                          onClick={() =>
                            setActiveDoctorId(isPopOpen ? null : d.id)
                          }
                          className="p-1.5 rounded-lg hover:bg-slate-200 text-ink-500 hover:text-brand-600 transition-colors relative"
                          title="Ver ficha"
                        >
                          <ChevronRight size={18} />
                        </button>

                        {isPopOpen && (
                          <div
                            className={`absolute right-2 z-50 w-72 rounded-2xl border border-brand-200 bg-white p-4 shadow-2xl text-left animate-fade-up ${popoverPositionClass}`}
                          >
                            <div className="flex items-start justify-between gap-2 border-b border-ink-100 pb-2 mb-2">
                              <div>
                                <p className="font-bold text-xs text-ink-900">
                                  {d.title} {d.name}
                                </p>
                                <p className="text-[10px] text-brand-700 font-semibold">
                                  {d.specialty} · {d.zone}
                                </p>
                              </div>
                              <button
                                onClick={() => setActiveDoctorId(null)}
                                className="text-ink-400 hover:text-ink-700 p-0.5"
                              >
                                <X size={14} />
                              </button>
                            </div>

                            <div className="space-y-2 text-[11px] text-ink-700">
                              <div className="flex items-center gap-1.5">
                                <Stethoscope
                                  size={13}
                                  className="text-brand-600"
                                />
                                <span>
                                  Estado:{" "}
                                  <strong className="text-ink-900">
                                    {d.covered ? "Cubierto" : "No alcanzado"}
                                  </strong>
                                </span>
                              </div>

                              {d.email && (
                                <div className="flex items-center gap-1.5">
                                  <Mail size={13} className="text-ink-400" />
                                  <span className="truncate">{d.email}</span>
                                </div>
                              )}

                              {d.phone && (
                                <div className="flex items-center gap-1.5">
                                  <Phone size={13} className="text-ink-400" />
                                  <span>{d.phone}</span>
                                </div>
                              )}

                              {rep && (
                                <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                                  <Briefcase
                                    size={13}
                                    className="text-brand-600"
                                  />
                                  <span>
                                    Visitador: <strong>{rep.name}</strong>
                                  </span>
                                </div>
                              )}

                              {d.lastVisitSummary && (
                                <p className="mt-2 text-[10px] text-ink-600 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                                  "{d.lastVisitSummary}"
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. RED DE FARMACIA */}
      <Card className="border-ink-200/60 relative overflow-visible">
        <div className="border-b border-ink-100 bg-gradient-to-r from-ink-50/60 to-white px-6 py-4 rounded-t-2xl">
          <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wide">
            Red de Personal de Farmacia
          </h3>
          <p className="text-xs text-ink-500 mt-0.5">
            Haz clic en la flecha para ver el resumen de capacitación.
          </p>
        </div>

        <div className="divide-y divide-ink-100 overflow-visible">
          {pharmacyStaff.map((p, index) => {
            const isPopOpen = activePharmacyId === p.id;
            const isFirst = index === 0;
            const isLast = index === pharmacyStaff.length - 1;

            let popoverPositionClass = "top-1/2 -translate-y-1/2";
            if (isFirst) popoverPositionClass = "top-0";
            if (isLast) popoverPositionClass = "bottom-0";

            return (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-slate-50/80 transition-colors relative"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                    <Store size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-ink-900">{p.name}</p>
                    <p className="text-xs text-ink-500">
                      {p.pharmacy} · {p.city} ·{" "}
                      <span className="italic">{p.role}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 relative">
                  <Badge tone="brand">Entrenamiento activo</Badge>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActivePharmacyId(isPopOpen ? null : p.id)
                      }
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-ink-500 hover:text-violet-600 transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>

                    {isPopOpen && (
                      <div
                        className={`absolute right-0 z-50 w-64 rounded-2xl border border-violet-200 bg-white p-4 shadow-2xl text-left animate-fade-up ${popoverPositionClass}`}
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                          <p className="font-bold text-xs text-ink-900">
                            {p.pharmacy}
                          </p>
                          <button
                            onClick={() => setActivePharmacyId(null)}
                            className="text-ink-400 hover:text-ink-700"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="space-y-2 text-[11px] text-ink-700">
                          <div className="flex items-center gap-1.5">
                            <Building2 size={13} className="text-violet-600" />
                            <span>{p.city}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BookOpen size={13} className="text-violet-600" />
                            <span>Módulo: Posología & Recomendación</span>
                          </div>
                          <div className="mt-2 bg-violet-50 p-2 rounded-lg border border-violet-100 text-[10px] text-violet-800 font-semibold">
                            ✓ Estado: Avance 85% completado
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 5. CRITERIOS DE SEGMENTACIÓN (TARJETAS CON BURBUJAS JUSTO DEBAJO) */}
      <Card className="p-6 border-ink-200/60 bg-gradient-to-br from-slate-50/60 via-white to-brand-50/20 relative overflow-visible">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-ink-900">
            <Target size={18} className="text-brand-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-700">
              Criterios de segmentación activos en campañas
            </h3>
          </div>
          <span className="text-[11px] text-ink-400 italic">
            Selecciona para ver apertura
          </span>
        </div>

        {/* Usamos un grid con espaciado vertical suficiente para que las burbujas quepan cómodamente */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 relative overflow-visible">
          {campaigns.map((c) => {
            const isSelected = selectedCampaignId === c.id;

            return (
              <div key={c.id} className="relative overflow-visible">
                {/* TARJETA */}
                <div
                  onClick={() =>
                    setSelectedCampaignId(isSelected ? null : c.id)
                  }
                  className={`rounded-xl border p-3.5 shadow-sm transition-all duration-200 cursor-pointer bg-white relative z-10 ${
                    isSelected
                      ? "border-brand-500 ring-2 ring-brand-500/20 shadow-md"
                      : "border-ink-200/80 hover:border-brand-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-ink-900">{c.name}</p>
                    <Info
                      size={14}
                      className={isSelected ? "text-brand-600" : "text-ink-300"}
                    />
                  </div>
                  <p className="text-[11px] text-brand-700 capitalize mt-0.5">
                    {c.audience.replaceAll("_", " ")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.filters.specialties?.map((s) => (
                      <Badge key={s} tone="neutral">
                        {s}
                      </Badge>
                    ))}
                    {c.filters.tags?.map((t) => (
                      <Badge key={t} tone="warn">
                        #{t}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* BURBUJA FLOTANTE JUSTO DEBAJO Y EXACTAMENTE DEL MISMO TAMAÑO (CON Z-INDEX ALTO PARA SUPERPONERSE A FILAS INFERIORES) */}
                {isSelected && (
                  <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 rounded-xl border border-brand-300 bg-white p-3.5 shadow-xl animate-fade-up">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <p className="font-bold text-[11px] text-brand-900 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
                          Apertura configurada:
                        </p>
                        <p className="text-[11px] text-ink-700 italic bg-brand-50/50 p-2 rounded-lg border border-brand-100 leading-snug">
                          "{c.script.opening}"
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCampaignId(null);
                        }}
                        className="rounded-lg p-0.5 text-ink-400 hover:text-ink-700 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
