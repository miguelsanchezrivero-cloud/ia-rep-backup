import { useState } from "react";
import {
  Plus,
  UserCheck,
  Sparkles,
  User,
  MapPin,
  Palette,
  Shirt,
  MessageSquare,
  Heart,
  Trash2,
} from "lucide-react";
import { AvatarFace } from "../components/AvatarFace";
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
import { useAppStore } from "../store/useAppStore";
import type { AccentRegion, AvatarConfig, Gender } from "../types";

const accents: AccentRegion[] = [
  "cdmx",
  "norte",
  "bajio",
  "sur",
  "caribe",
  "andino",
  "rioplatense",
  "neutro",
];

const gradients = [
  "from-teal-400 to-cyan-700",
  "from-sky-400 to-indigo-700",
  "from-rose-400 to-fuchsia-800",
  "from-amber-400 to-orange-700",
  "from-emerald-400 to-green-800",
];

const initialFormState: AvatarConfig = {
  id: "",
  name: "",
  gender: "femenino",
  skinTone: "media",
  traits: "",
  accent: "cdmx",
  attire: "",
  region: "",
  personality: "amigable y cortés",
  photoGradient: gradients[0],
  active: true,
};

export function Avatars() {
  const { avatars, upsertAvatar } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<AvatarConfig>(initialFormState);

  // Estado para la confirmación de eliminación
  const [avatarToDelete, setAvatarToDelete] = useState<AvatarConfig | null>(
    null,
  );

  // Abrir modal para crear un nuevo avatar
  function handleOpenCreate() {
    setForm({
      ...initialFormState,
      photoGradient: gradients[Math.floor(Math.random() * gradients.length)],
    });
    setIsModalOpen(true);
  }

  // Abrir modal para editar un avatar existente
  function handleOpenEdit(avatar: AvatarConfig) {
    setForm(avatar);
    setIsModalOpen(true);
  }

  // Guardar / Actualizar
  function save() {
    if (!form.name.trim()) return;
    upsertAvatar({
      ...form,
      id: form.id || `av-${form.name.toLowerCase().replace(/\s+/g, "-")}`,
    });
    setIsModalOpen(false);
    setForm(initialFormState);
  }

  // Confirmar eliminación de avatar
  function handleDeleteConfirm() {
    if (!avatarToDelete) return;
    useAppStore.setState((state) => ({
      avatars: state.avatars.filter((a) => a.id !== avatarToDelete.id),
    }));
    setAvatarToDelete(null);
  }

  // Paleta de degradados estilo Dashboard
  const cardGradients = [
    "from-teal-50/60 via-white to-white border-teal-200/80",
    "from-sky-50/60 via-white to-white border-sky-200/80",
    "from-rose-50/60 via-white to-white border-rose-200/80",
    "from-amber-50/60 via-white to-white border-amber-200/80",
    "from-emerald-50/60 via-white to-white border-emerald-200/80",
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Avatares regionales"
        subtitle="Género, piel, rasgos, acento y vestimenta para generar cercanía (ej. citadino CDMX vs norteño)."
        actions={
          <Button
            onClick={handleOpenCreate}
            className="shadow-md shadow-brand-700/20"
          >
            <Plus size={18} />
            Crear avatar
          </Button>
        }
      />

      {/* REPO / GRILLA DE AVATARES */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {avatars.map((a, index) => {
          const cardStyle = cardGradients[index % cardGradients.length];

          return (
            <Card
              key={a.id}
              className={`relative overflow-hidden border bg-gradient-to-br ${cardStyle} p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between`}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 pt-1">
                  <AvatarFace avatar={a} size="lg" />
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-lg font-extrabold text-ink-900 tracking-tight">
                      {a.name}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Badge tone="brand">{a.accent}</Badge>
                      {a.active ? (
                        <Badge tone="success">Activo</Badge>
                      ) : (
                        <Badge tone="neutral">Inactivo</Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-ink-600 flex items-center gap-1">
                    <MapPin size={13} className="text-brand-600 shrink-0" />
                    <span>{a.region || "Región no especificada"}</span>
                    <span className="text-ink-300">•</span>
                    <span className="capitalize">{a.gender}</span>
                    <span className="text-ink-300">•</span>
                    <span>piel {a.skinTone}</span>
                  </p>

                  {(a.traits || a.attire) && (
                    <p className="text-xs text-ink-500 leading-relaxed bg-white/60 rounded-lg p-2 border border-ink-100/80">
                      {a.traits && (
                        <span className="font-medium">{a.traits}</span>
                      )}
                      {a.traits && a.attire && " — "}
                      {a.attire && <span className="italic">{a.attire}</span>}
                    </p>
                  )}

                  {a.personality && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-800 pt-0.5">
                      <Sparkles size={13} className="text-brand-500 shrink-0" />
                      <span>{a.personality}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* ACCIONES DE TARJETA: EDITAR Y ELIMINAR */}
              <div className="mt-4 pt-3 border-t border-ink-100/80 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAvatarToDelete(a)}
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  <Trash2 size={15} />
                  Eliminar
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(a)}
                  className="shadow-sm"
                >
                  Editar
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* MODAL / FICHA ÚNICA (AJUSTADO PARA QUE NO SE CORTE ARRIBA) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={form.id ? "Editar avatar" : "Crear avatar"}
        className="max-w-lg max-h-[90vh] overflow-y-auto my-auto"
      >
        <div className="space-y-4 pt-2">
          {/* Nombre */}
          <div>
            <Label>
              <span className="flex items-center gap-1">
                <User size={12} /> Nombre del avatar
              </span>
            </Label>
            <Input
              placeholder="Ej. Ana Sofía, Carlos, Luisa..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Género y Acento */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>
                <span className="flex items-center gap-1">
                  <UserCheck size={12} /> Género
                </span>
              </Label>
              <Select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value as Gender })
                }
              >
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
                <option value="neutro">Neutro</option>
              </Select>
            </div>
            <div>
              <Label>
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} /> Acento
                </span>
              </Label>
              <Select
                value={form.accent}
                onChange={(e) =>
                  setForm({
                    ...form,
                    accent: e.target.value as AccentRegion,
                  })
                }
              >
                {accents.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Región y Color de Piel */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> Región
                </span>
              </Label>
              <Input
                placeholder="Ej. CDMX, Bajío, Norte"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              />
            </div>
            <div>
              <Label>
                <span className="flex items-center gap-1">
                  <Palette size={12} /> Color de piel
                </span>
              </Label>
              <Input
                placeholder="Ej. clara, media, morena"
                value={form.skinTone}
                onChange={(e) => setForm({ ...form, skinTone: e.target.value })}
              />
            </div>
          </div>

          {/* Rasgos */}
          <div>
            <Label>Rasgos característicos</Label>
            <Input
              placeholder="Ej. cabello oscuro, lentes, sonrisa cálida"
              value={form.traits}
              onChange={(e) => setForm({ ...form, traits: e.target.value })}
            />
          </div>

          {/* Vestimenta */}
          <div>
            <Label>
              <span className="flex items-center gap-1">
                <Shirt size={12} /> Vestimenta
              </span>
            </Label>
            <Input
              placeholder="Ej. bata médica, traje formal, blazer casual"
              value={form.attire}
              onChange={(e) => setForm({ ...form, attire: e.target.value })}
            />
          </div>

          {/* Personalidad */}
          <div>
            <Label>
              <span className="flex items-center gap-1">
                <Heart size={12} /> Personalidad
              </span>
            </Label>
            <Textarea
              rows={2}
              placeholder="Ej. empática, profesional, directa..."
              value={form.personality}
              onChange={(e) =>
                setForm({ ...form, personality: e.target.value })
              }
            />
          </div>

          {/* Acciones del Modal */}
          <div className="pt-3 flex items-center gap-2 justify-end border-t border-ink-100">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button className="shadow-sm" onClick={save}>
              {form.id ? "Actualizar avatar" : "Guardar avatar"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* DIÁLOGO DE CONFIRMACIÓN PARA ELIMINAR */}
      <ConfirmDialog
        isOpen={avatarToDelete !== null}
        onClose={() => setAvatarToDelete(null)}
        title="¿Eliminar avatar?"
        description={`¿Estás seguro de que deseas eliminar el avatar de "${avatarToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDangerous
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
