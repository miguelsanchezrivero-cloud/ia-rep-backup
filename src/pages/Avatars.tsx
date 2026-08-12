import { useState } from 'react'
import { AvatarFace } from '../components/AvatarFace'
import { Badge, Button, Card, Input, Label, PageHeader, Select, Textarea } from '../components/ui'
import { useAppStore } from '../store/useAppStore'
import type { AccentRegion, AvatarConfig, Gender } from '../types'

const accents: AccentRegion[] = ['cdmx', 'norte', 'bajio', 'sur', 'caribe', 'andino', 'rioplatense', 'neutro']
const gradients = [
  'from-teal-400 to-cyan-700',
  'from-sky-400 to-indigo-700',
  'from-rose-400 to-fuchsia-800',
  'from-amber-400 to-orange-700',
  'from-emerald-400 to-green-800',
]

export function Avatars() {
  const { avatars, upsertAvatar } = useAppStore()
  const [form, setForm] = useState<AvatarConfig>({
    id: '',
    name: '',
    gender: 'femenino',
    skinTone: 'media',
    traits: '',
    accent: 'cdmx',
    attire: '',
    region: '',
    personality: 'amigable y cortés',
    photoGradient: gradients[0],
    active: true,
  })

  function save() {
    if (!form.name.trim()) return
    upsertAvatar({
      ...form,
      id: form.id || `av-${form.name.toLowerCase().replace(/\s+/g, '-')}`,
    })
    setForm({
      id: '',
      name: '',
      gender: 'femenino',
      skinTone: 'media',
      traits: '',
      accent: 'cdmx',
      attire: '',
      region: '',
      personality: 'amigable y cortés',
      photoGradient: gradients[Math.floor(Math.random() * gradients.length)],
      active: true,
    })
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Avatares regionales"
        subtitle="Género, piel, rasgos, acento y vestimenta para generar cercanía (ej. citadino CDMX vs norteño)."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {avatars.map((a) => (
            <Card key={a.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <AvatarFace avatar={a} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-semibold">{a.name}</p>
                  <Badge tone="brand">{a.accent}</Badge>
                  {a.active ? <Badge tone="success">Activo</Badge> : <Badge>Inactivo</Badge>}
                </div>
                <p className="mt-1 text-sm text-ink-600">{a.region} · {a.gender} · piel {a.skinTone}</p>
                <p className="mt-1 text-xs text-ink-500">{a.traits} · {a.attire}</p>
                <p className="mt-2 text-xs font-medium text-brand-800">{a.personality}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setForm(a)}>Editar</Button>
            </Card>
          ))}
        </div>

        <Card className="h-fit p-5">
          <p className="text-sm font-semibold">{form.id ? 'Editar avatar' : 'Crear avatar'}</p>
          <div className="mt-4 space-y-3">
            <div>
              <Label>Nombre</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Género</Label>
                <Select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                  <option value="neutro">Neutro</option>
                </Select>
              </div>
              <div>
                <Label>Acento</Label>
                <Select value={form.accent} onChange={(e) => setForm({ ...form, accent: e.target.value as AccentRegion })}>
                  {accents.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Label>Región</Label>
              <Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
            </div>
            <div>
              <Label>Color de piel</Label>
              <Input value={form.skinTone} onChange={(e) => setForm({ ...form, skinTone: e.target.value })} />
            </div>
            <div>
              <Label>Rasgos</Label>
              <Input value={form.traits} onChange={(e) => setForm({ ...form, traits: e.target.value })} />
            </div>
            <div>
              <Label>Vestimenta</Label>
              <Input value={form.attire} onChange={(e) => setForm({ ...form, attire: e.target.value })} />
            </div>
            <div>
              <Label>Personalidad</Label>
              <Textarea value={form.personality} onChange={(e) => setForm({ ...form, personality: e.target.value })} />
            </div>
            <Button className="w-full" onClick={save}>Guardar avatar</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
