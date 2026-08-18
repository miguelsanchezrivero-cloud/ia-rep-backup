import { NavLink, Outlet } from "react-router-dom";
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
  UserCircle,
  Bell,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/cn";
import { useAppStore } from "../store/useAppStore";
import { Badge, Button } from "../components/ui";

const nav = [
  { to: "/", label: "Centro de mando", icon: LayoutDashboard },
  { to: "/gobernanza", label: "Gobernanza", icon: ShieldCheck },
  { to: "/avatares", label: "Avatares", icon: Users },
  { to: "/productos", label: "Productos & docs", icon: Package },
  { to: "/campanas", label: "Campañas", icon: Megaphone },
  { to: "/crm", label: "CRM / Audiencias", icon: Contact },
  { to: "/analitica", label: "Analítica", icon: BarChart3 },
  { to: "/creditos", label: "Créditos", icon: Wallet },
  { to: "/academia", label: "Academia IA", icon: GraduationCap },
  { to: "/territorio", label: "Territorio VM", icon: Map },
  { to: "/visita", label: "Visita demo", icon: MessageSquareHeart },
  { to: "/prueba", label: "Test de campaña", icon: FlaskConical },
];

export function Layout() {
  const [open, setOpen] = useState(false);
  const balance = useAppStore((s) => s.credits.balance);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/30 via-slate-50 to-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 border-r border-ink-200/60 bg-white/95 p-5 backdrop-blur-xl transition-all duration-300 ease-in-out md:static md:translate-x-0",
            open ? "translate-x-0 shadow-2xl" : "-translate-x-full",
          )}
        >
          {/* Logo */}
          <div className="mb-6 flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-sm font-bold text-white shadow-lg shadow-brand-900/30">
                ia
              </div>
              <div>
                <p className="font-display text-xl font-bold leading-none text-ink-900 tracking-tight">
                  ia-rep
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-600">
                  VM virtual
                </p>
              </div>
            </div>
            <button
              className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 md:hidden"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>

          {/* Saldo */}
          <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 via-white to-emerald-50/50 p-4 shadow-sm ring-1 ring-brand-200/50">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-700/80">
              Saldo disponible
            </p>
            <p className="mt-0.5 text-2xl font-black text-brand-900">
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-ink-500">
                Listo para enviar
              </span>
            </div>
          </div>

          {/* Navegación */}
          <nav className="scrollbar-thin flex max-h-[calc(100vh-240px)] flex-col gap-1 overflow-y-auto pr-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-brand-600 text-white shadow-md shadow-brand-900/20 ring-1 ring-brand-700/30"
                      : "text-ink-600 hover:bg-ink-100/80 hover:text-ink-900",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-ink-100/60 text-ink-500 group-hover:bg-ink-200/60",
                      )}
                    >
                      <item.icon size={16} />
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer del sidebar */}
          <div className="absolute bottom-4 left-4 right-4 hidden rounded-2xl bg-gradient-to-br from-ink-800 to-ink-900 p-3 text-white shadow-lg md:block">
            <p className="text-xs font-semibold">🔬 Laboratorio demo</p>
            <p className="mt-0.5 text-[11px] text-ink-300">
              Operador: Product Manager
            </p>
            <div className="mt-2 flex gap-2">
              <Badge tone="brand">v2.0</Badge>
              <Badge tone="neutral">Sandbox</Badge>
            </div>
          </div>
        </aside>

        {/* Overlay móvil */}
        {open && (
          <div
            className="fixed inset-0 z-30 bg-ink-900/40 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Contenido principal */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-ink-200/60 bg-white/80 px-4 py-3 backdrop-blur-xl shadow-sm md:px-8">
            <div className="flex items-center gap-3">
              <button
                className="rounded-xl border border-ink-200 bg-white p-2 text-ink-600 shadow-sm hover:bg-ink-50 md:hidden"
                onClick={() => setOpen(true)}
                aria-label="Abrir menú"
              >
                <Menu size={18} />
              </button>
              <div className="hidden items-center gap-2 md:flex">
                <span className="text-sm font-medium text-ink-700">
                  Panel de control
                </span>
                <Badge tone="success">Operativo</Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Saldo (visible en escritorio) */}
              <div className="hidden items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800 shadow-sm ring-1 ring-emerald-200/50 md:flex">
                <Wallet size={14} className="text-emerald-600" />
                <span>${balance.toLocaleString()}</span>
              </div>

              {/* Badges de estado */}
              <div className="hidden items-center gap-1.5 md:flex">
                <Badge tone="brand">RAG interno</Badge>
                <Badge tone="success">Compliance ON</Badge>
              </div>

              {/* Perfil / Notificaciones (mock) */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0 text-ink-600 hover:bg-ink-100"
                aria-label="Notificaciones"
              >
                <Bell size={18} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0 text-ink-600 hover:bg-ink-100"
                aria-label="Perfil de usuario"
              >
                <UserCircle size={20} />
              </Button>
            </div>
          </header>

          {/* Main */}
          <main className="flex-1 px-4 py-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
