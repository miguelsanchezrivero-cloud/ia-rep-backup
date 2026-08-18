import { useState } from "react";
import {
  FilePlus2,
  FileText,
  Pill,
  CheckCircle2,
  Sparkles,
  FilterX,
  Tag,
  ShieldCheck,
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
} from "../components/ui";
import { useAppStore } from "../store/useAppStore";
import type { DocType } from "../types";

const docTypes: DocType[] = [
  "product_profile",
  "prescribing_info",
  "clinical_study",
  "visual_aid",
  "campaign_script",
  "legal",
  "medical",
  "training",
];

export function Products() {
  const { products, documents, addDocument } = useAppStore();

  // Estado para el modal de "Cargar documento interno"
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);

  // Estados del formulario para agregar documento
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DocType>("product_profile");
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [content, setContent] = useState("");

  // Estado para el producto seleccionado actualmente (null por defecto)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  // Producto seleccionado actualmente
  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId)
    : null;

  // Filtrado de documentos según el producto seleccionado
  const filteredDocuments = selectedProductId
    ? documents.filter((d) => d.productId === selectedProductId || !d.productId)
    : [];

  function handleAddDocument() {
    if (!title.trim() || !content.trim()) return;
    addDocument({
      id: `doc-${Date.now()}`,
      title,
      type,
      productId: productId || undefined,
      content,
      tags: title.toLowerCase().split(/\s+/).slice(0, 4),
      version: "1.0",
      approved: true,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    // Resetear y cerrar modal
    setTitle("");
    setContent("");
    setIsAddDocModalOpen(false);
  }

  // Paleta de degradados para las 3 tarjetas de producto
  const productCardGradients = [
    "from-teal-50/70 via-white to-sky-50/30 border-teal-200/80 hover:border-teal-300",
    "from-sky-50/70 via-white to-indigo-50/30 border-sky-200/80 hover:border-sky-300",
    "from-amber-50/70 via-white to-orange-50/30 border-amber-200/80 hover:border-amber-300",
  ];

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Productos y documentación"
        subtitle="Perfil, IPP, estudios clínicos, visual aids y scripts. El Visitador Médico solo responde con este corpus aprobado."
        actions={
          <Button
            onClick={() => setIsAddDocModalOpen(true)}
            className="shadow-md shadow-brand-700/20"
          >
            <FilePlus2 size={18} />
            Cargar documento interno
          </Button>
        }
      />

      {/* 1. TRES TARJETAS PRINCIPALES DE PRODUCTOS (CardioFlex XR, Respirax Kids, GastroPro) */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
            Productos Principales (Haz clic en una tarjeta para ver sus
            documentos)
          </p>
          {selectedProductId && (
            <button
              onClick={() => setSelectedProductId(null)}
              className="flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800 transition-colors"
            >
              <FilterX size={14} />
              Cerrar vista de documentos
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {products.slice(0, 3).map((p, index) => {
            const isSelected = selectedProductId === p.id;
            const cardStyle =
              productCardGradients[index % productCardGradients.length];

            return (
              <Card
                key={p.id}
                interactive
                onClick={() => setSelectedProductId(isSelected ? null : p.id)}
                className={`relative overflow-hidden border p-5 transition-all duration-200 bg-gradient-to-br ${cardStyle} ${
                  isSelected
                    ? "ring-2 ring-brand-500 shadow-md scale-[1.01]"
                    : "hover:-translate-y-1 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge tone="brand">{p.therapeuticArea}</Badge>
                  {p.sampleAvailable && (
                    <Badge tone="success">Muestra disponible</Badge>
                  )}
                </div>

                <div className="mt-3">
                  <p className="text-xl font-black text-ink-900 tracking-tight flex items-center gap-2">
                    <Pill size={18} className="text-brand-600 shrink-0" />
                    {p.name}
                  </p>
                  <p className="text-xs font-semibold text-ink-500 mt-0.5">
                    Molécula: <span className="text-ink-800">{p.molecule}</span>
                  </p>
                </div>

                <div className="mt-3 rounded-xl bg-white/70 p-3 border border-ink-100/80">
                  <p className="text-xs font-bold text-ink-700 uppercase tracking-wider mb-1">
                    Indicación
                  </p>
                  <p className="text-xs text-ink-600 leading-relaxed">
                    {p.indication}
                  </p>
                </div>

                <div className="mt-3 space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">
                    Mensajes Clave
                  </p>
                  {p.keyMessages.map((m) => (
                    <div
                      key={m}
                      className="flex items-start gap-1.5 text-xs text-ink-700 font-medium"
                    >
                      <Sparkles
                        size={12}
                        className="text-brand-500 shrink-0 mt-0.5"
                      />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-ink-100/80 flex items-center justify-between text-xs font-bold">
                  {isSelected ? (
                    <>
                      <span className="text-brand-700">
                        Documentos desplegados
                      </span>
                      <CheckCircle2 size={16} className="text-brand-700" />
                    </>
                  ) : (
                    <span className="text-ink-400 group-hover:text-ink-600">
                      Ver documentación →
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 2. SECCIÓN DE DOCUMENTOS (SOLO APARECE CUANDO SE HACE CLIC EN UNA TARJETA) */}
      {selectedProduct && (
        <Card className="animate-fade-up overflow-hidden border-ink-200/60">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-gradient-to-r from-ink-50/60 to-white px-6 py-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-brand-700" />
              <h3 className="text-sm font-bold text-ink-900 uppercase tracking-wide">
                Documentos Aprobados — {selectedProduct.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="brand">
                {filteredDocuments.length} documento(s)
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProductId(null)}
                className="text-xs text-ink-500 hover:text-ink-800"
              >
                Ocultar
              </Button>
            </div>
          </div>

          <div className="p-6">
            {filteredDocuments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 p-8 text-center">
                <FileText size={32} className="mx-auto text-ink-400 mb-2" />
                <p className="text-sm font-semibold text-ink-700">
                  No hay documentos asociados a este producto
                </p>
                <p className="text-xs text-ink-500 mt-1">
                  Usa el botón "Cargar documento interno" para añadir uno nuevo.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredDocuments.map((d) => (
                  <div
                    key={d.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-ink-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-brand-200"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <p className="font-bold text-ink-900 text-base leading-snug">
                          {d.title}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <Badge tone="brand">{d.type}</Badge>
                          {d.approved ? (
                            <Badge tone="success">Aprobado</Badge>
                          ) : (
                            <Badge tone="warn">Pendiente</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-ink-400 mb-3">
                        <span>
                          Producto:{" "}
                          <strong className="text-ink-700">
                            {selectedProduct.name}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>v{d.version}</span>
                        <span>•</span>
                        <span>{d.updatedAt}</span>
                      </div>

                      <p className="text-xs text-ink-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 line-clamp-3">
                        {d.content}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-ink-100 flex flex-wrap gap-1.5">
                      {d.tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 rounded-lg bg-ink-100/80 px-2 py-0.5 text-[10px] font-semibold text-ink-600"
                        >
                          <Tag size={10} />#{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 3. MODAL DINÁMICO: CARGAR DOCUMENTO INTERNO */}
      <Modal
        isOpen={isAddDocModalOpen}
        onClose={() => setIsAddDocModalOpen(false)}
        title="Cargar documento interno"
        className="max-w-lg max-h-[90vh] overflow-y-auto mt-6 mb-auto"
      >
        <div className="space-y-4 pt-2">
          <div>
            <Label>Título del documento</Label>
            <Input
              placeholder="Ej. Estudio Clínico CardioFlex 2026, Visual Aid Respirax..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tipo de documento</Label>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as DocType)}
              >
                {docTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Producto asociado</Label>
              <Select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              >
                <option value="">General / Compañía</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label>Contenido aprobado (Corpus anti-alucinación)</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe o pega aquí el texto validado del documento que la IA utilizará para generar respuestas..."
              rows={5}
            />
          </div>

          <div className="pt-3 flex items-center gap-2 justify-end border-t border-ink-100">
            <Button
              variant="outline"
              onClick={() => setIsAddDocModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button className="shadow-sm" onClick={handleAddDocument}>
              Añadir al corpus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
