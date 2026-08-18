import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { cn } from '../lib/cn'
import { useAppStore } from '../store/useAppStore'
import { Menu, X } from 'lucide-react'

const nav = [
  { to: '/', label: 'Centro de Mando' },
  { to: '/gobernanza', label: 'Gobernanza' },
  { to: '/creacion-equipo', label: 'Creación del Equipo' },
  { to: '/academia', label: 'Academia' },
  { to: '/compliance', label: 'Compliance' },
  { to: '/productos', label: 'Productos' },
  { to: '/campanas', label: 'Campañas' },
  { to: '/crm', label: 'CRM' },
  { to: '/analitica', label: 'Analítica' },
  { to: '/creditos', label: 'Créditos' },
]

export function Layout() {
  const [open, setOpen] = useState(false)
  const profile = useAppStore((s) => s.profile)

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-72 bg-white flex flex-col pt-6 pb-4 px-4 transition-transform md:relative md:translate-x-0',
            open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between px-2 mb-8">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-white font-bold text-lg leading-none">
                ia
              </div>
              <span className="text-2xl font-semibold text-blue-900 tracking-tight">fieldforce</span>
            </div>
            <button className="rounded-lg p-1 text-slate-500 md:hidden hover:bg-slate-100" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="mb-8 rounded-xl bg-teal-500/10 px-4 py-3">
            <p className="text-[15px] font-semibold text-blue-900">{profile.name}</p>
            <p className="text-xs text-blue-800">{profile.role}</p>
          </div>

          <nav className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-none">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                    isActive 
                      ? 'bg-[#1e3a8a] text-white shadow-sm' 
                      : 'text-[#1e3a8a] hover:bg-slate-100'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {open && <div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />}

        {/* Main content area */}
        <main className="flex-1 flex flex-col min-w-0 bg-white">
          <header className="flex items-center gap-4 px-4 py-3 md:hidden">
            <button className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50" onClick={() => setOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-white font-bold text-sm">ia</div>
              <span className="text-lg font-semibold text-blue-900">fieldforce</span>
            </div>
          </header>
          
          <div className="flex-1 p-2 md:p-6 md:pl-0 flex flex-col min-h-0 overflow-hidden">
             {/* The large light cyan container with border */}
             <div className="flex-1 flex flex-col rounded-sm border border-slate-200 bg-[#cffafe]/40 overflow-hidden shadow-sm">
                <div className="flex-1 overflow-y-auto relative">
                  <Outlet />
                </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  )
}
