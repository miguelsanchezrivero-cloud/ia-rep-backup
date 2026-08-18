import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  PageHeader,
  Textarea,
  Modal,
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

  const selectedTrainer = selectedTrainerId
    ? trainerStyles.find((t) => t.id === selectedTrainerId)
    : null;
  const selectedModule = selectedModuleId
    ? academyModules.find((m) => m.id === selectedModuleId)
    : null;

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Academia online"
        subtitle="Zona de entrenamiento: la IA aprende conocimiento, maneras de hablar y acento de cada formador. También cursos con certificado para dependientes."
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        {trainerStyles.map((t) => (
          <Card
            key={t.id}
            interactive
            onClick={() => setSelectedTrainerId(t.id)}
            className="p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{t.trainerName}</p>
              <Badge tone="brand">acento {t.accent}</Badge>
            </div>
            <p className="mt-2 text-sm text-ink-600">{t.speakingStyle}</p>
            <div className="mt-3 space-y-1">
              {t.samplePhrases.map((p) => (
                <p
                  key={p}
                  className="rounded-xl bg-brand-50 px-3 py-2 text-xs italic text-brand-900"
                >
                  “{p}”
                </p>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-500">{t.notes}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {academyModules.map((m) => (
          <Card
            key={m.id}
            interactive
            onClick={() => setSelectedModuleId(m.id)}
            className="p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-semibold">{m.title}</p>
              <Badge>{m.audience}</Badge>
              {m.certificateTitle ? (
                <Badge tone="success">Certificado</Badge>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-ink-500">{m.description}</p>
            <p className="mt-2 text-xs text-ink-400">
              {m.lessons.length} lecciones
            </p>
          </Card>
        ))}
      </div>

      {selectedTrainer && (
        <Modal
          isOpen={!!selectedTrainerId}
          onClose={() => setSelectedTrainerId(null)}
          title={selectedTrainer.trainerName}
          className="max-w-2xl"
        >
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Acento y estilo
              </p>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  <span className="text-ink-600">Acento:</span>{" "}
                  <Badge tone="brand">{selectedTrainer.accent}</Badge>
                </p>
                <p className="text-sm text-ink-700">
                  {selectedTrainer.speakingStyle}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Frases de ejemplo
              </p>
              <div className="mt-2 space-y-2">
                {selectedTrainer.samplePhrases.map((phrase) => (
                  <p
                    key={phrase}
                    className="rounded-xl bg-brand-50 px-3 py-2 text-sm italic text-brand-900"
                  >
                    "{phrase}"
                  </p>
                ))}
              </div>
            </div>

            <div className="border-t border-ink-100 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-2">
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
                className="mt-3 w-full"
                onClick={() => setNotes({ ...notes, [selectedTrainer.id]: "" })}
              >
                Registrar en modelo de estilo
              </Button>
            </div>

            <p className="text-xs text-ink-500 border-t border-ink-100 pt-3">
              {selectedTrainer.notes}
            </p>
          </div>
        </Modal>
      )}

      {selectedModule && (
        <Modal
          isOpen={!!selectedModuleId}
          onClose={() => setSelectedModuleId(null)}
          title={selectedModule.title}
          className="max-w-2xl"
        >
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge>{selectedModule.audience}</Badge>
                {selectedModule.certificateTitle ? (
                  <Badge tone="success">Certificado</Badge>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-ink-600">
                {selectedModule.description}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-3">
                Lecciones ({selectedModule.lessons.length})
              </p>
              <div className="space-y-3">
                {selectedModule.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="rounded-xl border border-ink-200 bg-ink-50/50 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-ink-900">
                          {lesson.title}
                        </p>
                        <p className="mt-1 text-sm text-ink-600">
                          {lesson.content}
                        </p>
                      </div>
                      <span className="whitespace-nowrap text-xs text-ink-400">
                        {lesson.durationMin} min
                      </span>
                    </div>
                    <Button
                      className="mt-2"
                      size="sm"
                      variant={done[lesson.id] ? "secondary" : "outline"}
                      onClick={() =>
                        setDone({ ...done, [lesson.id]: !done[lesson.id] })
                      }
                    >
                      {done[lesson.id] ? "✓ Completada" : "Marcar completada"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {selectedModule.certificateTitle && (
              <div className="border-t border-ink-100 pt-3 rounded-xl border border-dashed border-brand-300 bg-brand-50/50 p-4 text-center">
                <p className="text-sm font-semibold text-brand-900">
                  {selectedModule.certificateTitle}
                </p>
                <p className="mt-1 text-xs text-brand-700">
                  Disponible al completar todas las lecciones
                </p>
                <Button className="mt-3 w-full" size="sm">
                  Descargar certificado
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
