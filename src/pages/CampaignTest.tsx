import { useEffect, useState } from "react";
import { ChatPanel } from "../components/ChatPanel";
import {
  Badge,
  Button,
  Card,
  PageHeader,
  Select,
  Modal,
} from "../components/ui";
import { useAppStore } from "../store/useAppStore";
import {
  Play,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  FileCheck,
  ShieldCheck,
  Users,
} from "lucide-react";

export function CampaignTest() {
  const store = useAppStore();
  const [campaignId, setCampaignId] = useState(store.campaigns[0]?.id ?? "");
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

  const campaign = store.campaigns.find(
    (c) => c.id === (store.testSession?.campaignId ?? campaignId),
  );
  const avatar =
    store.avatars.find(
      (a) => a.id === (store.testSession?.avatarId ?? campaign?.avatarId),
    ) ?? store.avatars[0];

  // Contar campañas en prueba y aprobadas
  const testingCampaigns = store.campaigns.filter(
    (c) => c.status === "testing",
  ).length;
  const approvedCampaigns = store.campaigns.filter(
    (c) => c.status === "approved" || c.status === "live",
  ).length;
  const draftCampaigns = store.campaigns.filter(
    (c) => c.status === "draft",
  ).length;

  // Paleta de degradados para tarjetas
  const cardGradients = [
    "from-sky-50/60 via-white to-white border-sky-200/80",
    "from-emerald-50/60 via-white to-white border-emerald-200/80",
    "from-amber-50/60 via-white to-white border-amber-200/80",
  ];

  function handleStartTest() {
    if (campaignId) {
      store.startTestSession(campaignId);
    }
  }

  function handleApprove() {
    if (campaignId) {
      store.setCampaignStatus(campaignId, "approved");
      setShowApproveConfirm(false);
    }
  }

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Prueba de campaña"
        subtitle="Antes del go final, el operador valida mensaje, estrategia, objeciones y respuestas dentro de gobernanza."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              className="w-56"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
            >
              {store.campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.status})
                </option>
              ))}
            </Select>
            <Button
              onClick={handleStartTest}
              className="shadow-md shadow-brand-700/20"
            >
              <Play size={16} />
              Iniciar / reiniciar test
            </Button>
            {store.testSession && (
              <Button
                variant="outline"
                onClick={() => setShowApproveConfirm(true)}
                className="border-emerald-500 text-emerald-700 hover:bg-emerald-50"
              >
                <CheckCircle2 size={16} />
                Aprobar go final
              </Button>
            )}
          </div>
        }
      />

      {/* Badges de estado rápido */}
      <div className="flex flex-wrap gap-2">
        <Badge tone="warn">🧪 Sandbox operador</Badge>
        <Badge tone="brand">💰 Sin costo de créditos</Badge>
        {campaign && (
          <Badge
            tone={
              campaign.status === "approved"
                ? "success"
                : campaign.status === "testing"
                  ? "warn"
                  : "neutral"
            }
          >
            Estado: {campaign.status}
          </Badge>
        )}
      </div>

      {/* Métricas rápidas (estilo Dashboard) */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600/80">
              En prueba
            </span>
            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 transition-transform group-hover:scale-110">
              <Users size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {testingCampaigns}
          </p>
          <p className="mt-2 text-xs font-medium text-blue-700/80">
            Campañas en validación
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600/80">
              Aprobadas
            </span>
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 transition-transform group-hover:scale-110">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {approvedCampaigns}
          </p>
          <p className="mt-2 text-xs font-medium text-emerald-700/80">
            Go final concedido
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600/80">
              Borradores
            </span>
            <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 transition-transform group-hover:scale-110">
              <FileCheck size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {draftCampaigns}
          </p>
          <p className="mt-2 text-xs font-medium text-amber-700/80">
            Pendientes de prueba
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 via-white to-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600/80">
              Mensajes test
            </span>
            <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-600 transition-transform group-hover:scale-110">
              <MessageSquare size={18} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            {store.testSession ? store.testSession.messages.length : 0}
          </p>
          <p className="mt-2 text-xs font-medium text-violet-700/80">
            {store.testSession ? "Sesión activa" : "Sin sesión"}
          </p>
        </div>
      </div>

      {/* Cuerpo principal: Chat + Panel lateral */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {store.testSession && campaign ? (
          <ChatPanel
            avatar={avatar}
            campaign={campaign}
            messages={store.testSession.messages}
            onSend={store.sendTestMessage}
            onCta={store.clickCta}
            title="Simulación médico / dependiente"
            subtitle="Valide sondeo, evidencia y escalamientos"
          />
        ) : (
          <Card className="flex min-h-[480px] flex-col items-center justify-center p-8 text-center border-ink-200/60 bg-gradient-to-br from-slate-50/40 via-white to-white">
            <div className="rounded-full bg-brand-100 p-4 text-brand-700">
              <Sparkles size={40} />
            </div>
            <p className="mt-6 text-xl font-bold text-ink-900">
              Listo para probar
            </p>
            <p className="mt-2 max-w-md text-sm text-ink-500">
              Selecciona una campaña y haz clic en{" "}
              <strong>"Iniciar / reiniciar test"</strong> para comenzar la
              simulación.
            </p>
            <Button
              onClick={handleStartTest}
              className="mt-6 shadow-md shadow-brand-700/20"
            >
              <Play size={16} />
              Iniciar test
            </Button>
          </Card>
        )}

        <div className="space-y-4">
          {/* Tarjeta de campaña seleccionada (AHORA PRIMERO) */}
          {campaign && (
            <Card
              className={`p-5 border-ink-200/60 bg-gradient-to-br ${cardGradients[2]} shadow-sm`}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                Campaña seleccionada
              </p>
              <p className="mt-1 font-bold text-ink-900">{campaign.name}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                <Badge
                  tone={
                    campaign.status === "approved"
                      ? "success"
                      : campaign.status === "testing"
                        ? "warn"
                        : "neutral"
                  }
                >
                  {campaign.status}
                </Badge>
                <Badge tone="brand">{campaign.cycle}</Badge>
                <Badge>{campaign.audience}</Badge>
              </div>
              <div className="mt-3 text-xs text-ink-500">
                <p>
                  Avatar: {avatar.name} · {avatar.accent}
                </p>
                <p>
                  Producto:{" "}
                  {store.products.find((p) => p.id === campaign.productIds[0])
                    ?.name ?? "N/A"}
                </p>
              </div>
            </Card>
          )}

          {/* Checklist de QA (ahora segundo) */}
          <Card
            className={`p-5 border-ink-200/60 bg-gradient-to-br ${cardGradients[0]} shadow-sm`}
          >
            <p className="text-sm font-bold text-ink-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-brand-600" />
              Checklist de QA
            </p>
            <ul className="mt-3 space-y-2 text-xs text-ink-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Apertura
                cortés + tip contextual
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Mención de
                apoyo al VM real (si cubierto)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Mensajes =
                script de campaña
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Evidencia
                solo de docs internos
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Pregunta
                de sondeo
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span> CTA
                visible
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span> Fuera de
                corpus → escalamiento sin alucinar
              </li>
            </ul>
          </Card>

          {/* Prompts sugeridos (tercero) */}
          <Card
            className={`p-5 border-ink-200/60 bg-gradient-to-br ${cardGradients[1]} shadow-sm`}
          >
            <p className="text-sm font-bold text-ink-900 flex items-center gap-2">
              <Sparkles size={18} className="text-brand-600" />
              Prompts sugeridos
            </p>
            <div className="mt-3 space-y-2 text-xs text-ink-600">
              <div className="rounded-xl bg-white/80 p-2.5 border border-ink-100/80 hover:border-brand-300 transition-colors cursor-pointer">
                “Cuénteme del estudio clínico”
              </div>
              <div className="rounded-xl bg-white/80 p-2.5 border border-ink-100/80 hover:border-brand-300 transition-colors cursor-pointer">
                “¿Recuerda lo que hablamos la vez pasada?”
              </div>
              <div className="rounded-xl bg-white/80 p-2.5 border border-ink-100/80 hover:border-brand-300 transition-colors cursor-pointer">
                “Compáralo con la competencia en internet”
              </div>
              <div className="rounded-xl bg-white/80 p-2.5 border border-ink-100/80 hover:border-brand-300 transition-colors cursor-pointer">
                “Quiero una muestra médica”
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de confirmación para aprobar */}
      <Modal
        isOpen={showApproveConfirm}
        onClose={() => setShowApproveConfirm(false)}
        title="Aprobar campaña (go final)"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowApproveConfirm(false)}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleApprove}>
              <CheckCircle2 size={16} />
              Sí, aprobar
            </Button>
          </div>
        }
      >
        <p className="text-sm text-ink-600">
          ¿Estás seguro de que deseas aprobar la campaña{" "}
          <strong>{campaign?.name}</strong>? Esto la marcará como{" "}
          <strong>aprobada</strong> y podrá ser enviada a producción.
        </p>
        <p className="mt-2 text-xs text-ink-500">
          Una vez aprobada, podrás enviarla a los destinatarios desde la página
          de <strong>Campañas</strong>.
        </p>
      </Modal>
    </div>
  );
}
