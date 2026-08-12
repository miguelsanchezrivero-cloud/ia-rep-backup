import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Governance } from './pages/Governance'
import { Avatars } from './pages/Avatars'
import { Products } from './pages/Products'
import { Campaigns } from './pages/Campaigns'
import { Crm } from './pages/Crm'
import { Analytics } from './pages/Analytics'
import { Credits } from './pages/Credits'
import { Academy } from './pages/Academy'
import { Territory } from './pages/Territory'
import { Visit } from './pages/Visit'
import { CampaignTest } from './pages/CampaignTest'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="gobernanza" element={<Governance />} />
          <Route path="avatares" element={<Avatars />} />
          <Route path="productos" element={<Products />} />
          <Route path="campanas" element={<Campaigns />} />
          <Route path="crm" element={<Crm />} />
          <Route path="analitica" element={<Analytics />} />
          <Route path="creditos" element={<Credits />} />
          <Route path="academia" element={<Academy />} />
          <Route path="territorio" element={<Territory />} />
          <Route path="visita" element={<Visit />} />
          <Route path="prueba" element={<CampaignTest />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
