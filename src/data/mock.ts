import type {
  AnalyticsSnapshot,
  AvatarConfig,
  Campaign,
  CompanyDocument,
  ContextualTip,
  CreditAccount,
  Doctor,
  GovernanceRule,
  PharmacyStaff,
  Product,
  RealRep,
  TerritoryInsight,
  TrainerStyle,
  AcademyModule,
  DispatchJob,
  VisitSession,
} from '../types'

export const governanceRules: GovernanceRule[] = [
  {
    id: 'gov-1',
    title: 'Capa de gobernanza prioritaria',
    description:
      'Toda respuesta debe pasar por políticas de compliance, ética promocional y límites regulatorios del laboratorio antes de emitirse.',
    enforced: true,
    priority: 1,
  },
  {
    id: 'gov-2',
    title: 'Fidelidad a la campaña',
    description:
      'El VM solo comunica el script, mensajes clave y CTAs aprobados por el gerente de producto para el ciclo vigente.',
    enforced: true,
    priority: 2,
  },
  {
    id: 'gov-3',
    title: 'Fuentes internas exclusivas',
    description:
      'La búsqueda de información se limita a documentación aprobada de la compañía. Prohibido usar fuentes de terceros o conocimiento general no validado.',
    enforced: true,
    priority: 3,
  },
  {
    id: 'gov-4',
    title: 'Anti-alucinación y escalamiento',
    description:
      'Si la pregunta sale del corpus aprobado, el VM no inventa: indica que no dispone de la información y escala a médico, legal u otro departamento para la próxima visita.',
    enforced: true,
    priority: 4,
  },
  {
    id: 'gov-5',
    title: 'Apoyo al visitador real',
    description:
      'En médicos ya cubiertos, el VM siempre menciona que apoya la labor del visitador humano y no lo reemplaza.',
    enforced: true,
    priority: 5,
  },
  {
    id: 'gov-6',
    title: 'Cortesía y tono profesional',
    description:
      'Trato educado, amigable y respetuoso. Personalización con nombre del médico y memoria de conversaciones previas.',
    enforced: true,
    priority: 6,
  },
]

export const products: Product[] = [
  {
    id: 'prod-cardioflex',
    name: 'CardioFlex XR',
    brand: 'CardioFlex',
    molecule: 'Atenolol / Indapamida',
    therapeuticArea: 'Cardiología',
    indication: 'Hipertensión arterial esencial',
    keyMessages: [
      'Control sostenido de la PA durante 24 horas',
      'Buena tolerabilidad en pacientes adultos',
      'Respaldo de evidencia clínica multicéntrica',
    ],
    studies: ['doc-study-cf-01'],
    sampleAvailable: true,
  },
  {
    id: 'prod-respirax',
    name: 'Respirax Kids',
    brand: 'Respirax',
    molecule: 'Montelukast',
    therapeuticArea: 'Pediatría / Neumología',
    indication: 'Asma y rinitis alérgica en pediatría',
    keyMessages: [
      'Facilidad de administración pediátrica',
      'Mejora en control de síntomas diurnos y nocturnos',
      'Perfil de seguridad documentado',
    ],
    studies: ['doc-study-rx-01'],
    sampleAvailable: true,
  },
  {
    id: 'prod-gastropro',
    name: 'GastroPro',
    brand: 'GastroPro',
    molecule: 'Pantoprazol',
    therapeuticArea: 'Gastroenterología',
    indication: 'ERGE y úlcera péptica',
    keyMessages: [
      'Alivio sintomático rápido',
      'Protección mucosa gástrica',
      'Amplia experiencia de uso',
    ],
    studies: ['doc-study-gp-01'],
    sampleAvailable: true,
  },
]

export const documents: CompanyDocument[] = [
  {
    id: 'doc-profile-cf',
    title: 'Perfil de producto CardioFlex XR',
    type: 'product_profile',
    productId: 'prod-cardioflex',
    content:
      'CardioFlex XR combina atenolol e indapamida en liberación prolongada para el manejo de hipertensión arterial esencial en adultos. Dosis habitual según ficha técnica aprobada. No exceder posología indicada en IPP.',
    tags: ['hipertensión', 'cardiología', 'perfil'],
    version: '3.1',
    approved: true,
    updatedAt: '2026-07-01',
  },
  {
    id: 'doc-ipp-cf',
    title: 'Información para prescribir CardioFlex XR',
    type: 'prescribing_info',
    productId: 'prod-cardioflex',
    content:
      'Indicaciones: hipertensión arterial esencial. Contraindicaciones: bradicardia sinusal, bloqueo AV de 2.º/3.er grado, insuficiencia cardiaca no controlada, hipersensibilidad a componentes. Advertencias: monitorear frecuencia cardiaca y electrolitos. Embarazo: consultar IPP completa.',
    tags: ['ipp', 'contraindicaciones', 'posología'],
    version: '3.1',
    approved: true,
    updatedAt: '2026-07-01',
  },
  {
    id: 'doc-study-cf-01',
    title: 'Estudio CLIN-CF-2024: reducción de PA sistólica',
    type: 'clinical_study',
    productId: 'prod-cardioflex',
    content:
      'Estudio multicéntrico aleatorizado n=842. CardioFlex XR logró reducción media de PAS de 18.4 mmHg a 12 semanas vs baseline (p<0.01). Perfil de eventos adversos comparable a control activo. Resultados limitados a población adulta con HTA esencial según criterios de inclusión del protocolo.',
    tags: ['estudio', 'eficacia', 'seguridad'],
    version: '1.0',
    approved: true,
    updatedAt: '2026-06-15',
  },
  {
    id: 'doc-va-cf',
    title: 'Visual Aid ciclo Q3 CardioFlex',
    type: 'visual_aid',
    productId: 'prod-cardioflex',
    campaignId: 'camp-cf-q3',
    content:
      'Pieza visual: control 24h, gráfica de reducción PAS, mención de estudio CLIN-CF-2024, llamada a solicitud de muestra. No incluir comparaciones no aprobadas.',
    tags: ['visual aid', 'q3'],
    version: '1.2',
    approved: true,
    updatedAt: '2026-08-01',
  },
  {
    id: 'doc-script-cf',
    title: 'Script campaña Q3 CardioFlex',
    type: 'campaign_script',
    productId: 'prod-cardioflex',
    campaignId: 'camp-cf-q3',
    content:
      'Apertura cortés + tip contextual. Presentar CardioFlex XR como apoyo al control sostenido. Mencionar CLIN-CF-2024 (reducción PAS 18.4 mmHg). Pregunta de sondeo sobre pacientes candidatos. CTA muestra. En cubiertos: apoyar a visitador real.',
    tags: ['script', 'campaña'],
    version: '2.0',
    approved: true,
    updatedAt: '2026-08-02',
  },
  {
    id: 'doc-profile-rx',
    title: 'Perfil Respirax Kids',
    type: 'product_profile',
    productId: 'prod-respirax',
    content:
      'Respirax Kids (montelukast) indicado en asma y rinitis alérgica pediátrica según IPP. Presentación pediátrica. Mensajes centrados en adherencia y control de síntomas.',
    tags: ['pediatría', 'asma'],
    version: '2.0',
    approved: true,
    updatedAt: '2026-05-20',
  },
  {
    id: 'doc-study-rx-01',
    title: 'Estudio PED-RX-15 control sintomático',
    type: 'clinical_study',
    productId: 'prod-respirax',
    content:
      'Estudio pediátrico n=320. Mejora significativa en score de síntomas nocturnos a 8 semanas. No extrapolar a poblaciones fuera de etiqueta.',
    tags: ['pediatría', 'estudio'],
    version: '1.0',
    approved: true,
    updatedAt: '2026-04-10',
  },
  {
    id: 'doc-profile-gp',
    title: 'Perfil GastroPro',
    type: 'product_profile',
    productId: 'prod-gastropro',
    content:
      'GastroPro (pantoprazol) para ERGE y úlcera péptica. Mensaje: alivio y protección mucosa según ficha aprobada.',
    tags: ['gastro', 'erge'],
    version: '1.5',
    approved: true,
    updatedAt: '2026-03-01',
  },
  {
    id: 'doc-study-gp-01',
    title: 'Estudio GP-ERGE-09',
    type: 'clinical_study',
    productId: 'prod-gastropro',
    content:
      'Remisión sintomática en mayoría de pacientes con ERGE a 4 semanas en cohorte observada. Datos según protocolo interno aprobado.',
    tags: ['erge', 'estudio'],
    version: '1.0',
    approved: true,
    updatedAt: '2026-02-12',
  },
  {
    id: 'doc-train-pharma',
    title: 'Módulo dependientes: recomendación responsable',
    type: 'training',
    content:
      'Capacitación para dependientes de farmacia: identificación de necesidad, recordación de marca, derivación al médico cuando corresponda, sin diagnóstico. Enfoque en profesionalización y servicio al paciente.',
    tags: ['farmacia', 'entrenamiento'],
    version: '1.0',
    approved: true,
    updatedAt: '2026-07-20',
  },
]

export const avatars: AvatarConfig[] = [
  {
    id: 'av-sofia-cdmx',
    name: 'Sofía Mendoza',
    gender: 'femenino',
    skinTone: 'media',
    traits: 'rasgos latinos, sonrisa cálida, cabello castaño',
    accent: 'cdmx',
    attire: 'blazer teal y blusa blanca',
    region: 'Ciudad de México',
    personality: 'cercana, profesional, empática',
    photoGradient: 'from-teal-400 to-cyan-700',
    active: true,
  },
  {
    id: 'av-diego-norte',
    name: 'Diego Rivas',
    gender: 'masculino',
    skinTone: 'clara-media',
    traits: 'rasgos norteños, porte confiado',
    accent: 'norte',
    attire: 'camisa formal azul y saco gris',
    region: 'Norte de México',
    personality: 'directo, amable, confiable',
    photoGradient: 'from-sky-400 to-indigo-700',
    active: true,
  },
  {
    id: 'av-valentina-andina',
    name: 'Valentina Cruz',
    gender: 'femenino',
    skinTone: 'media-oscura',
    traits: 'rasgos andinos, expresión serena',
    accent: 'andino',
    attire: 'vestimenta corporativa vino y beige',
    region: 'Región Andina',
    personality: 'educada, cálida, precisa',
    photoGradient: 'from-rose-400 to-fuchsia-800',
    active: true,
  },
]

export const realReps: RealRep[] = [
  { id: 'rep-ana', name: 'Ana Torres', territory: 'CDMX Sur', specialtyFocus: ['Pediatría', 'Cardiología'] },
  { id: 'rep-luis', name: 'Luis Herrera', territory: 'Monterrey', specialtyFocus: ['Cardiología', 'Medicina Interna'] },
  { id: 'rep-maria', name: 'María Peña', territory: 'CDMX Norte', specialtyFocus: ['Gastroenterología'] },
]

export const doctors: Doctor[] = [
  {
    id: 'doc-abad',
    name: 'Carlos Abad',
    title: 'Dr.',
    specialty: 'Cardiología',
    city: 'Ciudad de México',
    zone: 'CDMX Sur',
    covered: true,
    realRepId: 'rep-ana',
    birthday: '08-12',
    phone: '+52 55 1000 1001',
    email: 'dr.abad@clinica.mx',
    lastVisitSummary: 'Interesado en control de PA en adultos mayores; solicitó visual aid.',
    tags: ['productivo', 'evento-q3'],
  },
  {
    id: 'doc-ruiz',
    name: 'Elena Ruiz',
    title: 'Dra.',
    specialty: 'Pediatría',
    city: 'Ciudad de México',
    zone: 'CDMX Sur',
    covered: true,
    realRepId: 'rep-ana',
    phone: '+52 55 1000 1002',
    email: 'dra.ruiz@pediatria.mx',
    lastVisitSummary: 'Alta prescripción en asma pediátrica.',
    tags: ['pediatría', 'evento-q3'],
  },
  {
    id: 'doc-mora',
    name: 'Jorge Mora',
    title: 'Dr.',
    specialty: 'Pediatría',
    city: 'Ciudad de México',
    zone: 'CDMX Sur',
    covered: true,
    realRepId: 'rep-ana',
    phone: '+52 55 1000 1003',
    email: 'dr.mora@salud.mx',
    tags: ['pediatría'],
  },
  {
    id: 'doc-salinas',
    name: 'Patricia Salinas',
    title: 'Dra.',
    specialty: 'Cardiología',
    city: 'Monterrey',
    zone: 'Norte',
    covered: true,
    realRepId: 'rep-luis',
    phone: '+52 81 2000 2001',
    email: 'dra.salinas@cardio.mx',
    tags: ['productivo'],
  },
  {
    id: 'doc-vega',
    name: 'Andrés Vega',
    title: 'Dr.',
    specialty: 'Medicina Interna',
    city: 'Guadalajara',
    zone: 'Bajío',
    covered: false,
    phone: '+52 33 3000 3001',
    email: 'dr.vega@interno.mx',
    tags: ['alto-potencial', 'no-cubierto'],
  },
  {
    id: 'doc-nunez',
    name: 'Lucía Núñez',
    title: 'Dra.',
    specialty: 'Gastroenterología',
    city: 'Puebla',
    zone: 'Centro',
    covered: false,
    phone: '+52 22 4000 4001',
    email: 'dra.nunez@gastro.mx',
    tags: ['alto-potencial', 'no-cubierto'],
  },
  {
    id: 'doc-perez',
    name: 'Miguel Pérez',
    title: 'Dr.',
    specialty: 'Pediatría',
    city: 'Ciudad de México',
    zone: 'CDMX Oriente',
    covered: false,
    tags: ['no-cubierto', 'lejanía'],
  },
]

export const pharmacyStaff: PharmacyStaff[] = [
  {
    id: 'ph-rosa',
    name: 'Rosa Delgado',
    pharmacy: 'Farmacia del Pueblo Centro',
    city: 'Ciudad de México',
    role: 'Dependiente senior',
    phone: '+52 55 5000 5001',
    email: 'rosa@farmaciadelpueblo.mx',
  },
  {
    id: 'ph-ivan',
    name: 'Iván Soto',
    pharmacy: 'Botica Norte 12',
    city: 'Monterrey',
    role: 'Dependiente',
    phone: '+52 81 5000 5002',
  },
]

export const campaigns: Campaign[] = [
  {
    id: 'camp-cf-q3',
    name: 'CardioFlex Q3 — Control 24h',
    productIds: ['prod-cardioflex'],
    avatarId: 'av-sofia-cdmx',
    audience: 'covered_doctors',
    status: 'approved',
    cycle: '2026-Q3',
    multiProduct: false,
    channels: ['whatsapp', 'email'],
    filters: {
      specialties: ['Cardiología', 'Medicina Interna'],
      zones: ['CDMX Sur', 'Norte'],
      coveredOnly: true,
    },
    script: {
      opening:
        'Buenos días, {title} {lastName}. Soy {avatarName}, visitador médico virtual de apoyo a {realRepName}. Es un gusto saludarle nuevamente.',
      productPresentation:
        'En este ciclo quiero reforzar CardioFlex XR, diseñado para el control sostenido de la presión arterial durante 24 horas, con un perfil de tolerabilidad documentado en adultos con hipertensión esencial.',
      clinicalEvidence:
        'El estudio CLIN-CF-2024, multicéntrico con 842 pacientes, reportó una reducción media de la PAS de 18.4 mmHg a 12 semanas (p<0.01), con un perfil de eventos adversos comparable al control activo.',
      expectedResults:
        'El objetivo es apoyar un control más predecible de la PA en sus pacientes candidatos, siempre de acuerdo con la información para prescribir vigente.',
      probingQuestion:
        'Después de lo expuesto, {title} {lastName}, ¿se le viene a la mente algún paciente al cual podría considerar CardioFlex XR?',
      closing:
        'Quedo a su orden. Si desea probar el producto, puede solicitar una muestra médica con el botón inferior. En la próxima visita de {realRepName} podremos profundizar cualquier duda.',
      supportRepMention: true,
    },
    ctas: [{ type: 'sample_request', label: 'Solicitar muestra médica', productId: 'prod-cardioflex' }],
    testedAt: '2026-08-08',
    approvedAt: '2026-08-09',
    createdAt: '2026-08-01',
  },
  {
    id: 'camp-rx-ped',
    name: 'Respirax Kids — Pediatría Sur CDMX + Evento',
    productIds: ['prod-respirax'],
    avatarId: 'av-sofia-cdmx',
    audience: 'covered_doctors',
    status: 'testing',
    cycle: '2026-Q3',
    multiProduct: false,
    channels: ['whatsapp', 'sms'],
    filters: {
      specialties: ['Pediatría'],
      zones: ['CDMX Sur'],
      tags: ['evento-q3'],
    },
    script: {
      opening:
        'Hola {title} {lastName}, soy {avatarName}. Le saludo en apoyo a {realRepName} y le recuerdo la invitación al evento de Respirax Kids.',
      productPresentation:
        'Respirax Kids está orientado al control de síntomas en asma y rinitis alérgica pediátrica, con una presentación pensada para facilitar la adherencia.',
      clinicalEvidence:
        'Según el estudio PED-RX-15, se observó mejora en el score de síntomas nocturnos a 8 semanas en población pediátrica del protocolo.',
      expectedResults:
        'Buscamos reforzar recordación y criterio de uso en sus pacientes pediátricos candidatos, conforme a la IPP.',
      probingQuestion:
        '¿Tiene en mente algún paciente pediátrico en quien Respirax Kids podría ser de utilidad?',
      closing:
        'Puede confirmar asistencia al evento o solicitar muestra con los botones. {realRepName} sigue siendo su contacto principal de territorio.',
      supportRepMention: true,
    },
    ctas: [
      { type: 'event_rsvp', label: 'Confirmar asistencia al evento' },
      { type: 'sample_request', label: 'Solicitar muestra', productId: 'prod-respirax' },
    ],
    createdAt: '2026-08-05',
  },
  {
    id: 'camp-uncovered-multi',
    name: 'Visita multiproducto — médicos no cubiertos',
    productIds: ['prod-cardioflex', 'prod-gastropro', 'prod-respirax'],
    avatarId: 'av-diego-norte',
    audience: 'uncovered_doctors',
    status: 'draft',
    cycle: '2026-Q3',
    multiProduct: true,
    channels: ['whatsapp', 'email'],
    filters: { uncoveredOnly: true, tags: ['alto-potencial'] },
    script: {
      opening:
        'Estimado/a {title} {lastName}, soy {avatarName}, su visitador médico virtual. Gracias por recibirme; quiero presentarle el portafolio prioritario de este ciclo.',
      productPresentation:
        'Le comparto de forma breve CardioFlex XR (cardiología), GastroPro (ERGE) y Respirax Kids (pediatría), cada uno con su evidencia y mensajes aprobados.',
      clinicalEvidence:
        'Puedo ampliar el estudio clínico aprobado de cada producto que sea de su interés, exclusivamente con documentación interna del laboratorio.',
      expectedResults:
        'El propósito es acercarle opciones terapéuticas respaldadas y facilitarle muestras o materiales si lo requiere.',
      probingQuestion:
        '¿Sobre cuál producto le gustaría que profundice primero?',
      closing:
        'Debajo encontrará un botón de muestra por cada producto presentado. Quedo atento/a a su próxima visita virtual.',
      supportRepMention: false,
    },
    ctas: [
      { type: 'sample_request', label: 'Muestra CardioFlex', productId: 'prod-cardioflex' },
      { type: 'sample_request', label: 'Muestra GastroPro', productId: 'prod-gastropro' },
      { type: 'sample_request', label: 'Muestra Respirax', productId: 'prod-respirax' },
    ],
    createdAt: '2026-08-10',
  },
  {
    id: 'camp-pharmacy-edu',
    name: 'Academia farmacia — recordación de marca',
    productIds: ['prod-cardioflex', 'prod-gastropro'],
    avatarId: 'av-valentina-andina',
    audience: 'pharmacy_staff',
    status: 'live',
    cycle: '2026-Q3',
    multiProduct: true,
    channels: ['whatsapp'],
    filters: {},
    script: {
      opening:
        'Hola {firstName}, soy {avatarName}. Gracias por tu tiempo; hoy tenemos un entrenamiento breve para profesionalizar la recomendación en mostrador.',
      productPresentation:
        'Repasaremos recordación de CardioFlex y GastroPro, cuándo derivar al médico y cómo orientar al paciente sin diagnosticar.',
      clinicalEvidence:
        'Usaremos únicamente los puntos de entrenamiento aprobados por el laboratorio para dependientes.',
      expectedResults:
        'Al finalizar podrás reforzar la recomendación responsable y obtener tu certificado del módulo.',
      probingQuestion:
        '¿Qué dudas te surgen con más frecuencia en el mostrador sobre estos productos?',
      closing:
        'Completa el módulo y descarga tu certificado. ¡Excelente trabajo!',
      supportRepMention: false,
    },
    ctas: [{ type: 'certificate', label: 'Obtener certificado del módulo' }],
    approvedAt: '2026-07-28',
    createdAt: '2026-07-20',
  },
]

export const creditAccount: CreditAccount = {
  balance: 12840,
  costPerVisit: 2.5,
  costPerCta: 0,
  currency: 'USD',
  transactions: [
    { id: 'tx-1', type: 'topup', amount: 15000, label: 'Carga de saldo inicial', at: '2026-07-01' },
    { id: 'tx-2', type: 'setup', amount: -2500, label: 'Instalación y conexión CRM', at: '2026-07-02' },
    { id: 'tx-3', type: 'visit', amount: -625, label: 'Envío campaña CardioFlex (250 visitas)', at: '2026-08-09' },
    { id: 'tx-4', type: 'visit', amount: -35, label: 'Envío academia farmacia (14 visitas)', at: '2026-08-10' },
  ],
}

export const analytics: AnalyticsSnapshot = {
  sent: 1264,
  opened: 812,
  engaged: 498,
  ctaClicks: 186,
  samplesRequested: 142,
  reachRate: 64.2,
  engagementRate: 39.4,
  byChannel: [
    { channel: 'whatsapp', sent: 820, opened: 610 },
    { channel: 'email', sent: 340, opened: 160 },
    { channel: 'sms', sent: 104, opened: 42 },
  ],
  bySpecialty: [
    { specialty: 'Cardiología', opened: 290 },
    { specialty: 'Pediatría', opened: 240 },
    { specialty: 'Medicina Interna', opened: 150 },
    { specialty: 'Gastroenterología', opened: 90 },
    { specialty: 'Farmacia', opened: 42 },
  ],
  daily: [
    { date: '08-05', opens: 42, ctas: 8 },
    { date: '08-06', opens: 55, ctas: 12 },
    { date: '08-07', opens: 61, ctas: 15 },
    { date: '08-08', opens: 70, ctas: 18 },
    { date: '08-09', opens: 88, ctas: 24 },
    { date: '08-10', opens: 95, ctas: 28 },
    { date: '08-11', opens: 102, ctas: 31 },
    { date: '08-12', opens: 74, ctas: 20 },
  ],
}

export const academyModules: AcademyModule[] = [
  {
    id: 'ac-gov',
    title: 'Gobernanza y compliance del VM',
    description: 'Reglas de oro: fuentes internas, anti-alucinación y escalamiento.',
    audience: 'avatar_trainer',
    lessons: [
      {
        id: 'l1',
        title: 'Las 3 capas obligatorias',
        content:
          '1) Gobernanza. 2) Fidelidad a campaña. 3) Solo documentación interna. Nunca inventar ni salir del corpus.',
        durationMin: 12,
      },
      {
        id: 'l2',
        title: 'Frase de escalamiento',
        content:
          'Cuando no hay información: "No dispongo de esa información en este momento; con gusto la consultaré con el departamento {dept} y se la traeré en la próxima visita."',
        durationMin: 8,
      },
    ],
  },
  {
    id: 'ac-accent',
    title: 'Estilos de habla y acentos regionales',
    description: 'La IA aprende maneras, formas y acento de cada formador.',
    audience: 'avatar_trainer',
    lessons: [
      {
        id: 'l3',
        title: 'Acento CDMX vs Norte',
        content:
          'CDMX: cortesía urbana, ritmo medio. Norte: trato más directo y cálido. Registrar frases modelo del formador.',
        durationMin: 15,
      },
    ],
  },
  {
    id: 'ac-pharma',
    title: 'Profesionalización del dependiente',
    description: 'Curso para dependientes con certificado final.',
    audience: 'pharmacy_staff',
    certificateTitle: 'Certificado ia-rep — Atención responsable en mostrador',
    lessons: [
      {
        id: 'lp1',
        title: 'Recordación de marca sin diagnosticar',
        content:
          'Escucha activa, identificación de necesidad, recomendación de marcas del laboratorio y derivación al médico cuando corresponda.',
        durationMin: 20,
      },
      {
        id: 'lp2',
        title: 'CardioFlex y GastroPro en mostrador',
        content:
          'Mensajes aprobados de recordación, materiales de apoyo y cuándo no recomendar.',
        durationMin: 18,
      },
    ],
  },
]

export const trainerStyles: TrainerStyle[] = [
  {
    id: 'tr-1',
    trainerName: 'Formadora Laura Gómez',
    accent: 'cdmx',
    speakingStyle: 'Cálida, pausada, usa "con mucho gusto" y "permítame"',
    samplePhrases: [
      'Con mucho gusto le comento lo aprobado para este ciclo.',
      'Si le parece, repasamos la evidencia en un minuto.',
    ],
    notes: 'Evitar muletillas; priorizar nombres de estudios internos.',
  },
  {
    id: 'tr-2',
    trainerName: 'Formador Héctor Salazar',
    accent: 'norte',
    speakingStyle: 'Cercano, claro, frases cortas',
    samplePhrases: [
      'Se lo pongo sencillo, doctor.',
      'Esta es la data que maneja el laboratorio.',
    ],
    notes: 'Mantener formalidad aunque el tono sea cercano.',
  },
]

export const territoryInsights: TerritoryInsight[] = [
  {
    repId: 'rep-ana',
    zone: 'CDMX Sur',
    totalDoctors: 86,
    covered: 64,
    highPotentialUncovered: 9,
    topSpecialties: [
      { name: 'Pediatría', count: 28 },
      { name: 'Cardiología', count: 22 },
      { name: 'Medicina Interna', count: 18 },
    ],
    suggestedActions: [
      'Reforzar CardioFlex en cardiólogos productivos con VM de ciclo',
      'Invitar pediatras tag evento-q3 a campaña Respirax',
      'Abrir base de 9 no cubiertos alto potencial con visita multiproducto',
    ],
    lastCyclePerformance: { visits: 210, samples: 64, events: 1 },
  },
  {
    repId: 'rep-luis',
    zone: 'Monterrey',
    totalDoctors: 54,
    covered: 40,
    highPotentialUncovered: 6,
    topSpecialties: [
      { name: 'Cardiología', count: 20 },
      { name: 'Medicina Interna', count: 16 },
    ],
    suggestedActions: [
      'Usar avatar norteño Diego Rivas',
      'Priorizar WhatsApp en zona industrial',
    ],
    lastCyclePerformance: { visits: 132, samples: 41, events: 0 },
  },
]

export const contextualTips: ContextualTip[] = [
  {
    id: 'tip-weather',
    type: 'weather',
    template:
      '{title} {lastName}, parece que hoy va a bajar la temperatura al final de la tarde. Le recomiendo abrigarse.',
  },
  {
    id: 'tip-traffic',
    type: 'traffic',
    template:
      '{title} {lastName}, parece que hay tráfico complicado en su sector. Le recomiendo tomar precauciones al salir.',
  },
  {
    id: 'tip-event',
    type: 'event',
    template:
      '{title} {lastName}, le recuerdo que hoy hay un evento astronómico destacado; puede ser una buena oportunidad para un plan en familia.',
  },
  {
    id: 'tip-bday',
    type: 'birthday',
    template:
      '{title} {lastName}, el equipo y yo le deseamos un muy feliz cumpleaños. Que tenga un excelente día.',
  },
]

export const dispatches: DispatchJob[] = [
  {
    id: 'disp-1',
    campaignId: 'camp-cf-q3',
    channel: 'whatsapp',
    recipientCount: 250,
    sentAt: '2026-08-09T10:00:00',
    costCredits: 625,
    status: 'sent',
  },
  {
    id: 'disp-2',
    campaignId: 'camp-pharmacy-edu',
    channel: 'whatsapp',
    recipientCount: 14,
    sentAt: '2026-08-10T09:30:00',
    costCredits: 35,
    status: 'sent',
  },
]

export const seedVisit: VisitSession = {
  id: 'visit-demo-abad',
  campaignId: 'camp-cf-q3',
  targetType: 'covered_doctors',
  targetId: 'doc-abad',
  avatarId: 'av-sofia-cdmx',
  channel: 'whatsapp',
  opened: true,
  startedAt: new Date().toISOString(),
  messages: [],
  ctaClicks: [],
  materialsRequested: [],
  contextNotes: ['Tráfico moderado CDMX Sur', 'Cumpleaños hoy'],
}
