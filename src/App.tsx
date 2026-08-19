import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'

const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Governance = lazy(() => import('./pages/Governance').then((m) => ({ default: m.Governance })))
const Avatars = lazy(() => import('./pages/Avatars').then((m) => ({ default: m.Avatars })))
const Products = lazy(() => import('./pages/Products').then((m) => ({ default: m.Products })))
const Campaigns = lazy(() => import('./pages/Campaigns').then((m) => ({ default: m.Campaigns })))
const Crm = lazy(() => import('./pages/Crm').then((m) => ({ default: m.Crm })))
const Analytics = lazy(() => import('./pages/Analytics').then((m) => ({ default: m.Analytics })))
const Credits = lazy(() => import('./pages/Credits').then((m) => ({ default: m.Credits })))
const Academy = lazy(() => import('./pages/Academy').then((m) => ({ default: m.Academy })))
const Territory = lazy(() => import('./pages/Territory').then((m) => ({ default: m.Territory })))
const Visit = lazy(() => import('./pages/Visit').then((m) => ({ default: m.Visit })))
const CampaignTest = lazy(() =>
  import('./pages/CampaignTest').then((m) => ({ default: m.CampaignTest })),
)
const Users = lazy(() => import('./pages/Users').then((m) => ({ default: m.Users })))

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
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route element={<ProtectedRoute requiredPermission="view_dashboard" />}>
                <Route index element={<Dashboard />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermission="view_governance" />}>
                <Route path="gobernanza" element={<Governance />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermission="view_avatars" />}>
                <Route path="avatares" element={<Avatars />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermission="view_products" />}>
                <Route path="productos" element={<Products />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermission="view_campaigns" />}>
                <Route path="campanas" element={<Campaigns />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermission="view_crm" />}>
                <Route path="crm" element={<Crm />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermission="view_analytics" />}>
                <Route path="analitica" element={<Analytics />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermission="view_credits" />}>
                <Route path="creditos" element={<Credits />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermission="view_academy" />}>
                <Route path="academia" element={<Academy />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermission="view_territory" />}>
                <Route path="territorio" element={<Territory />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermission="view_visit" />}>
                <Route path="visita" element={<Visit />} />
              </Route>
              <Route element={<ProtectedRoute requiredPermission="view_campaign_test" />}>
                <Route path="prueba" element={<CampaignTest />} />
              </Route>
              
              <Route path="configuracion">
                <Route index element={<Navigate to="usuarios" replace />} />
                <Route element={<ProtectedRoute requiredPermission="manage_users" />}>
                  <Route path="usuarios" element={<Users />} />
                </Route>
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
