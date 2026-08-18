import { useState } from 'react'
import { FilePlus2 } from 'lucide-react'
import { Badge, Button, Card, Input, Label, PageHeader, Select, Textarea } from '../components/ui'
import { useAppStore } from '../store/useAppStore'
import type { DocType } from '../types'

const docTypes: DocType[] = [
  'product_profile',
  'prescribing_info',
  'clinical_study',
  'visual_aid',
  'campaign_script',
  'legal',
  'medical',
  'training',
]

export function Products() {
  const { products, documents, addDocument } = useAppStore()
  const [title, setTitle] = useState('')
  const [type, setType] = useState<DocType>('product_profile')
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [content, setContent] = useState('')

  function add() {
    if (!title.trim() || !content.trim()) return
    addDocument({
      id: `doc-${Date.now()}`,
      title,
      type,
      productId: productId || undefined,
      content,
      tags: title.toLowerCase().split(/\s+/).slice(0, 4),
      version: '1.0',
      approved: true,
      updatedAt: new Date().toISOString().slice(0, 10),
    })
    setTitle('')
    setContent('')
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Productos y documentación"
        subtitle="Perfil, IPP, estudios clínicos, visual aids y scripts. El VM solo responde con este corpus aprobado."
      />

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {products.map((p) => (
          <Card key={p.id} className="p-5">
            <Badge tone="brand">{p.therapeuticArea}</Badge>
            <p className="mt-2 text-lg font-semibold">{p.name}</p>
            <p className="text-xs text-ink-500">{p.molecule}</p>
            <p className="mt-2 text-sm text-ink-600">{p.indication}</p>
            <ul className="mt-3 space-y-1">
              {p.keyMessages.map((m) => (
                <li key={m} className="text-xs text-ink-500">• {m}</li>
              ))}
            </ul>
            {p.sampleAvailable ? <Badge tone="success" >Muestra disponible</Badge> : null}
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {documents.map((d) => (
            <Card key={d.id} className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-ink-900">{d.title}</p>
                <Badge>{d.type}</Badge>
                {d.approved ? <Badge tone="success">Aprobado</Badge> : <Badge tone="warn">Pendiente</Badge>}
                <span className="text-[11px] text-ink-400">v{d.version} · {d.updatedAt}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 line-clamp-3">{d.content}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {d.tags.map((t) => (
                  <span key={t} className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] text-ink-600">#{t}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card className="h-fit p-5">
          <div className="mb-3 flex items-center gap-2">
            <FilePlus2 size={16} className="text-brand-700" />
            <p className="text-sm font-semibold">Cargar documento interno</p>
          </div>
          <div className="space-y-3">
            <div>
              <Label>Título</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={type} onChange={(e) => setType(e.target.value as DocType)}>
                {docTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Producto</Label>
              <Select value={productId} onChange={(e) => setProductId(e.target.value)}>
                <option value="">General / compañía</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Contenido aprobado</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
            </div>
            <Button className="w-full" onClick={add}>Añadir al corpus</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
