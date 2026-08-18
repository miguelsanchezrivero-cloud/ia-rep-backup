import { useState } from 'react'
import { cn } from '../lib/cn'

const tabs = [
  { id: 'regional', label: 'Estructura Regional', desc: 'Aquí de crean y se dan estructura a las regiones' },
  { id: 'reps', label: 'Creación de Reps', desc: 'Aquí de crean los representantes virtuales y se les asigna a las regiones' },
  { id: 'equipo', label: 'Equipo', desc: 'Aquí de crean los representantes virtuales y se les asigna a las regiones' },
]

export function TeamCreation() {
  const [active, setActive] = useState('regional')
  const activeTab = tabs.find((t) => t.id === active)!

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="bg-white/50 backdrop-blur px-8 py-4 flex items-center justify-between border-b border-slate-200">
        <h1 className="text-3xl text-[#1e3a8a]">Creación del Equipo</h1>
        <p className="text-[#1e3a8a] max-w-2xl text-center text-sm">{activeTab.desc}</p>
        <div className="w-[120px]"></div>
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                'px-6 py-4 rounded-3xl text-sm font-medium transition-colors w-48 text-left h-20 flex items-center',
                active === tab.id
                  ? 'bg-[#1e3a8a] text-white shadow-md'
                  : 'bg-white text-[#1e3a8a] shadow-sm hover:shadow-md'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {active === 'reps' && (
          <div className="flex gap-8 flex-1">
            <div className="w-1/3">
              <p className="text-[#1e3a8a] text-sm leading-relaxed">
                Acá están todos los campos para colocar todos los rasgos posibles que le darán la identidad a cada Rep.<br/><br/>
                Después de colocados, se ve el avatar en el recuadro de la derecha y se puede correr una prueba<br/><br/>
                Se le asigna también el estilo de visita por cada tipo de audiencia de acuerdo con los formadores que están en el modulo de Academia.<br/><br/>
                Ejemplo: Puedo escoger que tipo de visita de este avatar sea como el formador 1 para médicos y como el formador 4 para farmacias.
              </p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="bg-white w-full max-w-xl h-96 rounded-[40px] shadow-sm mb-6"></div>
              <div className="flex gap-4">
                <button className="bg-[#1e3a8a] text-white px-6 py-3 rounded-xl text-sm font-medium">Torso y cara</button>
                <button className="bg-white text-[#1e3a8a] px-6 py-3 rounded-xl text-sm font-medium shadow-sm">Cuerpo entero</button>
                <button className="bg-white text-[#1e3a8a] px-6 py-3 rounded-xl text-sm font-medium shadow-sm">Prueba</button>
              </div>
            </div>
          </div>
        )}

        {active === 'equipo' && (
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(region => (
              <div key={region} className="space-y-4">
                <div className="bg-white text-center py-3 rounded-2xl shadow-sm">
                  <span className="text-[#1e3a8a] font-medium text-sm">Región {region}</span>
                </div>
                {/* Rep cards */}
                {[
                  { name: 'Pedro', desc: 'Breve resumen de rasgos clave' },
                  { name: 'María', desc: 'Breve resumen de rasgos clave' },
                ].map((rep, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-3xl shadow-sm flex gap-4 items-center border border-slate-100">
                    <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-[10px] text-slate-400">Foto</div>
                    <div>
                      <p className="text-[#1e3a8a] text-base">{rep.name}</p>
                      <p className="text-[#1e3a8a] text-xs opacity-80 leading-tight">{rep.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
