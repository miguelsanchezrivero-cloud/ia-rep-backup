import { create } from "zustand";
import {
  academyModules,
  analytics,
  avatars,
  campaigns as seedCampaigns,
  creditAccount as seedCredits,
  dispatches as seedDispatches,
  doctors,
  documents as seedDocuments,
  pharmacyStaff,
  products,
  realReps,
  territoryInsights,
  trainerStyles,
  governanceRules,
} from "../data/mock";
import type {
  AvatarConfig,
  Campaign,
  CampaignStatus,
  Channel,
  CompanyDocument,
  ConversationMessage,
  CreditAccount,
  DispatchJob,
  VisitSession,
  CtaType,
} from "../types";
import {
  estimateAudienceSize,
  filterDoctors,
  filterPharmacy,
} from "../lib/audience";
import { generateGovernedReply, startVisitOpening } from "../lib/governance";

interface AppState {
  governanceRules: typeof governanceRules;
  products: typeof products;
  documents: CompanyDocument[];
  avatars: AvatarConfig[];
  doctors: typeof doctors;
  pharmacyStaff: typeof pharmacyStaff;
  realReps: typeof realReps;
  campaigns: Campaign[];
  credits: CreditAccount;
  analytics: typeof analytics;
  academyModules: typeof academyModules;
  trainerStyles: typeof trainerStyles;
  territoryInsights: typeof territoryInsights;
  dispatches: DispatchJob[];
  activeVisit: VisitSession | null;
  testSession: VisitSession | null;

  addDocument: (doc: CompanyDocument) => void;
  upsertAvatar: (avatar: AvatarConfig) => void;
  upsertCampaign: (campaign: Campaign) => void;
  setCampaignStatus: (id: string, status: CampaignStatus) => void;
  deleteCampaign: (id: string) => void;
  setRuleEnforcement: (id: string, enforced: boolean) => void;
  topUpCredits: (amount: number) => void;
  dispatchCampaign: (
    campaignId: string,
    channel: Channel,
  ) => { ok: boolean; message: string };
  startTestSession: (campaignId: string) => void;
  sendTestMessage: (text: string) => void;
  startDoctorVisit: (
    campaignId: string,
    doctorId: string,
    channel?: Channel,
  ) => void;
  startPharmacyVisit: (campaignId: string, pharmacyId: string) => void;
  sendVisitMessage: (text: string) => void;
  clickCta: (type: CtaType, productId?: string) => void;
  endVisit: () => void;
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function msg(
  role: ConversationMessage["role"],
  content: string,
  extra?: Partial<ConversationMessage>,
): ConversationMessage {
  return {
    id: uid("m"),
    role,
    content,
    timestamp: new Date().toISOString(),
    ...extra,
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  governanceRules,
  products,
  documents: seedDocuments,
  avatars,
  doctors,
  pharmacyStaff,
  realReps,
  campaigns: seedCampaigns,
  credits: seedCredits,
  analytics,
  academyModules,
  trainerStyles,
  territoryInsights,
  dispatches: seedDispatches,
  activeVisit: null,
  testSession: null,

  addDocument: (doc) => set((s) => ({ documents: [doc, ...s.documents] })),

  upsertAvatar: (avatar) =>
    set((s) => {
      const exists = s.avatars.some((a) => a.id === avatar.id);
      return {
        avatars: exists
          ? s.avatars.map((a) => (a.id === avatar.id ? avatar : a))
          : [...s.avatars, avatar],
      };
    }),

  upsertCampaign: (campaign) =>
    set((s) => {
      const exists = s.campaigns.some((c) => c.id === campaign.id);
      return {
        campaigns: exists
          ? s.campaigns.map((c) => (c.id === campaign.id ? campaign : c))
          : [campaign, ...s.campaigns],
      };
    }),

  setCampaignStatus: (id, status) =>
    set((s) => ({
      campaigns: s.campaigns.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              testedAt:
                status === "testing" || status === "approved"
                  ? (c.testedAt ?? new Date().toISOString())
                  : c.testedAt,
              approvedAt:
                status === "approved" || status === "live"
                  ? new Date().toISOString()
                  : c.approvedAt,
            }
          : c,
      ),
    })),

  deleteCampaign: (id: string) => {
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.id !== id),
    }));
  },

  setRuleEnforcement: (id, enforced) =>
    set((s) => ({
      governanceRules: s.governanceRules.map((r) =>
        r.id === id ? { ...r, enforced } : r,
      ),
    })),

  topUpCredits: (amount) =>
    set((s) => ({
      credits: {
        ...s.credits,
        balance: s.credits.balance + amount,
        transactions: [
          {
            id: uid("tx"),
            type: "topup",
            amount,
            label: `Carga de saldo (+${amount})`,
            at: new Date().toISOString().slice(0, 10),
          },
          ...s.credits.transactions,
        ],
      },
    })),

  dispatchCampaign: (campaignId, channel) => {
    const s = get();
    const campaign = s.campaigns.find((c) => c.id === campaignId);
    if (!campaign) return { ok: false, message: "Campaña no encontrada" };
    if (campaign.status !== "approved" && campaign.status !== "live") {
      return {
        ok: false,
        message: "La campaña debe estar aprobada (go final) antes del envío",
      };
    }
    const recipients = estimateAudienceSize(
      campaign,
      s.doctors,
      s.pharmacyStaff,
    );
    if (!recipients)
      return { ok: false, message: "La audiencia filtrada está vacía" };
    const cost = recipients * s.credits.costPerVisit;
    if (s.credits.balance < cost) {
      return {
        ok: false,
        message: `Saldo insuficiente. Necesita ${cost} créditos`,
      };
    }

    const job: DispatchJob = {
      id: uid("disp"),
      campaignId,
      channel,
      recipientCount: recipients,
      sentAt: new Date().toISOString(),
      costCredits: cost,
      status: "sent",
    };

    set({
      dispatches: [job, ...s.dispatches],
      credits: {
        ...s.credits,
        balance: s.credits.balance - cost,
        transactions: [
          {
            id: uid("tx"),
            type: "visit",
            amount: -cost,
            label: `Envío ${campaign.name} (${recipients} visitas · ${channel})`,
            at: new Date().toISOString().slice(0, 10),
          },
          ...s.credits.transactions,
        ],
      },
      campaigns: s.campaigns.map((c) =>
        c.id === campaignId ? { ...c, status: "live" as const } : c,
      ),
      analytics: {
        ...s.analytics,
        sent: s.analytics.sent + recipients,
      },
    });

    return {
      ok: true,
      message: `Enviado a ${recipients} destinatarios por ${channel}. Costo: ${cost} créditos.`,
    };
  },

  startTestSession: (campaignId) => {
    const s = get();
    const campaign = s.campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;
    const avatar =
      s.avatars.find((a) => a.id === campaign.avatarId) ?? s.avatars[0];
    const audienceDocs = filterDoctors(s.doctors, campaign);
    const doctor = audienceDocs[0] ?? s.doctors[0];
    const realRep = s.realReps.find((r) => r.id === doctor.realRepId) ?? null;

    const session: VisitSession = {
      id: uid("test"),
      campaignId,
      targetType: campaign.audience,
      targetId: doctor.id,
      avatarId: avatar.id,
      channel: campaign.channels[0] ?? "whatsapp",
      opened: true,
      startedAt: new Date().toISOString(),
      messages: [],
      ctaClicks: [],
      materialsRequested: [],
      contextNotes: ["Modo prueba de campaña"],
    };

    const opening = startVisitOpening({
      campaign,
      avatar,
      products: s.products.filter((p) => campaign.productIds.includes(p.id)),
      documents: s.documents,
      doctor,
      realRep,
      history: [],
      audience: campaign.audience,
      contextNotes: session.contextNotes,
      isTest: true,
    });

    session.messages = [
      msg(
        "system",
        "Modo prueba — valide script, objeciones y límites de gobernanza",
      ),
      msg("avatar", opening.content, {
        sources: opening.sources,
        escalated: opening.escalated,
        escalationDept: opening.escalationDept,
        ctaShown: opening.ctaShown,
      }),
    ];

    set({
      testSession: session,
      campaigns: s.campaigns.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              status: c.status === "draft" ? "testing" : c.status,
              testedAt: new Date().toISOString(),
            }
          : c,
      ),
    });
  },

  sendTestMessage: (text) => {
    const s = get();
    const session = s.testSession;
    if (!session || !text.trim()) return;
    const campaign = s.campaigns.find((c) => c.id === session.campaignId)!;
    const avatar = s.avatars.find((a) => a.id === session.avatarId)!;
    const doctor = s.doctors.find((d) => d.id === session.targetId) ?? null;
    const realRep = doctor
      ? (s.realReps.find((r) => r.id === doctor.realRepId) ?? null)
      : null;

    const userMessage = msg("user", text.trim());
    const history = [...session.messages, userMessage];
    const reply = generateGovernedReply(text, {
      campaign,
      avatar,
      products: s.products.filter((p) => campaign.productIds.includes(p.id)),
      documents: s.documents,
      doctor,
      realRep,
      history,
      audience: campaign.audience,
      contextNotes: session.contextNotes,
      isTest: true,
    });

    set({
      testSession: {
        ...session,
        messages: [
          ...history,
          msg("avatar", reply.content, {
            sources: reply.sources,
            escalated: reply.escalated,
            escalationDept: reply.escalationDept,
            ctaShown: reply.ctaShown,
          }),
        ],
      },
    });
  },

  startDoctorVisit: (campaignId, doctorId, channel = "whatsapp") => {
    const s = get();
    const campaign = s.campaigns.find((c) => c.id === campaignId);
    const doctor = s.doctors.find((d) => d.id === doctorId);
    if (!campaign || !doctor) return;
    const avatar =
      s.avatars.find((a) => a.id === campaign.avatarId) ?? s.avatars[0];
    const realRep = s.realReps.find((r) => r.id === doctor.realRepId) ?? null;

    const session: VisitSession = {
      id: uid("visit"),
      campaignId,
      targetType: doctor.covered ? "covered_doctors" : "uncovered_doctors",
      targetId: doctor.id,
      avatarId: avatar.id,
      channel,
      opened: true,
      startedAt: new Date().toISOString(),
      messages: [],
      ctaClicks: [],
      materialsRequested: [],
      contextNotes:
        doctor.birthday === "08-12"
          ? ["Cumpleaños hoy"]
          : ["Tráfico moderado en sector"],
    };

    const opening = startVisitOpening({
      campaign,
      avatar,
      products: s.products.filter((p) => campaign.productIds.includes(p.id)),
      documents: s.documents,
      doctor,
      realRep,
      history: [],
      audience: session.targetType,
      contextNotes: session.contextNotes,
    });

    session.messages = [
      msg("avatar", opening.content, {
        sources: opening.sources,
        ctaShown: opening.ctaShown,
      }),
    ];

    set({
      activeVisit: session,
      analytics: {
        ...s.analytics,
        opened: s.analytics.opened + 1,
      },
    });
  },

  startPharmacyVisit: (campaignId, pharmacyId) => {
    const s = get();
    const campaign = s.campaigns.find((c) => c.id === campaignId);
    const pharmacy = s.pharmacyStaff.find((p) => p.id === pharmacyId);
    if (!campaign || !pharmacy) return;
    const avatar =
      s.avatars.find((a) => a.id === campaign.avatarId) ?? s.avatars[0];

    const session: VisitSession = {
      id: uid("visit"),
      campaignId,
      targetType: "pharmacy_staff",
      targetId: pharmacy.id,
      avatarId: avatar.id,
      channel: "whatsapp",
      opened: true,
      startedAt: new Date().toISOString(),
      messages: [],
      ctaClicks: [],
      materialsRequested: [],
      contextNotes: [],
    };

    const opening = startVisitOpening({
      campaign,
      avatar,
      products: s.products.filter((p) => campaign.productIds.includes(p.id)),
      documents: s.documents,
      pharmacy,
      history: [],
      audience: "pharmacy_staff",
    });

    session.messages = [
      msg("avatar", opening.content, { sources: opening.sources }),
    ];
    set({ activeVisit: session });
  },

  sendVisitMessage: (text) => {
    const s = get();
    const session = s.activeVisit;
    if (!session || !text.trim()) return;
    const campaign = s.campaigns.find((c) => c.id === session.campaignId)!;
    const avatar = s.avatars.find((a) => a.id === session.avatarId)!;
    const doctor = s.doctors.find((d) => d.id === session.targetId) ?? null;
    const pharmacy =
      s.pharmacyStaff.find((p) => p.id === session.targetId) ?? null;
    const realRep = doctor
      ? (s.realReps.find((r) => r.id === doctor.realRepId) ?? null)
      : null;

    const userMessage = msg("user", text.trim());
    const history = [...session.messages, userMessage];
    const reply = generateGovernedReply(text, {
      campaign,
      avatar,
      products: s.products.filter((p) => campaign.productIds.includes(p.id)),
      documents: s.documents,
      doctor,
      pharmacy,
      realRep,
      history,
      audience: session.targetType,
      contextNotes: session.contextNotes,
    });

    set({
      activeVisit: {
        ...session,
        messages: [
          ...history,
          msg("avatar", reply.content, {
            sources: reply.sources,
            escalated: reply.escalated,
            escalationDept: reply.escalationDept,
            ctaShown: reply.ctaShown,
          }),
        ],
      },
      analytics: {
        ...s.analytics,
        engaged: s.analytics.engaged + 1,
      },
    });
  },

  clickCta: (type, productId) => {
    const s = get();
    const session = s.activeVisit ?? s.testSession;
    if (!session) return;
    const key = s.activeVisit ? "activeVisit" : "testSession";
    const product = s.products.find((p) => p.id === productId);
    const label =
      type === "sample_request"
        ? `Solicitud de muestra${product ? ` de ${product.name}` : ""} registrada. Se despachará con mensaje personalizado.`
        : type === "event_rsvp"
          ? "Asistencia al evento confirmada. ¡Gracias!"
          : type === "certificate"
            ? "Certificado generado. Puede descargarlo desde Academia."
            : "Solicitud registrada.";

    const updated: VisitSession = {
      ...session,
      ctaClicks: [
        ...session.ctaClicks,
        { type, at: new Date().toISOString(), productId },
      ],
      materialsRequested:
        type === "sample_request" && productId
          ? [...session.materialsRequested, productId]
          : session.materialsRequested,
      messages: [...session.messages, msg("system", label)],
    };

    set({
      [key]: updated,
      analytics: {
        ...s.analytics,
        ctaClicks: s.analytics.ctaClicks + 1,
        samplesRequested:
          s.analytics.samplesRequested + (type === "sample_request" ? 1 : 0),
      },
    } as Partial<AppState>);
  },

  endVisit: () => set({ activeVisit: null }),
}));

export function getCampaignAudienceCount(campaign: Campaign) {
  const s = useAppStore.getState();
  if (campaign.audience === "pharmacy_staff")
    return filterPharmacy(s.pharmacyStaff, campaign).length;
  return filterDoctors(s.doctors, campaign).length;
}
