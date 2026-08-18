import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Package,
  Megaphone,
  Contact,
  BarChart3,
  Wallet,
  GraduationCap,
  Map,
  MessageSquareHeart,
  FlaskConical,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/cn'
import { useAppStore } from '../store/useAppStore'

const nav = [
  { to: '/', label: 'Centro de mando', icon: LayoutDashboard },
  { to: '/gobernanza', label: 'Gobernanza', icon: ShieldCheck },
  { to: '/avatares', label: 'Avatares', icon: Users },
  { to: '/productos', label: 'Productos & docs', icon: Package },
  { to: '/campanas', label: 'Campañas', icon: Megaphone },
  { to: '/crm', label: 'CRM / Audiencias', icon: Contact },
  { to: '/analitica', label: 'Analítica', icon: BarChart3 },
  { to: '/creditos', label: 'Créditos', icon: Wallet },
  { to: '/academia', label: 'Academia IA', icon: GraduationCap },
  { to: '/territorio', label: 'Territorio VM', icon: Map },
  { to: '/visita', label: 'Visita demo', icon: MessageSquareHeart },
  { to: '/prueba', label: 'Test de campaña', icon: FlaskConical },
]

export function Layout() {
  const [open, setOpen] = useState(false)
  const balance = useAppStore((s) => s.credits.balance)

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#ecfdf5_0%,_#f8fafc_45%,_#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-72 border-r border-ink-200/70 bg-white/90 p-4 backdrop-blur-md transition md:static md:translate-x-0',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="mb-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-700 text-sm font-bold text-white shadow-lg shadow-brand-900/20">
                ia
              </div>
              <div>
                <p className="font-display text-xl leading-none text-ink-900">ia-rep</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-700">VM virtual</p>
              </div>
            </div>
            <button className="rounded-lg p-1 text-ink-500 md:hidden" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="mb-4 rounded-2xl border border-brand-100 bg-brand-50/80 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-800">Saldo acreditado</p>
            <p className="mt-1 text-xl font-semibold text-brand-900">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <p className="text-[11px] text-brand-700/80">Listo para envíos masivos</p>
          </div>

          <nav className="scrollbar-thin flex max-h-[calc(100vh-220px)] flex-col gap-1 overflow-y-auto pr-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                    isActive ? 'bg-ink-900 text-white shadow-sm' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
                  )
                }
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4 hidden rounded-2xl bg-ink-900 p-3 text-white md:block">
            <p className="text-xs font-semibold">Laboratorio demo</p>
            <p className="mt-0.5 text-[11px] text-ink-300">Operador: Product Manager</p>
          </div>
        </aside>

        {open ? <div className="fixed inset-0 z-30 bg-ink-900/30 md:hidden" onClick={() => setOpen(false)} /> : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-200/60 bg-white/70 px-4 py-3 backdrop-blur md:px-8">
            <button className="rounded-xl border border-ink-200 p-2 text-ink-600 md:hidden" onClick={() => setOpen(true)}>
              <Menu size={18} />
            </button>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-ink-800">Plataforma simple · alta gobernanza · bajo costo por visita</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">Compliance ON</span>
              <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-semibold text-ink-700">RAG interno</span>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
