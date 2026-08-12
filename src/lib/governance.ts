import type {
  Campaign,
  CompanyDocument,
  ConversationMessage,
  Doctor,
  EscalationDept,
  PharmacyStaff,
  Product,
  RealRep,
  AvatarConfig,
  TargetAudience,
} from '../types'
import { contextualTips } from '../data/mock'

const STOP = new Set([
  'de', 'la', 'el', 'en', 'y', 'a', 'los', 'las', 'un', 'una', 'del', 'que', 'por', 'con', 'para', 'se', 'su', 'al', 'es', 'lo', 'como', 'más', 'o', 'the', 'of', 'and',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9áéíóúñü]+/i)
    .filter((t) => t.length > 2 && !STOP.has(t))
}

function scoreDoc(queryTokens: string[], doc: CompanyDocument): number {
  const hay = tokenize(`${doc.title} ${doc.content} ${doc.tags.join(' ')}`)
  let score = 0
  for (const t of queryTokens) {
    if (hay.includes(t)) score += 2
    else if (hay.some((h) => h.includes(t) || t.includes(h))) score += 1
  }
  if (doc.approved) score += 0.5
  return score
}

/** Solo documentación interna aprobada de la compañía */
export function searchInternalDocs(
  query: string,
  documents: CompanyDocument[],
  opts?: { productIds?: string[]; campaignId?: string },
): CompanyDocument[] {
  const tokens = tokenize(query)
  if (!tokens.length) return []

  return documents
    .filter((d) => d.approved)
    .filter((d) => {
      if (opts?.campaignId && d.campaignId && d.campaignId !== opts.campaignId) {
        // allow product-level docs without campaign lock
      }
      if (opts?.productIds?.length && d.productId) {
        return opts.productIds.includes(d.productId) || !d.productId
      }
      return true
    })
    .map((d) => ({ d, s: scoreDoc(tokens, d) }))
    .filter((x) => x.s >= 2)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((x) => x.d)
}

function detectEscalationDept(query: string): EscalationDept {
  const q = query.toLowerCase()
  if (/legal|demanda|promoci[oó]n enga|publicidad/.test(q)) return 'legal'
  if (/regulator|cofepris|registro|etiqueta|ipp oficial/.test(q)) return 'regulatorio'
  if (/precio|descuento|bonific|comercial|competencia de mercado/.test(q)) return 'comercial'
  return 'medico'
}

const OUT_OF_SCOPE =
  /competidor|otra marca|internet|pubmed|uptodate|wikipedia|chatgpt|opin[ií]on personal|off[- ]label|uso no aprobado|compara(r|ción) con/

function fillTemplate(
  tpl: string,
  ctx: {
    title?: string
    lastName?: string
    firstName?: string
    avatarName: string
    realRepName?: string
  },
) {
  return tpl
    .replaceAll('{title}', ctx.title ?? '')
    .replaceAll('{lastName}', ctx.lastName ?? '')
    .replaceAll('{firstName}', ctx.firstName ?? '')
    .replaceAll('{avatarName}', ctx.avatarName)
    .replaceAll('{realRepName}', ctx.realRepName ?? 'su visitador de territorio')
    .replace(/\s+/g, ' ')
    .trim()
}

export function buildContextualOpener(
  doctor: Doctor | null,
  avatar: AvatarConfig,
  notes: string[],
): string {
  if (!doctor) return ''
  const lastName = doctor.name.split(' ').slice(-1)[0]
  const ctx = { title: doctor.title, lastName, avatarName: avatar.name }

  if (doctor.birthday === '08-12' || notes.some((n) => /cumplea/i.test(n))) {
    return fillTemplate(contextualTips.find((t) => t.type === 'birthday')!.template, ctx)
  }
  if (notes.some((n) => /tr[aá]fico/i.test(n))) {
    return fillTemplate(contextualTips.find((t) => t.type === 'traffic')!.template, ctx)
  }
  if (notes.some((n) => /temperatura|fr[ií]o|clima/i.test(n))) {
    return fillTemplate(contextualTips.find((t) => t.type === 'weather')!.template, ctx)
  }
  return fillTemplate(contextualTips.find((t) => t.type === 'event')!.template, ctx)
}

export interface ReplyContext {
  campaign: Campaign
  avatar: AvatarConfig
  products: Product[]
  documents: CompanyDocument[]
  doctor?: Doctor | null
  pharmacy?: PharmacyStaff | null
  realRep?: RealRep | null
  history: ConversationMessage[]
  audience: TargetAudience
  contextNotes?: string[]
  isTest?: boolean
}

export interface GovernedReply {
  content: string
  sources: string[]
  escalated: boolean
  escalationDept?: EscalationDept
  ctaShown: boolean
  governanceNotes: string[]
}

export function generateGovernedReply(userText: string, ctx: ReplyContext): GovernedReply {
  const notes: string[] = ['Capa de gobernanza aplicada']
  const lastName = ctx.doctor?.name.split(' ').slice(-1)[0] ?? ''
  const title = ctx.doctor?.title ?? ''
  const firstName = ctx.pharmacy?.name.split(' ')[0] ?? ctx.doctor?.name.split(' ')[0] ?? ''
  const tplCtx = {
    title,
    lastName,
    firstName,
    avatarName: ctx.avatar.name,
    realRepName: ctx.realRep?.name,
  }

  // 1) Out of scope / third-party forbidden
  if (OUT_OF_SCOPE.test(userText.toLowerCase())) {
    const dept = detectEscalationDept(userText)
    notes.push('Bloqueo de fuentes de terceros / fuera de etiqueta')
    return {
      content: `${title} ${lastName}`.trim()
        ? `${title} ${lastName}, no puedo consultar fuentes externas ni emitir información fuera de la documentación aprobada del laboratorio. No dispongo de esa respuesta en este momento; con gusto elevaré su consulta al departamento ${dept} y se la traeré en la próxima visita.`
        : `No puedo consultar fuentes externas ni emitir información no aprobada. Escalaré su consulta al departamento ${dept} para la próxima visita.`,
      sources: [],
      escalated: true,
      escalationDept: dept,
      ctaShown: false,
      governanceNotes: notes,
    }
  }

  const productIds = ctx.campaign.productIds
  const hits = searchInternalDocs(userText, ctx.documents, {
    productIds,
    campaignId: ctx.campaign.id,
  })

  // Campaign intent keywords
  const q = userText.toLowerCase()
  const wantsEvidence = /estudio|evidencia|cl[ií]nico|resultado|eficacia|dato/.test(q)
  const wantsProduct = /producto|presenta|indicaci[oó]n|qu[eé] es|para qu[eé]|perfil|posolog/.test(q)
  const wantsSample = /muestra|sample|enviar|despach/.test(q)
  const greeting = /^(hola|buenos|buenas|saludos|hey)\b/.test(q) || q.length < 12
  const memoryAsk = /anterior|pasada|la otra vez|recuerda|hablamos/.test(q)

  // Memory of past conversations (from doctor summary + history)
  if (memoryAsk && ctx.doctor?.lastVisitSummary) {
    notes.push('Memoria de conversaciones previas')
    return {
      content: `${title} ${lastName}, claro que recuerdo nuestra interacción previa: ${ctx.doctor.lastVisitSummary} Hoy, siguiendo la campaña aprobada, puedo profundizar en lo autorizado para este ciclo.`,
      sources: ['Memoria de visita previa (CRM)'],
      escalated: false,
      ctaShown: false,
      governanceNotes: notes,
    }
  }

  if (greeting || ctx.history.filter((m) => m.role === 'user').length === 0) {
    notes.push('Script de campaña — apertura')
    const tip = ctx.doctor
      ? buildContextualOpener(ctx.doctor, ctx.avatar, ctx.contextNotes ?? [])
      : ''
    const opening = fillTemplate(ctx.campaign.script.opening, tplCtx)
    const support =
      ctx.audience === 'covered_doctors' && ctx.campaign.script.supportRepMention && ctx.realRep
        ? ` Mi rol es apoyar la labor de ${ctx.realRep.name}; en ningún momento busco reemplazarlo.`
        : ''
    const body = [
      opening + support,
      tip,
      fillTemplate(ctx.campaign.script.productPresentation, tplCtx),
    ]
      .filter(Boolean)
      .join('\n\n')

    return {
      content: body,
      sources: ['Script de campaña aprobado', ...productIds.map((id) => `Producto ${id}`)],
      escalated: false,
      ctaShown: false,
      governanceNotes: notes,
    }
  }

  if (wantsSample) {
    notes.push('CTA de muestra dentro de campaña')
    return {
      content: `${title || firstName} ${lastName}`.trim() +
        `, con gusto. Puede usar el botón de solicitud de muestra médica; el despacho se realiza con un mensaje personalizado a su nombre. ` +
        fillTemplate(ctx.campaign.script.closing, tplCtx),
      sources: ['CTA campaña', 'Servicio de entrega de MM'],
      escalated: false,
      ctaShown: true,
      governanceNotes: notes,
    }
  }

  if (wantsEvidence || wantsProduct) {
    if (!hits.length) {
      const dept = detectEscalationDept(userText)
      notes.push('Sin hit en corpus interno — anti-alucinación')
      return {
        content: `${title} ${lastName}`.trim()
          ? `${title} ${lastName}, no dispongo de esa información en la documentación aprobada del laboratorio en este momento. Haré la consulta al departamento ${dept} y con mucho gusto le traeré la respuesta en su próxima visita.`
          : `No dispongo de esa información en el corpus aprobado. Escalaré al departamento ${dept} para la próxima visita.`,
        sources: [],
        escalated: true,
        escalationDept: dept,
        ctaShown: false,
        governanceNotes: notes,
      }
    }

    notes.push('Respuesta anclada a documentación interna')
    const scriptPart = wantsEvidence
      ? fillTemplate(ctx.campaign.script.clinicalEvidence, tplCtx)
      : fillTemplate(ctx.campaign.script.productPresentation, tplCtx)

    const excerpts = hits
      .map((h) => `• ${h.title} (v${h.version}): ${h.content.slice(0, 220)}…`)
      .join('\n')

    const probe = fillTemplate(ctx.campaign.script.probingQuestion, tplCtx)

    return {
      content: `${scriptPart}\n\nSegún documentación interna:\n${excerpts}\n\n${probe}`,
      sources: hits.map((h) => h.title),
      escalated: false,
      ctaShown: true,
      governanceNotes: notes,
    }
  }

  // Generic in-campaign fallback with internal search
  if (hits.length) {
    notes.push('Fidelidad a campaña + RAG interno')
    const probe = fillTemplate(ctx.campaign.script.probingQuestion, tplCtx)
    return {
      content: `${fillTemplate(ctx.campaign.script.expectedResults, tplCtx)}\n\n${hits
        .map((h) => `Con base en «${h.title}»: ${h.content.slice(0, 180)}…`)
        .join('\n\n')}\n\n${probe}`,
      sources: hits.map((h) => h.title),
      escalated: false,
      ctaShown: true,
      governanceNotes: notes,
    }
  }

  const dept = detectEscalationDept(userText)
  notes.push('Fuera de límites de información — escalamiento')
  return {
    content: `${title} ${lastName}`.trim()
      ? `${title} ${lastName}, en este momento no dispongo de esa información dentro de la documentación y la campaña aprobadas. Preferimos no improvisar: consultaré con el departamento ${dept} y le traeré la respuesta en la próxima visita.`
      : `No dispongo de esa información en el material aprobado. Consultaré al departamento ${dept} y le responderé en la próxima visita.`,
    sources: [],
    escalated: true,
    escalationDept: dept,
    ctaShown: false,
    governanceNotes: notes,
  }
}

export function startVisitOpening(ctx: ReplyContext): GovernedReply {
  return generateGovernedReply('hola', ctx)
}
