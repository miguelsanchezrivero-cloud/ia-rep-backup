import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Send,
  Sparkles,
  Users,
  DollarSign,
  Play,
  FileText,
  Target,
  MessageSquare,
  Bookmark,
  CheckCircle2,
  Settings2,
  Trash2,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Input,
  Label,
  PageHeader,
  Select,
  Textarea,
  Modal,
  ConfirmDialog,
} from "../components/ui";
import { estimateAudienceSize } from "../lib/audience";
import { useAppStore } from "../store/useAppStore";
import type {
  Campaign,
  CampaignStatus,
  Channel,
  TargetAudience,
} from "../types";

const statusTone: Record<
  CampaignStatus,
  "neutral" | "brand" | "success" | "warn" | "danger"
> = {
  draft: "neutral",
  testing: "warn",
  approved: "brand",
  live: "success",
  paused: "warn",
  completed: "neutral",
};

// Plantillas / Drafts prediseñados de ejemplo
const DRAFT_TEMPLATES = [
  {
    title: "Lanzamiento CardioFlex",
    audience: "covered_doctors" as TargetAudience,
    cycle: "2026-Q3",
    opening:
      "Buenos días, {title} {lastName}. Soy {avatarName}, en apoyo a {realRepName}.",
    productPresentation:
      "Presentamos CardioFlex XR para el control de la hipertensión con toma única diaria.",
    probingQuestion:
      "¿Qué porcentaje de sus pacientes hipertensos no logran la meta con monoterapia?",
    closing: "Solicite una muestra médica para su próximo paciente candidato.",
  },
  {
    title: "Campaña Pediatría Respirax",
    audience: "uncovered_doctors" as TargetAudience,
    cycle: "2026-Q3",
    opening:
      "Estimado/a {title} {lastName}, un saludo de parte de {avatarName}.",
    productPresentation:
      "Respirax Kids ofrece alivio sintomático pediátrico de acción rápida con perfil de seguridad comprobado.",
    probingQuestion:
      "¿Con qué frecuencia recibe casos de tos persistente en temporada fría?",
    closing: "Haga clic abajo si desea recibir el dossier médico digital.",
  },
  {
    title: "Capacitación Farmacias",
    audience: "pharmacy_staff" as TargetAudience,
    cycle: "2026-Q3",
    opening:
      "Hola, {firstName}. Te escribe {avatarName} del equipo de capacitación médica.",
    productPresentation:
      "Queremos recordarte la posología recomendada de la línea GastroPro.",
    probingQuestion:
      "¿Tus clientes te preguntan seguido por la toma en ayunas?",
    closing:
      "Completa el test rápido para recibir tu certificado de entrenamiento.",
  },
];

const cardGradients = [
  "from-teal-50/60 via-white to-white border-teal-200/80 hover:border-teal-300",
  "from-sky-50/60 via-white to-white border-sky-200/80 hover:border-sky-300",
  "from-indigo-50/60 via-white to-white border-indigo-200/80 hover:border-indigo-300",
  "from-rose-50/60 via-white to-white border-rose-200/80 hover:border-rose-300",
  "from-amber-50/60 via-white to-white border-amber-200/80 hover:border-amber-300",
];

const initialFormState = (
  productId: string,
  avatarId: string,
): Partial<Campaign> => ({
  name: "",
  productIds: [productId],
  avatarId: avatarId,
  audience: "covered_doctors",
  status: "draft",
  cycle: "2026-Q3",
  multiProduct: false,
  channels: ["whatsapp"],
  filters: { coveredOnly: true },
  script: {
    opening:
      "Buenos días, {title} {lastName}. Soy {avatarName}, en apoyo a {realRepName}.",
    productPresentation:
      "Le presento el mensaje aprobado del producto en este ciclo.",
    clinicalEvidence:
      "La evidencia clínica aprobada se comparte solo desde documentación interna.",
    expectedResults:
      "Buscamos reforzar el mensaje de campaña de forma precisa.",
    probingQuestion: "¿Se le viene a la mente algún paciente candidato?",
    closing: "Puede usar el CTA inferior si desea muestra o material.",
    supportRepMention: true,
  },
  ctas: [{ type: "sample_request", label: "Solicitar muestra", productId }],
});

export function Campaigns() {
  const store = useAppStore();

  // Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCampaignModal, setSelectedCampaignModal] =
    useState<Campaign | null>(null);

  // Mensaje de despacho o acción
  const [msg, setMsg] = useState("");
  const [dispatchChannel, setDispatchChannel] = useState<Channel>("whatsapp");

  // Estado del formulario de creación
  const [formData, setFormData] = useState<Partial<Campaign>>(() =>
    initialFormState(store.products[0]?.id || "", store.avatars[0]?.id || ""),
  );

  // Confirmaciones de diálogo
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<CampaignStatus | null>(
    null,
  );

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Audiencia estimada para la campaña seleccionada en el modal
  const audienceCount = useMemo(() => {
    if (!selectedCampaignModal) return 0;
    return estimateAudienceSize(
      selectedCampaignModal,
      store.doctors,
      store.pharmacyStaff,
    );
  }, [selectedCampaignModal, store.doctors, store.pharmacyStaff]);

  // Abrir modal de creación reseteando formulario
  function handleOpenCreate() {
    setFormData(
      initialFormState(store.products[0]?.id || "", store.avatars[0]?.id || ""),
    );
    setIsCreateModalOpen(true);
  }

  // Aplicar un borrador de ejemplo al formulario
  function applyDraft(draft: (typeof DRAFT_TEMPLATES)[0]) {
    setFormData((prev) => ({
      ...prev,
      name: draft.title,
      audience: draft.audience,
      cycle: draft.cycle,
      script: {
        opening: draft.opening,
        productPresentation: draft.productPresentation,
        clinicalEvidence:
          prev.script?.clinicalEvidence ||
          "Evidencia clínica aprobada por el departamento médico.",
        expectedResults:
          prev.script?.expectedResults ||
          "Mejoría en parámetros clínicos evaluados.",
        probingQuestion: draft.probingQuestion,
        closing: draft.closing,
        supportRepMention: true,
      },
    }));
  }

  // Guardar la nueva campaña
  function handleSaveCampaign() {
    if (!formData.name?.trim()) return;

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: formData.name || "Nueva Campaña",
      productIds: formData.productIds || [store.products[0]?.id || ""],
      avatarId: formData.avatarId || store.avatars[0]?.id || "",
      audience: formData.audience || "covered_doctors",
      status: formData.status || "draft",
      cycle: formData.cycle || "2026-Q3",
      multiProduct: formData.multiProduct || false,
      channels: formData.channels || ["whatsapp"],
      filters: formData.filters || { coveredOnly: true },
      script: formData.script || {
        opening: "",
        productPresentation: "",
        clinicalEvidence: "",
        expectedResults: "",
        probingQuestion: "",
        closing: "",
        supportRepMention: true,
      },
      ctas: formData.ctas || [
        {
          type: "sample_request",
          label: "Solicitar muestra",
          productId: store.products[0]?.id || "",
        },
      ],
      createdAt: new Date().toISOString().slice(0, 10),
    };

    store.upsertCampaign(newCampaign);
    setIsCreateModalOpen(false);
  }

  // Despachar campaña desde el modal
  function handleDispatch() {
    if (!selectedCampaignModal) return;
    const res = store.dispatchCampaign(
      selectedCampaignModal.id,
      dispatchChannel,
    );
    setMsg(res.message);
  }

  // Eliminar campaña
  function handleDeleteCampaign() {
    if (!selectedCampaignModal) return;
    store.deleteCampaign(selectedCampaignModal.id);
    setSelectedCampaignModal(null);
    setShowDeleteConfirm(false);
    setMsg("Campaña eliminada exitosamente.");
  }

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Campañas"
        subtitle="Script exacto del gerente de producto · prueba interna · go final · envío WhatsApp / email / SMS."
        actions={
          <Button
            onClick={handleOpenCreate}
            className="shadow-md shadow-brand-700/20"
          >
            <Plus size={18} />
            Crear campaña
          </Button>
        }
      />

      {/* Banner de mensajes de estado */}
      {msg && (
        <div className="flex items-center justify-between rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-900 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand-600" />
            <span>{msg}</span>
          </div>
          <button
            onClick={() => setMsg("")}
            className="text-xs font-bold text-brand-700 hover:underline"
          >
            Desestimar
          </button>
        </div>
      )}

      {/* GRILLA DE TARJETAS DE CAMPAÑA */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {store.campaigns.map((c, index) => {
          const cardStyle = cardGradients[index % cardGradients.length];
          const avatar = store.avatars.find((a) => a.id === c.avatarId);
          const product = store.products.find((p) => p.id === c.productIds[0]);

          return (
            <Card
              key={c.id}
              interactive
              onClick={() => setSelectedCampaignModal(c)}
              className={`relative overflow-hidden border bg-gradient-to-br ${cardStyle} p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Badge tone={statusTone[c.status]}>{c.status}</Badge>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-ink-400 bg-white/80 px-2 py-0.5 rounded-md border border-ink-100">
                    {c.cycle}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-lg font-extrabold text-ink-900 tracking-tight leading-snug">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-xs text-ink-500 flex items-center gap-1">
                    <Target size={13} className="text-brand-600 shrink-0" />
                    <span className="capitalize">
                      {c.audience.replaceAll("_", " ")}
                    </span>
                  </p>
                </div>

                <div className="mt-3 rounded-xl bg-white/70 p-2.5 border border-ink-100/80 space-y-1 text-xs">
                  <p className="flex justify-between text-ink-600">
                    <span>Producto:</span>
                    <strong className="text-ink-900">
                      {product?.name || "N/A"}
                    </strong>
                  </p>
                  <p className="flex justify-between text-ink-600">
                    <span>Avatar asignado:</span>
                    <strong className="text-brand-700">
                      {avatar?.name || "N/A"}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-ink-100/80 flex items-center justify-between text-xs font-bold text-brand-700">
                <span>Ver ficha & configuración</span>
                <span>→</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* MODAL 1: FICHA DINÁMICA DE DETALLES DE CAMPAÑA (ANCHO MUY GRANDE: max-w-5xl ~ 1024px) */}
      <Modal
        isOpen={selectedCampaignModal !== null}
        onClose={() => setSelectedCampaignModal(null)}
        title={selectedCampaignModal?.name || "Detalle de campaña"}
        className="!max-w-5xl max-h-[85vh] overflow-y-auto"
      >
        {selectedCampaignModal && (
          <div className="space-y-6 pt-1">
            {/* Indicadores en Top Header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-brand-50/60 p-3.5 border border-brand-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 flex items-center gap-1">
                    <Users size={12} /> Audiencia Est.
                  </span>
                  <p className="text-2xl font-black text-brand-900 mt-0.5">
                    {audienceCount}
                  </p>
                </div>
                <div className="p-2 bg-brand-100/60 rounded-lg text-brand-700">
                  <Users size={20} />
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50/60 p-3.5 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <DollarSign size={12} /> Costo Est.
                  </span>
                  <p className="text-2xl font-black text-emerald-900 mt-0.5">
                    ${(audienceCount * store.credits.costPerVisit).toFixed(2)}
                  </p>
                </div>
                <div className="p-2 bg-emerald-100/60 rounded-lg text-emerald-700">
                  <DollarSign size={20} />
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                    <Settings2 size={12} /> Estado Actual
                  </span>
                  <div className="mt-1">
                    <Badge tone={statusTone[selectedCampaignModal.status]}>
                      {selectedCampaignModal.status}
                    </Badge>
                  </div>
                </div>
                <div className="p-2 bg-slate-200/60 rounded-lg text-slate-700">
                  <Settings2 size={20} />
                </div>
              </div>
            </div>

            {/* CUERPO PRINCIPAL EN 2 COLUMNAS (LÓGICA + SCRIPT) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* COLUMNA IZQUIERDA: Ajustes, CRM y Despacho */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50/80 p-4 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Ajustes de Campaña
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Cambiar Estado</Label>
                      <Select
                        value={selectedCampaignModal.status}
                        onChange={(e) => {
                          setPendingStatus(e.target.value as CampaignStatus);
                          setShowStatusConfirm(true);
                        }}
                      >
                        {Object.keys(statusTone).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <Label>Audiencia Objetivo</Label>
                      <Select
                        value={selectedCampaignModal.audience}
                        onChange={(e) => {
                          const updated = {
                            ...selectedCampaignModal,
                            audience: e.target.value as TargetAudience,
                          };
                          store.upsertCampaign(updated);
                          setSelectedCampaignModal(updated);
                        }}
                      >
                        <option value="covered_doctors">
                          Médicos cubiertos
                        </option>
                        <option value="uncovered_doctors">
                          Médicos no alcanzados
                        </option>
                        <option value="pharmacy_staff">
                          Dependientes farmacia
                        </option>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Filtros CRM */}
                <div className="rounded-2xl border border-ink-100 p-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                    Filtros CRM Aplicados
                  </p>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {selectedCampaignModal.filters.specialties?.map((s) => (
                      <Badge key={s} tone="brand">
                        {s}
                      </Badge>
                    ))}
                    {selectedCampaignModal.filters.zones?.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                    {selectedCampaignModal.filters.tags?.map((s) => (
                      <Badge key={s} tone="warn">
                        #{s}
                      </Badge>
                    ))}
                    {selectedCampaignModal.filters.coveredOnly && (
                      <Badge tone="success">solo cubiertos</Badge>
                    )}
                    {selectedCampaignModal.filters.uncoveredOnly && (
                      <Badge tone="warn">solo no cubiertos</Badge>
                    )}
                    {selectedCampaignModal.multiProduct && (
                      <Badge>multiproducto</Badge>
                    )}
                  </div>
                </div>

                {/* Panel de Despacho & Acción */}
                <div className="rounded-2xl border border-brand-200/80 bg-gradient-to-br from-brand-50/50 to-white p-4 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-900">
                    Probar & Ejecutar
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Canal de Envío</Label>
                      <Select
                        value={dispatchChannel}
                        onChange={(e) =>
                          setDispatchChannel(e.target.value as Channel)
                        }
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                      </Select>
                    </div>
                    <div className="flex items-end gap-2">
                      <Link
                        to="/prueba"
                        onClick={() =>
                          store.startTestSession(selectedCampaignModal.id)
                        }
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full" size="md">
                          <Play size={14} /> Probar
                        </Button>
                      </Link>
                      <Button
                        onClick={handleDispatch}
                        className="w-full"
                        size="md"
                      >
                        <Send size={14} /> Enviar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA: Script Detallado */}
              <div className="rounded-2xl border border-ink-200/80 bg-white p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-800 border-b border-ink-100 pb-2">
                  <MessageSquare size={14} /> Script Aprobado (Gerente de
                  Producto)
                </div>
                <ScriptLine
                  k="Apertura"
                  v={selectedCampaignModal.script.opening}
                />
                <ScriptLine
                  k="Presentación Producto"
                  v={selectedCampaignModal.script.productPresentation}
                />
                <ScriptLine
                  k="Evidencia Clínica"
                  v={selectedCampaignModal.script.clinicalEvidence}
                />
                <ScriptLine
                  k="Pregunta de Sondeo"
                  v={selectedCampaignModal.script.probingQuestion}
                />
                <ScriptLine
                  k="Cierre"
                  v={selectedCampaignModal.script.closing}
                />
              </div>
            </div>

            {/* BOTÓN ELIMINAR CAMPAÑA */}
            <div className="pt-4 border-t border-ink-100 flex justify-between items-center">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 size={14} /> Eliminar campaña
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCampaignModal(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 2: FORMULARIO COMPLETO PARA CREAR CAMPAÑA (ANCHO MUY GRANDE: max-w-5xl ~ 1024px) */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nueva Campaña"
        className="!max-w-5xl max-h-[85vh] overflow-y-auto"
      >
        <div className="space-y-6 pt-2">
          {/* SECCIÓN DE PLANTILLAS / DRAFTS DE EJEMPLO */}
          <div className="rounded-2xl border border-brand-200/80 bg-brand-50/40 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-800 flex items-center gap-1.5 mb-2">
              <Bookmark size={14} /> Seleccionar plantilla / Draft de ejemplo
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {DRAFT_TEMPLATES.map((draft) => (
                <button
                  key={draft.title}
                  type="button"
                  onClick={() => applyDraft(draft)}
                  className="rounded-xl border border-brand-200 bg-white p-3 text-left text-xs transition-all hover:border-brand-500 hover:shadow-sm"
                >
                  <p className="font-bold text-ink-900 line-clamp-1">
                    {draft.title}
                  </p>
                  <p className="text-[10px] text-ink-500 capitalize mt-0.5">
                    {draft.audience.replaceAll("_", " ")}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* FORMULARIO EN 2 COLUMNAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* COLUMNA IZQUIERDA: CAMPOS BÁSICOS */}
            <div className="space-y-4">
              <div>
                <Label>Nombre de la campaña</Label>
                <Input
                  placeholder="Ej. Lanzamiento CardioFlex Q3..."
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Producto Principal</Label>
                  <Select
                    value={formData.productIds?.[0] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, productIds: [e.target.value] })
                    }
                  >
                    {store.products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label>Avatar Asignado</Label>
                  <Select
                    value={formData.avatarId || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, avatarId: e.target.value })
                    }
                  >
                    {store.avatars.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Audiencia Objetivo</Label>
                  <Select
                    value={formData.audience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        audience: e.target.value as TargetAudience,
                      })
                    }
                  >
                    <option value="covered_doctors">Médicos cubiertos</option>
                    <option value="uncovered_doctors">
                      Médicos no alcanzados
                    </option>
                    <option value="pharmacy_staff">
                      Dependientes farmacia
                    </option>
                  </Select>
                </div>

                <div>
                  <Label>Ciclo Promocional</Label>
                  <Input
                    placeholder="Ej. 2026-Q3"
                    value={formData.cycle || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, cycle: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: CONFIGURACIÓN SCRIPT */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400 flex items-center gap-1">
                <FileText size={14} /> Script (Gerente de Producto)
              </p>

              <div>
                <Label>Apertura</Label>
                <Textarea
                  rows={2}
                  value={formData.script?.opening || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      script: { ...formData.script!, opening: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <Label>Presentación de Producto</Label>
                <Textarea
                  rows={2}
                  value={formData.script?.productPresentation || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      script: {
                        ...formData.script!,
                        productPresentation: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div>
                <Label>Pregunta de Sondeo</Label>
                <Input
                  value={formData.script?.probingQuestion || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      script: {
                        ...formData.script!,
                        probingQuestion: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div>
                <Label>Cierre</Label>
                <Input
                  value={formData.script?.closing || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      script: { ...formData.script!, closing: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* ACCIONES DEL MODAL DE CREACIÓN */}
          <div className="pt-4 flex items-center gap-2 justify-end border-t border-ink-100">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button className="shadow-sm" onClick={handleSaveCampaign}>
              <CheckCircle2 size={16} /> Guardar campaña
            </Button>
          </div>
        </div>
      </Modal>

      {/* CONFIRMACIÓN DE CAMBIO DE ESTADO */}
      <ConfirmDialog
        isOpen={showStatusConfirm}
        onClose={() => {
          setShowStatusConfirm(false);
          setPendingStatus(null);
        }}
        title="Cambiar estado de campaña"
        description={`¿Estás seguro de cambiar el estado de la campaña a "${pendingStatus}"?`}
        confirmText="Cambiar"
        cancelText="Cancelar"
        onConfirm={() => {
          if (pendingStatus && selectedCampaignModal) {
            store.setCampaignStatus(selectedCampaignModal.id, pendingStatus);
            setSelectedCampaignModal({
              ...selectedCampaignModal,
              status: pendingStatus,
            });
          }
        }}
      />

      {/* CONFIRMACIÓN DE ELIMINAR CAMPAÑA */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Eliminar campaña"
        description={`¿Estás seguro de que deseas eliminar la campaña "${selectedCampaignModal?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar permanentemente"
        cancelText="Cancelar"
        onConfirm={handleDeleteCampaign}
      />
    </div>
  );
}

function ScriptLine({ k, v }: { k: string; v: string }) {
  return (
    <div className="mt-1.5">
      <p className="text-[11px] font-bold text-brand-800 uppercase tracking-wide">
        {k}
      </p>
      <p className="text-xs text-ink-700 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-relaxed mt-0.5">
        {v}
      </p>
    </div>
  );
}
