import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'

const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Governance = lazy(() => import('./pages/Governance').then((m) => ({ default: m.Governance })))
const TeamCreation = lazy(() => import('./pages/TeamCreation').then((m) => ({ default: m.TeamCreation })))
const Academy = lazy(() => import('./pages/Academy').then((m) => ({ default: m.Academy })))
const Compliance = lazy(() => import('./pages/Compliance').then((m) => ({ default: m.Compliance })))
const Products = lazy(() => import('./pages/Products').then((m) => ({ default: m.Products })))
const Campaigns = lazy(() => import('./pages/Campaigns').then((m) => ({ default: m.Campaigns })))
const Crm = lazy(() => import('./pages/Crm').then((m) => ({ default: m.Crm })))
const Analytics = lazy(() => import('./pages/Analytics').then((m) => ({ default: m.Analytics })))
const Credits = lazy(() => import('./pages/Credits').then((m) => ({ default: m.Credits })))

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
      Cargando…
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="gobernanza" element={<Governance />} />
            <Route path="creacion-equipo" element={<TeamCreation />} />
            <Route path="academia" element={<Academy />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="productos" element={<Products />} />
            <Route path="campanas" element={<Campaigns />} />
            <Route path="crm" element={<Crm />} />
            <Route path="analitica" element={<Analytics />} />
            <Route path="creditos" element={<Credits />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
