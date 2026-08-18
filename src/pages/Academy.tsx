import { useState, useEffect } from 'react'
import { cn } from '../lib/cn'
import { useAppStore } from '../store/useAppStore'

const managers = [
  { id: 'entrenamiento', label: 'Gerente de Entrenamiento', profile: { name: 'Ana Novillo', role: 'Gerente de Entrenamiento' },
    desc: 'Acá se crea el equipo de formadores y los cursos de entrenamiento' },
  { id: 'rrhh', label: 'Gerente de Recursos Humanos', profile: { name: 'Javier Moreno', role: 'Gerente de RRHH' },
    desc: 'Acá se carga toda la información de Recursos Humanos que el VM virtual debe aprender' },
  { id: 'comercial', label: 'Gerente Comercial', profile: { name: 'José Calle', role: 'Gerente Comercial' },
    desc: 'Acá se carga toda la información del área comercial que el VM virtual debe aprender' },
  { id: 'marketing', label: 'Gerente de Marketing', profile: { name: 'Esteban Abad', role: 'Gerente de Marketing' },
    desc: 'Acá se carga toda la información de Marketing que el VM virtual debe aprender' },
  { id: 'marca', label: 'Gerente de Marca', profile: { name: 'Juan Pérez', role: 'Gerente de Marca Respiratorio' },
    desc: 'Acá muestra la información del producto que el gerente de marca ha de enseñar al VM virtual' },
  { id: 'medico', label: 'Director Médico', profile: { name: 'Esteban Abad', role: 'Gerente de Marketing' }, // Using Esteban as per page 29
    desc: 'Acá se carga todo el conocimiento médico que el VM virtual debe aprender' },
  { id: 'compliance', label: 'Gerente de Compliance', profile: { name: 'Esteban Abad', role: 'Gerente de Marketing' }, // page 30
    desc: 'Acá se carga toda la información compliance que el VM virtual debe aprender' },
]

export function Academy() {
  const [activeMgr, setActiveMgr] = useState('entrenamiento')
  const [activeTab, setActiveTab] = useState('')
  const setProfile = useAppStore(s => s.setProfile)

  const mgr = managers.find(m => m.id === activeMgr)!

  useEffect(() => {
    setProfile(mgr.profile)
  }, [activeMgr, mgr.profile, setProfile])

  // Reset tab when manager changes
  useEffect(() => {
    if (activeMgr === 'entrenamiento') setActiveTab('formadores')
    else if (activeMgr === 'rrhh') setActiveTab('descripcion')
    else if (activeMgr === 'comercial') setActiveTab('listas')
    else if (activeMgr === 'marketing') setActiveTab('documentos')
    else if (activeMgr === 'marca') setActiveTab('prod1')
    else if (activeMgr === 'medico') setActiveTab('resp')
    else setActiveTab('')
  }, [activeMgr])

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="bg-white/50 backdrop-blur px-8 py-4 flex items-center justify-between border-b border-slate-200">
        <h1 className="text-3xl text-[#1e3a8a]">Academia</h1>
        <p className="text-[#1e3a8a] max-w-2xl text-center text-sm">{mgr.desc}</p>
        <div className="w-[120px]"></div>
      </div>
      
      <div className="p-8 flex flex-col flex-1 overflow-y-auto">
        <div className="flex flex-wrap gap-4 mb-8">
          {managers.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMgr(m.id)}
              className={cn(
                'px-6 py-4 rounded-3xl text-sm font-medium transition-colors w-48 text-left h-20 flex items-center',
                activeMgr === m.id
                  ? 'bg-[#1e3a8a] text-white shadow-md'
                  : 'bg-white text-[#1e3a8a] shadow-sm hover:shadow-md'
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Dynamic content based on active manager */}
        <div className="flex-1">
          {activeMgr === 'entrenamiento' && (
            <div className="space-y-6">
              <div className="flex gap-4">
                {[
                  { id: 'formadores', label: 'Formadores' },
                  { id: 'cursos', label: 'Cursos' },
                ].map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} className={cn('px-6 py-3 rounded-2xl text-sm font-medium', activeTab === t.id ? 'bg-[#1e3a8a] text-white' : 'bg-white text-[#1e3a8a] shadow-sm')}>{t.label}</button>
                ))}
              </div>
              
              {activeTab === 'formadores' && (
                <div className="flex gap-8">
                  <div className="flex-1 flex gap-4">
                    {[
                      { name: 'Laura Gómez', type: 'visita a médicos Cd Mx' },
                      { name: 'Héctor Salazar', type: 'visita a médicos Cd Mx' },
                    ].map((f, i) => (
                      <div key={i} className={cn("p-4 rounded-3xl flex gap-4 w-72 h-40", i === 0 ? "bg-[#1e3a8a] text-white" : "bg-white text-[#1e3a8a] shadow-sm border border-slate-100")}>
                        <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-xs mt-2", i === 0 ? "bg-white text-[#1e3a8a]" : "border border-slate-200")}>Foto</div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p className="font-semibold text-sm">{f.name}</p>
                            <p className="text-xs mt-1 leading-tight opacity-90">Formadora para {f.type}</p>
                            <p className="text-xs mt-1 leading-tight opacity-90">Breve descripción de como lo hace.</p>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-[10px] bg-white/20 px-2 py-1 rounded">Video 1</span>
                            <span className="text-[10px] bg-white/20 px-2 py-1 rounded">Video 2</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col items-center justify-center pt-8">
                      <button className="bg-white px-6 py-3 rounded-xl shadow-sm text-[#1e3a8a] text-sm">Crear Nuevo Formador</button>
                    </div>
                  </div>
                  <div className="w-96 bg-gray-500 rounded-lg flex items-center justify-center text-center p-8 text-white h-72">
                    Aquí de debería ver el Video de la promoción médica o de farmacias del formador
                  </div>
                </div>
              )}
              {activeTab === 'cursos' && (
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { title: 'Curso de Manejo de Objeciones', active: true },
                    { title: 'Curso: Cómo lograr al compromiso del médico' },
                    { title: 'Curso: POASDAS paos dpasoa' },
                    { title: 'Curso: impor asi iajs daosd a d' },
                    { title: 'Curso oapijd ai da. la isdjad' },
                    { title: 'Curso: pouidjfhj aokpasdo ika' },
                    { title: 'Curso: oiasjdas d as farmacias' },
                    { title: 'Curso: oas. Oaisi dasjsapsdasd' },
                  ].map((c, i) => (
                    <div key={i} className={cn("p-5 rounded-3xl h-40 flex flex-col", c.active ? "bg-[#1e3a8a] text-white" : "bg-white text-[#1e3a8a] shadow-sm border border-slate-100")}>
                      <p className="font-semibold text-sm mb-2">{c.title}</p>
                      <div className="mt-auto opacity-80 text-xs space-y-0.5">
                        <p>Fecha: 1 Septiembre 2026</p>
                        <p>Instructor: Pedro Pérez</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-end col-span-4 justify-center mt-4">
                    <button className="bg-white px-6 py-3 rounded-xl shadow-sm text-[#1e3a8a] text-sm">Crear Nuevo Curso</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeMgr === 'rrhh' && (
            <div className="space-y-6">
              <div className="flex gap-4">
                {[
                  { id: 'descripcion', label: 'Descripción de la compañía' },
                  { id: 'politicas', label: 'Políticas' },
                  { id: 'faq', label: 'Preguntas frecuentes' },
                  { id: 'nueva', label: 'Crear otra área' },
                ].map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)} className={cn('px-6 py-3 rounded-2xl text-sm font-medium', activeTab === t.id ? 'bg-[#1e3a8a] text-white' : 'bg-white text-[#1e3a8a] shadow-sm')}>{t.label}</button>
                ))}
              </div>
              
              {activeTab === 'descripcion' && (
                <div className="flex gap-12">
                   <div className="space-y-4">
                     <p className="text-[#1e3a8a] text-sm">Historia de la compañía:</p>
                     <div className="space-y-3">
                        <div className="flex items-center gap-4"><button className="bg-white px-4 py-1.5 rounded shadow-sm text-xs text-[#1e3a8a]">Cargar Documento</button><span className="text-[#1e3a8a] text-sm">http//www.companiaejemplo.com</span></div>
                        <div className="flex items-center gap-4"><button className="bg-white px-4 py-1.5 rounded shadow-sm text-xs text-[#1e3a8a]">Cargar Documento</button><span className="text-[#1e3a8a] text-sm">Historia Compañía Ejemplo.pdf</span></div>
                        <div className="flex items-center gap-4"><button className="bg-white px-4 py-1.5 rounded shadow-sm text-xs text-[#1e3a8a]">Cargar Documento</button><span className="text-[#1e3a8a] text-sm">Reporte Anual 2025.pdf</span></div>
                        <div className="flex items-center gap-4"><button className="bg-white px-4 py-1.5 rounded shadow-sm text-xs text-[#1e3a8a]">Cargar Documento</button><span className="text-[#1e3a8a] text-sm">Reportaje El Pais Sep 2023</span></div>
                     </div>
                   </div>
                   <div>
                     <p className="text-[#1e3a8a] text-sm mb-4">Equipo Directivo:</p>
                     <div className="space-y-2">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="flex gap-2">
                           <div className="bg-white px-4 py-2 rounded shadow-sm text-sm text-slate-400 w-32">Nombre</div>
                           <div className="bg-white px-4 py-2 rounded shadow-sm text-sm text-slate-400 w-32">Cargo</div>
                           <div className="bg-white px-4 py-2 rounded shadow-sm text-sm text-slate-400 w-32">Linkedin</div>
                         </div>
                       ))}
                     </div>
                   </div>
                </div>
              )}
              {activeTab === 'politicas' && (
                <div className="space-y-4">
                  <p className="text-[#1e3a8a] text-sm">Políticas:</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4"><button className="bg-white px-4 py-1.5 rounded shadow-sm text-xs text-[#1e3a8a]">Cargar Documento</button><span className="text-[#1e3a8a] text-sm">Política sobre empleo discapacitados</span></div>
                    <div className="flex items-center gap-4"><button className="bg-white px-4 py-1.5 rounded shadow-sm text-xs text-[#1e3a8a]">Cargar Documento</button><span className="text-[#1e3a8a] text-sm">Política de contratación de empleados</span></div>
                    <div className="flex items-center gap-4"><button className="bg-white px-4 py-1.5 rounded shadow-sm text-xs text-[#1e3a8a]">Cargar Documento</button><span className="text-[#1e3a8a] text-sm">Política de vacaciones</span></div>
                    <div className="flex items-center gap-4"><button className="bg-white px-4 py-1.5 rounded shadow-sm text-xs text-[#1e3a8a]">Cargar Documento</button><span className="text-[#1e3a8a] text-sm">Política xyz</span></div>
                  </div>
                  <div className="pt-8 flex justify-center"><button className="bg-white px-6 py-3 rounded-xl shadow-sm text-[#1e3a8a] text-sm text-center">Cargar Nueva<br/>Política</button></div>
                </div>
              )}
            </div>
          )}

          {/* Fallback for other tabs / managers */}
          {['comercial', 'marketing', 'marca', 'medico', 'compliance'].includes(activeMgr) && (
            <div className="p-8 flex items-center justify-center">
              <p className="text-[#1e3a8a] opacity-60">Sección en construcción para el prototipo</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
