# ia-rep

Visitador médico virtual con avatares e IA para laboratorios farmacéuticos.

## Pilares

1. **Gobernanza** — compliance y límites antes de responder  
2. **Campaña** — script exacto del gerente de producto  
3. **Corpus interno** — solo documentación de la compañía (anti-alucinación + escalamiento)

## Stack

- React + TypeScript + Vite  
- Tailwind CSS v4  
- React Router · Zustand · Recharts · Lucide

## Scripts

```bash
export PATH="$HOME/.local/node/bin:$PATH"   # si Node está instalado en el home
npm install
npm run dev
npm run build
```

## Módulos

| Ruta | Función |
|------|---------|
| `/` | Centro de mando |
| `/gobernanza` | Reglas enforced |
| `/avatares` | Apariencia, acento, región |
| `/productos` | Productos + docs internas |
| `/campanas` | Scripts, test, go final, envío |
| `/crm` | Audiencias / segmentación |
| `/analitica` | Reach, CTA, canales |
| `/creditos` | Saldo y costo por VM |
| `/academia` | Entrenamiento IA + certificados farmacia |
| `/territorio` | Planeación para el VM humano |
| `/visita` | Experiencia del médico/dependiente |
| `/prueba` | Sandbox del operador |

Motor de respuesta: `src/lib/governance.ts` (RAG interno + escalamiento).
