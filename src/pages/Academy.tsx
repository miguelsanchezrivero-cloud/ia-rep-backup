import { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Sparkles,
  Plus,
  FileText,
  UserCheck,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  PageHeader,
  Textarea,
  Modal,
  Input,
  Label,
} from "../components/ui";
import { useAppStore } from "../store/useAppStore";

export function Academy() {
  const { academyModules, trainerStyles } = useAppStore();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(
    null,
  );
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  // Estados interactivos adicionales (añadidos para equipar el estilo del resto de páginas)
  const [isNewModuleModalOpen, setIsNewModuleModalOpen] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");
  const [newModuleAudience, setNewModuleAudience] = useState(
    "Dependientes farmacia",
  );
  const [successMsg, setSuccessMsg] = useState("");

  const selectedTrainer = selectedTrainerId
    ? trainerStyles.find((t) => t.id === selectedTrainerId)
    : null;
  const selectedModule = selectedModuleId
    ? academyModules.find((m) => m.id === selectedModuleId)
    : null;

  // Paleta de degradados para las tarjetas de entrenadores y módulos (estilo Dashboard/CRM)
  const cardGradients = [
    "from-teal-50/60 via-white to-white border-teal-200/80 hover:border-teal-300",
    "from-sky-50/60 via-white to-white border-sky-200/80 hover:border-sky-300",
    "from-indigo-50/60 via-white to-white border-indigo-200/80 hover:border-indigo-300",
    "from-rose-50/60 via-white to-white border-rose-200/80 hover:border-rose-300",
  ];

  // Simular creación de un nuevo módulo de entrenamiento
  function handleCreateModule() {
    if (!newModuleTitle.trim()) return;
    const newMod = {
      id: `mod-${Date.now()}`,
      title: newModuleTitle,
      description:
        newModuleDescription || "Módulo personalizado de entrenamiento.",
      audience: newModuleAudience,
      lessons: [
        {
          id: `l-${Date.now()}-1`,
          title: "Introducción y objetivos",
          content: "Conceptos clave del material formativo.",
          durationMin: 5,
        },
        {
          id: `l-${Date.now()}-2`,
          title: "Evaluación rápida",
          content: "Test interactivo para consolidar conocimientos.",
          durationMin: 10,
        },
      ],
      certificateTitle: "Certificado de Capacitación Comercial",
    } as (typeof academyModules)[0]; // ← solución

    academyModules.push(newMod);
    setSuccessMsg(`Módulo "${newModuleTitle}" creado exitosamente.`);
    setNewModuleTitle("");
    setNewModuleDescription("");
    setIsNewModuleModalOpen(false);
  }

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Academia online"
        subtitle="Zona de entrenamiento: la IA aprende conocimiento, maneras de hablar y acento de cada formador. También cursos con certificado para dependientes."
        actions={
          <Button
            onClick={() => setIsNewModuleModalOpen(true)}
            className="shadow-md shadow-brand-700/20"
          >
            <Plus size={18} />
            Crear módulo
          </Button>
        }
      />

      {/* Banner de mensajes de estado estilo Campañas/Avatares */}
      {successMsg && (
        <div className="flex items-center justify-between rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-900 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand-600" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg("")}
            className="text-xs font-bold text-brand-700 hover:underline"
          >
            Desestimar
          </button>
        </div>
      )}

      {/* 1. SECCIÓN DE ESTILOS DE FORMADORES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400 flex items-center gap-1.5">
            <UserCheck size={14} className="text-brand-600" />
            Entrenadores y Modelos de Voz / Acento
          </p>
          <span className="text-xs text-ink-500 font-medium">
            Personalización de IA generativa
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {trainerStyles.map((t, index) => {
            const cardStyle = cardGradients[index % cardGradients.length];

            return (
              <Card
                key={t.id}
                interactive
                onClick={() => setSelectedTrainerId(t.id)}
                className={`relative overflow-hidden border bg-gradient-to-br ${cardStyle} p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-lg font-extrabold text-ink-900 tracking-tight">
                      {t.trainerName}
                    </p>
                    <Badge tone="brand">acento {t.accent}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-ink-600 font-medium">
                    {t.speakingStyle}
                  </p>

                  <div className="mt-3 space-y-1.5">
                    {t.samplePhrases.map((p) => (
                      <p
                        key={p}
                        className="rounded-xl bg-white/80 border border-brand-100 px-3 py-2 text-xs italic text-brand-900 shadow-xs"
                      >
                        “{p}”
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-ink-100/80 flex items-center justify-between text-xs font-bold text-brand-700">
                  <span>Configurar matices de voz</span>
                  <span>→</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 2. SECCIÓN DE MÓDULOS DE LA ACADEMIA */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400 flex items-center gap-1.5">
            <GraduationCap size={14} className="text-brand-600" />
            Módulos y Certificaciones Activas
          </p>
          <span className="text-xs text-ink-500 font-medium">
            {academyModules.length} programas disponibles
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {academyModules.map((m, index) => {
            const cardStyle = cardGradients[(index + 2) % cardGradients.length];

            return (
              <Card
                key={m.id}
                interactive
                onClick={() => setSelectedModuleId(m.id)}
                className={`relative overflow-hidden border bg-gradient-to-br ${cardStyle} p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Badge>{m.audience}</Badge>
                    {m.certificateTitle ? (
                      <Badge tone="success">Certificado</Badge>
                    ) : (
                      <Badge tone="neutral">Práctica</Badge>
                    )}
                  </div>

                  <div className="mt-3">
                    <p className="text-lg font-extrabold text-ink-900 tracking-tight leading-snug">
                      {m.title}
                    </p>
                    <p className="mt-1.5 text-xs text-ink-600 leading-relaxed line-clamp-2">
                      {m.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-ink-100/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-500 flex items-center gap-1">
                    <BookOpen size={13} className="text-brand-600" />
                    {m.lessons.length} lecciones
                  </span>
                  <span className="text-xs font-bold text-brand-700">
                    Ver temario →
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: CONFIGURACIÓN DE ENTRENADOR */}
      {selectedTrainer && (
        <Modal
          isOpen={!!selectedTrainerId}
          onClose={() => setSelectedTrainerId(null)}
          title={`Entrenador: ${selectedTrainer.trainerName}`}
          className="max-w-2xl max-h-[85vh] overflow-y-auto"
        >
          <div className="space-y-4 pt-1">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-500">
                Acento y estilo base
              </p>
              <div className="flex items-center gap-2">
                <Badge tone="brand">Acento: {selectedTrainer.accent}</Badge>
              </div>
              <p className="text-sm text-ink-700 font-medium">
                {selectedTrainer.speakingStyle}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">
                Frases de ejemplo características
              </p>
              <div className="space-y-2">
                {selectedTrainer.samplePhrases.map((phrase) => (
                  <p
                    key={phrase}
                    className="rounded-xl bg-brand-50/60 border border-brand-100 px-3.5 py-2.5 text-sm italic text-brand-900 shadow-xs"
                  >
                    "{phrase}"
                  </p>
                ))}
              </div>
            </div>

            <div className="border-t border-ink-100 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2 flex items-center gap-1">
                <Sparkles size={14} className="text-brand-600" />
                Añadir frase o matiz para el modelo
              </p>
              <Textarea
                placeholder="Describe una frase característica, matiz de acento o rasgo de personalidad…"
                value={notes[selectedTrainer.id] ?? ""}
                onChange={(e) =>
                  setNotes({ ...notes, [selectedTrainer.id]: e.target.value })
                }
                rows={3}
              />
              <Button
                className="mt-3 w-full shadow-sm"
                onClick={() => {
                  setSuccessMsg(
                    `Matiz registrado correctamente para ${selectedTrainer.trainerName}.`,
                  );
                  setNotes({ ...notes, [selectedTrainer.id]: "" });
                  setSelectedTrainerId(null);
                }}
              >
                Registrar en modelo de estilo
              </Button>
            </div>

            <p className="text-xs text-ink-500 border-t border-ink-100 pt-3 italic">
              {selectedTrainer.notes}
            </p>
          </div>
        </Modal>
      )}

      {/* MODAL 2: DETALLE Y PROGRESO DEL MÓDULO */}
      {selectedModule && (
        <Modal
          isOpen={!!selectedModuleId}
          onClose={() => setSelectedModuleId(null)}
          title={selectedModule.title}
          className="max-w-2xl max-h-[85vh] overflow-y-auto"
        >
          <div className="space-y-4 pt-1">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge>{selectedModule.audience}</Badge>
                {selectedModule.certificateTitle ? (
                  <Badge tone="success">Certificado habilitado</Badge>
                ) : null}
              </div>
              <p className="text-sm text-ink-600">
                {selectedModule.description}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ink-500 mb-3 flex items-center gap-1">
                <FileText size={14} className="text-brand-600" />
                Lecciones del programa ({selectedModule.lessons.length})
              </p>
              <div className="space-y-3">
                {selectedModule.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="rounded-xl border border-ink-200/80 bg-slate-50/60 p-4 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-bold text-ink-900 text-sm">
                          {lesson.title}
                        </p>
                        <p className="mt-1 text-xs text-ink-600 leading-relaxed">
                          {lesson.content}
                        </p>
                      </div>
                      <span className="whitespace-nowrap text-xs font-semibold text-ink-400 bg-white px-2 py-1 rounded-md border border-ink-100">
                        {lesson.durationMin} min
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-ink-100/80 pt-2.5">
                      <span className="text-[11px] text-ink-500">
                        {done[lesson.id]
                          ? "Lección completada"
                          : "Pendiente de revisión"}
                      </span>
                      <Button
                        size="sm"
                        variant={done[lesson.id] ? "secondary" : "outline"}
                        onClick={() =>
                          setDone({ ...done, [lesson.id]: !done[lesson.id] })
                        }
                        className="shadow-xs"
                      >
                        {done[lesson.id] ? "✓ Completada" : "Marcar completada"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedModule.certificateTitle && (
              <div className="rounded-2xl border border-dashed border-brand-300 bg-gradient-to-br from-brand-50/60 to-white p-5 text-center shadow-xs">
                <div className="inline-flex p-2 rounded-xl bg-brand-500/10 text-brand-600 mb-2">
                  <Award size={22} />
                </div>
                <p className="text-sm font-black text-brand-900">
                  {selectedModule.certificateTitle}
                </p>
                <p className="mt-1 text-xs text-brand-700">
                  Disponible para descarga automática al completar el 100% de
                  las lecciones.
                </p>
                <Button
                  className="mt-3 w-full shadow-sm"
                  size="sm"
                  onClick={() => {
                    setSuccessMsg(
                      `Certificado descargado con éxito para ${selectedModule.title}.`,
                    );
                    setSelectedModuleId(null);
                  }}
                >
                  Descargar certificado oficial
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* MODAL 3: CREAR NUEVO MÓDULO (INTERACTIVO) */}
      <Modal
        isOpen={isNewModuleModalOpen}
        onClose={() => setIsNewModuleModalOpen(false)}
        title="Crear nuevo módulo de capacitación"
        className="max-w-md max-h-[85vh] overflow-y-auto"
      >
        <div className="space-y-4 pt-2">
          <div>
            <Label>Título del programa</Label>
            <Input
              placeholder="Ej. Posología avanzada GastroPro..."
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
            />
          </div>

          <div>
            <Label>Audiencia destino</Label>
            <Input
              placeholder="Ej. Dependientes farmacia, Médicos..."
              value={newModuleAudience}
              onChange={(e) => setNewModuleAudience(e.target.value)}
            />
          </div>

          <div>
            <Label>Descripción general</Label>
            <Textarea
              rows={3}
              placeholder="Detalla el enfoque formativo y los objetivos principales..."
              value={newModuleDescription}
              onChange={(e) => setNewModuleDescription(e.target.value)}
            />
          </div>

          <div className="pt-3 flex items-center gap-2 justify-end border-t border-ink-100">
            <Button
              variant="outline"
              onClick={() => setIsNewModuleModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button className="shadow-sm" onClick={handleCreateModule}>
              <CheckCircle2 size={16} /> Guardar módulo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
