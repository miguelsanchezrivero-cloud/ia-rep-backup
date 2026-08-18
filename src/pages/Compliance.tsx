import { useState } from 'react'
import { cn } from '../lib/cn'
import { useAppStore } from '../store/useAppStore'
import { useEffect } from 'react'

const tabs = [
  { id: 'reglas', label: 'Reglas de compliance' },
  { id: 'pruebas', label: 'Pruebas de compliance' },
]

export function Compliance() {
  const [activeTab, setActiveTab] = useState('reglas')
  const setProfile = useAppStore(s => s.setProfile)

  useEffect(() => {
    setProfile({ name: 'María José', role: 'Gerente de Compliance' })
  }, [setProfile])

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="bg-white/50 backdrop-blur px-8 py-4 flex items-center justify-between border-b border-slate-200">
        <h1 className="text-3xl text-[#1e3a8a]">Compliance</h1>
        <p className="text-[#1e3a8a] max-w-2xl text-center text-sm">Este modulo sirve para asegurarnos que los VMs virtuales están siguiendo las normas de compliance establecidas</p>
        <div className="w-[120px]"></div>
      </div>
      
      <div className="p-8 flex flex-col flex-1 overflow-y-auto">
        <div className="flex gap-4 mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                'px-6 py-4 rounded-3xl text-sm font-medium transition-colors w-48 text-center h-16 flex justify-center items-center',
                activeTab === t.id
                  ? 'bg-[#1e3a8a] text-white shadow-md'
                  : 'bg-white text-[#1e3a8a] shadow-sm hover:shadow-md'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'reglas' && (
          <div className="w-full">
            <div className="flex items-center text-[#1e3a8a] text-sm font-semibold mb-4 px-4">
              <div className="flex-1 text-center">Pregunta</div>
              <div className="flex-1 text-center">Respuesta</div>
              <div className="w-32 text-center text-xs">
                Aprobaciones<br/>
                <span className="text-emerald-500 font-normal">Medical Compliance</span>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-[#1e3a8a]">
              {[
                { p: 'Para preguntas sobre el uso de los productos fuera de las indicaciones que constan en la ficha aprobada', r: 'Dr. (Nombre). Esta indicación no esta aprobada para el producto (nombre producto)' },
                { p: 'Para preguntas sobre estudios clínicos que no están dentro del paquete de información del producto', r: 'Dr. (Nombre). No dispongo de esa información en este momento, pero voy a preguntar al departamento médico y le enviare una respuesta por whatsapp tan pronto la tengamos.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="w-4 text-right">{idx + 1}:</span>
                  <div className="flex-1 bg-white/60 p-4 rounded-xl shadow-sm text-xs leading-relaxed">{item.p}</div>
                  <div className="flex-1 bg-white/60 p-4 rounded-xl shadow-sm text-xs leading-relaxed">{item.r}</div>
                  <div className="w-32 flex justify-center gap-2">
                    <div className="w-8 h-8 bg-white shadow-sm flex items-center justify-center rounded">S</div>
                    <div className="w-8 h-8 bg-white shadow-sm flex items-center justify-center rounded">S</div>
                  </div>
                </div>
              ))}
              
              <div className="flex gap-4 items-center my-6">
                 <div className="w-4"></div>
                 <button className="bg-white px-6 py-2 rounded-xl shadow-sm font-medium">Crear</button>
                 <div className="flex-1 text-xs opacity-80 leading-relaxed px-4">
                   La creación de una respuesta que tenga que ver con compliance pasa después a la aprobación de los departamentos médico y complinace. Una vez 
                 </div>
                 <div className="w-32"></div>
              </div>

              {[
                { p: 'Para preguntas o solicitudes de auspicios a congresos, eventos, viajes o cualquier otra solicitud', r: 'Dr. (Nombre). No tengo la autoridad en la compañía para aprobar una solicitud de este tipo, pero se la haré llegar a mis superiores' },
                { p: 'Para preguntas sobre productos que no han sido cargado todavía en la plataforma', r: 'Dr. (Nombre). Aun no he tenido el entrenamiento sobre el producto que me menciona. A penas lo haga estaré gustoso en recordárselo.' },
                { p: 'Para preguntas sobre productos de la competencia', r: 'Dr. (Nombre). Con gusto le puedo responder cualquier pregunta sobre mis productos. Lamentablemente no estoy autorizado para hablar sobre productos de mi competencia.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="w-4 text-right">{idx + 3}:</span>
                  <div className="flex-1 bg-white/60 p-4 rounded-xl shadow-sm text-xs leading-relaxed">{item.p}</div>
                  <div className="flex-1 bg-white/60 p-4 rounded-xl shadow-sm text-xs leading-relaxed">{item.r}</div>
                  <div className="w-32 flex justify-center gap-2">
                    <div className="w-8 h-8 bg-white shadow-sm rounded"></div>
                    <div className="w-8 h-8 bg-white shadow-sm rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pruebas' && (
          <div className="flex flex-col flex-1 h-full">
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
                    <div key={idx} className={cn("p-4 rounded-3xl shadow-sm flex gap-4 items-center border border-slate-100", region === 1 && idx === 0 ? "bg-[#1e3a8a] text-white" : "bg-white")}>
                      <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-[10px] opacity-70">Foto</div>
                      <div>
                        <p className={cn("text-base", region === 1 && idx === 0 ? "text-white" : "text-[#1e3a8a]")}>{rep.name}</p>
                        <p className={cn("text-xs leading-tight", region === 1 && idx === 0 ? "text-white/80" : "text-[#1e3a8a]/80")}>{rep.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex gap-8">
               <div className="bg-white rounded-[40px] p-8 w-1/3 flex items-center justify-center text-center shadow-sm h-64 text-[#1e3a8a] text-sm">
                 Aquí aparece el Rep<br/>escogido. Saluda y me<br/>pregunta si tengo<br/>alguna pregunta para el
               </div>
               <div className="flex flex-col gap-4 justify-center">
                 <button className="bg-white px-8 py-4 rounded-xl shadow-sm text-[#1e3a8a] font-medium text-sm">Respuesta correcta</button>
                 <button className="bg-white px-8 py-4 rounded-xl shadow-sm text-[#1e3a8a] font-medium text-sm">Respuesta incorrecta</button>
               </div>
               <div className="flex-1 flex items-center pl-8">
                 <p className="text-[#1e3a8a] text-xs leading-relaxed max-w-xs">
                   Un clic en respuesta incorrecta debería llevar a una conversación acerca de como se debió haber respondido la pregunta para que la IA aprenda. Es viable esto?
                 </p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
