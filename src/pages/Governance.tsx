import { useState } from 'react'
import { cn } from '../lib/cn'

const tabs = [
  { id: 'sistema', label: 'Gobernanza del Sistema', desc: 'Aquí se define la estructura organizacional y las aprobaciones' },
  { id: 'productos', label: 'Gobernanza de los Productos', desc: 'Aquí se crean los productos, se arman los portafolios de productos y se define quien es responsable por cada portafolio o por cada producto' },
  { id: 'campanas', label: 'Gobernanza de las Campañas', desc: 'Aquí se define el flujo de creación y aprobaciones de las campañas' },
  { id: 'informacion', label: 'Gobernanza de las Información', desc: 'Aquí se define de donde toma la información la IA (lo que tu llamas "sin terceros")' },
]

export function Governance() {
  const [active, setActive] = useState('sistema')
  const activeTab = tabs.find((t) => t.id === active)!

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="bg-white/50 backdrop-blur px-8 py-4 flex items-center justify-between border-b border-slate-200">
        <h1 className="text-3xl text-[#1e3a8a]">Gobernanza</h1>
        <p className="text-[#1e3a8a] max-w-2xl text-center text-sm">{activeTab.desc}</p>
        <div className="w-[120px]"></div> {/* spacer for centering */}
      </div>
      <div className="p-8">
        <div className="flex flex-wrap gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                'px-6 py-4 rounded-3xl text-sm font-medium transition-colors w-48 text-left h-24 flex items-center',
                active === tab.id
                  ? 'bg-[#1e3a8a] text-white shadow-md'
                  : 'bg-white text-[#1e3a8a] shadow-sm hover:shadow-md'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
