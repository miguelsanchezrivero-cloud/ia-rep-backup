import { useMemo, useState } from "react";
import { ChatPanel } from "../components/ChatPanel";
import { AvatarFace } from "../components/AvatarFace";
import {
  Badge,
  Button,
  Card,
  Label,
  PageHeader,
  Select,
  Modal,
} from "../components/ui";
import { useAppStore } from "../store/useAppStore";
import type { Channel } from "../types";
import {
  User,
  Users,
  MessageSquare,
  Sparkles,
  Play,
  X,
  Target,
  MapPin,
  Briefcase,
  Award,
  Settings,
} from "lucide-react";

export function Visit() {
  const store = useAppStore();

  // Estado para el modal de configuración
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Estado de configuración
  const liveCampaigns = store.campaigns.filter((c) =>
    ["approved", "live", "testing"].includes(c.status),
  );
  const [campaignId, setCampaignId] = useState(
    liveCampaigns[0]?.id ?? store.campaigns[0]?.id,
  );
  const [doctorId, setDoctorId] = useState(store.doctors[0]?.id);
  const [pharmacyId, setPharmacyId] = useState(store.pharmacyStaff[0]?.id);
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [mode, setMode] = useState<"doctor" | "pharmacy">("doctor");
  // Nuevo estado para el avatar seleccionado
  const [selectedAvatarId, setSelectedAvatarId] = useState(
    store.avatars[0]?.id,
  );

  // Estado para modal de confirmación de cierre
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  // Datos derivados para mostrar en las tarjetas
  const campaign =
    store.campaigns.find((c) => c.id === campaignId) ?? store.campaigns[0];
  const avatar =
    store.avatars.find(
      (a) => a.id === (store.activeVisit?.avatarId ?? selectedAvatarId),
    ) ?? store.avatars[0];
  const doctor = store.doctors.find(
    (d) => d.id === (store.activeVisit?.targetId ?? doctorId),
  );
  const pharmacy = store.pharmacyStaff.find(
    (p) => p.id === (store.activeVisit?.targetId ?? pharmacyId),
  );
  const realRep = doctor
    ? store.realReps.find((r) => r.id === doctor.realRepId)
    : null;

  const title = useMemo(() => {
    if (store.activeVisit?.targetType === "pharmacy_staff") {
      return `${pharmacy?.name ?? ""} · ${pharmacy?.pharmacy ?? ""}`;
    }
    return doctor
      ? `${doctor.title} ${doctor.name} · ${doctor.specialty}`
      : "Visita";
  }, [store.activeVisit, doctor, pharmacy]);

  // Función para iniciar la visita (se llama desde el modal)
  function start() {
    if (!campaign) return;
    // Pasamos el avatar seleccionado al store
    if (mode === "pharmacy" || campaign.audience === "pharmacy_staff") {
      store.startPharmacyVisit(campaign.id, pharmacyId, selectedAvatarId);
    } else {
      store.startDoctorVisit(campaign.id, doctorId, channel, selectedAvatarId);
    }
    setIsConfigModalOpen(false);
  }

  function endVisit() {
    store.endVisit();
    setShowEndConfirm(false);
  }

  // Métricas rápidas
  const totalDoctors = store.doctors.length;
  const totalPharmacies = store.pharmacyStaff.length;
  const activeCampaigns = store.campaigns.filter(
    (c) => c.status === "live" || c.status === "approved",
  ).length;

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Visita del VM virtual"
        subtitle="Simula el link que llega por WhatsApp, email o SMS. Configura la visita desde el botón."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {store.activeVisit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEndConfirm(true)}
                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              >
                <X size={14} />
                Cerrar visita
              </Button>
            )}
            <Button
              onClick={() => setIsConfigModalOpen(true)}
              className="shadow-md shadow-brand-700/20"
            >
              <Settings size={16} />
              Configurar visita
            </Button>
          </div>
        }
      />

      {/* Métricas rápidas */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600/80">
              Campañas activas
            </span>
            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 transition-transform group-hover:scale-110">
              <Target size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {activeCampaigns}
          </p>
          <p className="mt-2 text-xs font-medium text-blue-700/80">
            {store.campaigns.length} totales
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600/80">
              Médicos disponibles
            </span>
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 transition-transform group-hover:scale-110">
              <User size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {totalDoctors}
          </p>
          <p className="mt-2 text-xs font-medium text-emerald-700/80">
            {store.doctors.filter((d) => d.covered).length} cubiertos
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600/80">
              Farmacias
            </span>
            <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-600 transition-transform group-hover:scale-110">
              <Users size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {totalPharmacies}
          </p>
          <p className="mt-2 text-xs font-medium text-violet-700/80">
            Dependientes registrados
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600/80">
              Visita actual
            </span>
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 transition-transform group-hover:scale-110">
              <MessageSquare size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {store.activeVisit ? store.activeVisit.messages.length : 0}
          </p>
          <p className="mt-2 text-xs font-medium text-amber-700/80">
            {store.activeVisit ? "Sesión activa" : "Sin sesión"}
          </p>
        </div>
      </div>

      {/* Tarjetas de información (Avatar, Target, Tips) - ahora en grid horizontal */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Tarjeta del avatar */}
        <Card className="overflow-hidden border-ink-200/60 bg-gradient-to-br from-sky-50/40 via-white to-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <AvatarFace avatar={avatar} size="lg" />
            <div>
              <p className="font-bold text-ink-900">{avatar.name}</p>
              <p className="text-xs text-ink-500">
                {avatar.region} · acento {avatar.accent}
              </p>
              <p className="text-xs text-ink-400">{avatar.attire}</p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge tone="brand">{avatar.gender}</Badge>
            <Badge tone="neutral">piel {avatar.skinTone}</Badge>
            <Badge tone="neutral">{avatar.personality}</Badge>
          </div>
        </Card>

        {/* Tarjeta del target (médico o farmacia) */}
        {doctor && mode === "doctor" ? (
          <Card className="overflow-hidden border-ink-200/60 bg-gradient-to-br from-emerald-50/40 via-white to-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-ink-900">
                  {doctor.title} {doctor.name}
                </p>
                <p className="text-xs text-ink-500 flex items-center gap-1">
                  <MapPin size={12} className="text-brand-600" />
                  {doctor.zone} · {doctor.specialty}
                </p>
              </div>
              <Badge tone={doctor.covered ? "success" : "warn"}>
                {doctor.covered ? "Cubierto" : "No alcanzado"}
              </Badge>
            </div>
            {realRep && (
              <div className="mt-2 flex items-center gap-2 text-xs text-ink-600 bg-white/60 rounded-lg p-2 border border-ink-100">
                <Briefcase size={14} className="text-brand-600" />
                <span>
                  Apoya a <strong>{realRep.name}</strong>
                  <Badge tone="brand">no reemplazo</Badge>
                </span>
              </div>
            )}
            {doctor.lastVisitSummary && (
              <div className="mt-2 text-xs text-ink-600 bg-white/60 rounded-lg p-2 border border-ink-100">
                <p className="font-semibold">Memoria:</p>
                <p className="italic">"{doctor.lastVisitSummary}"</p>
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-1">
              {doctor.tags.map((tag) => (
                <Badge key={tag} tone="neutral">
                  #{tag}
                </Badge>
              ))}
            </div>
          </Card>
        ) : pharmacy && mode === "pharmacy" ? (
          <Card className="overflow-hidden border-ink-200/60 bg-gradient-to-br from-violet-50/40 via-white to-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-ink-900">{pharmacy.name}</p>
                <p className="text-xs text-ink-500 flex items-center gap-1">
                  <MapPin size={12} className="text-brand-600" />
                  {pharmacy.pharmacy} · {pharmacy.city}
                </p>
              </div>
              <Badge tone="brand">{pharmacy.role}</Badge>
            </div>
            <div className="mt-2 text-xs text-ink-600 bg-white/60 rounded-lg p-2 border border-ink-100">
              <p className="font-semibold">Capacitación:</p>
              <p>Módulo: Posología & Recomendación</p>
              <div className="mt-1 flex items-center gap-1">
                <Award size={14} className="text-amber-500" />
                <span>Avance 85% completado</span>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex items-center justify-center border-ink-200/60 bg-slate-50/40 p-4 text-sm text-ink-400">
            <span>Selecciona un target en la configuración</span>
          </Card>
        )}

        {/* Tarjeta de tips */}
        <Card className="p-4 text-xs leading-relaxed text-ink-500 border-ink-200/60 bg-gradient-to-br from-amber-50/20 to-white">
          <p className="font-semibold text-ink-700 flex items-center gap-1">
            <Sparkles size={14} className="text-brand-600" />
            ¿Cómo probar?
          </p>
          <p className="mt-1">
            Prueba preguntas dentro de campaña (
            <span className="font-medium">“¿qué dice el estudio?”</span>) y
            fuera de límites (
            <span className="font-medium">“compáralo con la competencia”</span>)
            para ver el escalamiento anti‑alucinación.
          </p>
        </Card>
      </div>

      {/* ChatPanel - ocupa todo el ancho */}
      <div>
        {store.activeVisit && campaign ? (
          <ChatPanel
            avatar={avatar}
            campaign={campaign}
            messages={store.activeVisit.messages}
            onSend={store.sendVisitMessage}
            onCta={store.clickCta}
            title={title}
            subtitle={campaign.name}
          />
        ) : (
          <Card className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center border-ink-200/60 bg-gradient-to-br from-slate-50/40 via-white to-white">
            <AvatarFace avatar={avatar} size="xl" />
            <p className="mt-6 font-display text-3xl text-ink-900">
              Su visitador médico virtual
            </p>
            <p className="mt-2 max-w-md text-sm text-ink-500">
              Configure la visita con el botón{" "}
              <strong>“Configurar visita”</strong> y luego inicie la
              conversación.
            </p>
            <Button
              onClick={() => setIsConfigModalOpen(true)}
              className="mt-6 shadow-md shadow-brand-700/20"
            >
              <Settings size={16} />
              Configurar visita
            </Button>
          </Card>
        )}
      </div>

      {/* MODAL DE CONFIGURACIÓN */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        title="Configurar visita"
        className="max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="space-y-4 pt-2">
          <div>
            <Label>Modo</Label>
            <Select
              value={mode}
              onChange={(e) => setMode(e.target.value as "doctor" | "pharmacy")}
              className="w-full"
            >
              <option value="doctor">👨‍⚕️ Médico</option>
              <option value="pharmacy">💊 Dependiente farmacia</option>
            </Select>
          </div>

          <div>
            <Label>Campaña</Label>
            <Select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full"
            >
              {store.campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.status})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Avatar</Label>
            <Select
              value={selectedAvatarId}
              onChange={(e) => setSelectedAvatarId(e.target.value)}
              className="w-full"
            >
              {store.avatars.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} · {a.accent} ({a.region})
                </option>
              ))}
            </Select>
          </div>

          {mode === "doctor" ? (
            <div>
              <Label>Médico</Label>
              <Select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full"
              >
                {store.doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} {d.name} (
                    {d.covered ? "✅ cubierto" : "🔄 no cubierto"})
                  </option>
                ))}
              </Select>
            </div>
          ) : (
            <div>
              <Label>Dependiente</Label>
              <Select
                value={pharmacyId}
                onChange={(e) => setPharmacyId(e.target.value)}
                className="w-full"
              >
                {store.pharmacyStaff.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.pharmacy}
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div>
            <Label>Canal</Label>
            <Select
              value={channel}
              onChange={(e) => setChannel(e.target.value as Channel)}
              className="w-full"
            >
              <option value="whatsapp">📱 WhatsApp</option>
              <option value="email">📧 Email</option>
              <option value="sms">📲 SMS</option>
            </Select>
          </div>

          <div className="pt-4 flex items-center gap-2 justify-end border-t border-ink-100">
            <Button
              variant="outline"
              onClick={() => setIsConfigModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={start} className="shadow-sm">
              <Play size={16} />
              Iniciar visita
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL DE CONFIRMACIÓN PARA CERRAR VISITA */}
      <Modal
        isOpen={showEndConfirm}
        onClose={() => setShowEndConfirm(false)}
        title="Cerrar visita"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowEndConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={endVisit}>
              Sí, cerrar visita
            </Button>
          </div>
        }
      >
        <p className="text-sm text-ink-600">
          ¿Estás seguro de que deseas finalizar la visita actual? Se perderá el
          historial de la conversación.
        </p>
      </Modal>
    </div>
  );
}
