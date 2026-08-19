export type TargetAudience = 'covered_doctors' | 'uncovered_doctors' | 'pharmacy_staff'
export type Channel = 'whatsapp' | 'email' | 'sms'
export type CampaignStatus = 'draft' | 'testing' | 'approved' | 'live' | 'paused' | 'completed'
export type DocType = 'product_profile' | 'prescribing_info' | 'clinical_study' | 'visual_aid' | 'campaign_script' | 'legal' | 'medical' | 'training'
export type EscalationDept = 'medico' | 'legal' | 'regulatorio' | 'comercial'
export type Gender = 'femenino' | 'masculino' | 'neutro'
export type AccentRegion = 'cdmx' | 'norte' | 'bajio' | 'sur' | 'caribe' | 'andino' | 'rioplatense' | 'neutro'
export type MessageRole = 'avatar' | 'user' | 'system'
export type CtaType = 'sample_request' | 'event_rsvp' | 'material_request' | 'certificate' | 'callback'

export interface GovernanceRule {
  id: string
  title: string
  description: string
  enforced: boolean
  priority: number
}

export interface CompanyDocument {
  id: string
  title: string
  type: DocType
  productId?: string
  campaignId?: string
  content: string
  tags: string[]
  version: string
  approved: boolean
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  brand: string
  molecule: string
  therapeuticArea: string
  indication: string
  keyMessages: string[]
  studies: string[]
  sampleAvailable: boolean
}

export interface AvatarConfig {
  id: string
  name: string
  gender: Gender
  skinTone: string
  traits: string
  accent: AccentRegion
  attire: string
  region: string
  personality: string
  photoGradient: string
  active: boolean
}

export interface RealRep {
  id: string
  name: string
  territory: string
  specialtyFocus: string[]
}

export interface Doctor {
  id: string
  name: string
  title: string
  specialty: string
  city: string
  zone: string
  covered: boolean
  realRepId?: string
  birthday?: string
  phone?: string
  email?: string
  lastVisitSummary?: string
  tags: string[]
}

export interface PharmacyStaff {
  id: string
  name: string
  pharmacy: string
  city: string
  role: string
  phone?: string
  email?: string
}

export interface CampaignScript {
  opening: string
  productPresentation: string
  clinicalEvidence: string
  expectedResults: string
  probingQuestion: string
  closing: string
  supportRepMention: boolean
}

export interface CampaignCta {
  type: CtaType
  label: string
  productId?: string
}

export interface Campaign {
  id: string
  name: string
  productIds: string[]
  avatarId: string
  audience: TargetAudience
  status: CampaignStatus
  cycle: string
  script: CampaignScript
  ctas: CampaignCta[]
  channels: Channel[]
  filters: AudienceFilter
  multiProduct: boolean
  testedAt?: string
  approvedAt?: string
  createdAt: string
}

export interface AudienceFilter {
  all?: boolean
  specialties?: string[]
  zones?: string[]
  cities?: string[]
  realRepIds?: string[]
  tags?: string[]
  coveredOnly?: boolean
  uncoveredOnly?: boolean
  doctorIds?: string[]
  pharmacyIds?: string[]
}

export interface ConversationMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  sources?: string[]
  escalated?: boolean
  escalationDept?: EscalationDept
  ctaShown?: boolean
}

export interface VisitSession {
  id: string
  campaignId: string
  targetType: TargetAudience
  targetId: string
  avatarId: string
  channel: Channel
  startedAt?: string
  endedAt?: string
  opened: boolean
  messages: ConversationMessage[]
  ctaClicks: { type: CtaType; at: string; productId?: string }[]
  materialsRequested: string[]
  contextNotes: string[]
}

export interface DispatchJob {
  id: string
  campaignId: string
  channel: Channel
  recipientCount: number
  sentAt: string
  costCredits: number
  status: 'queued' | 'sent' | 'failed'
}

export interface CreditAccount {
  balance: number
  costPerVisit: number
  costPerCta?: number
  currency: string
  transactions: CreditTx[]
}

export interface CreditTx {
  id: string
  type: 'topup' | 'visit' | 'cta' | 'setup'
  amount: number
  label: string
  at: string
}

export interface AnalyticsSnapshot {
  sent: number
  opened: number
  engaged: number
  ctaClicks: number
  samplesRequested: number
  reachRate: number
  engagementRate: number
  byChannel: { channel: Channel; sent: number; opened: number }[]
  bySpecialty: { specialty: string; opened: number }[]
  daily: { date: string; opens: number; ctas: number }[]
}

export interface AcademyModule {
  id: string
  title: string
  description: string
  audience: TargetAudience | 'avatar_trainer'
  lessons: AcademyLesson[]
  certificateTitle?: string
}

export interface AcademyLesson {
  id: string
  title: string
  content: string
  durationMin: number
  completed?: boolean
}

export interface TrainerStyle {
  id: string
  trainerName: string
  accent: AccentRegion
  speakingStyle: string
  samplePhrases: string[]
  notes: string
}

export interface TerritoryInsight {
  repId: string
  zone: string
  totalDoctors: number
  covered: number
  highPotentialUncovered: number
  topSpecialties: { name: string; count: number }[]
  suggestedActions: string[]
  lastCyclePerformance: { visits: number; samples: number; events: number }
}

export interface ContextualTip {
  id: string
  type: 'weather' | 'traffic' | 'event' | 'birthday' | 'custom'
  template: string
}

export type Permission = 'all' | 'view_dashboard' | 'view_governance' | 'view_avatars' | 'view_products' | 'view_campaigns' | 'view_crm' | 'view_analytics' | 'view_credits' | 'view_academy' | 'view_territory' | 'view_visit' | 'view_campaign_test' | 'view_settings' | 'manage_users';

export interface User {
  id: string;
  name: string;
  email: string;
  permissions: Permission[];
}
