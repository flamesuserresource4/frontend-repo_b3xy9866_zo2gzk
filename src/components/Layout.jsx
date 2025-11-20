import { useEffect, useState } from 'react'

export default function Layout({ children }) {
  const [active, setActive] = useState('architects')

  useEffect(() => {
    if (active === 'map' || active === 'timeline') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [active])

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(1200px_800px_at_10%_-10%,#20327d20,transparent), radial-gradient(900px_600px_at_110%_20%,#954c2e10,transparent), #efe4d2' }}>
      <header className="sticky top-0 z-10 backdrop-blur-sm border-b border-black/10" style={{ background: 'linear-gradient(180deg,#ffffffcc,#ffffff80)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full grid place-items-center text-white font-bold text-lg shadow-[0_6px_18px_rgba(0,0,0,0.15)]" style={{ background: 'conic-gradient(from 210deg,#2e5a85,#131d4f,#954c2e)' }}>A</div>
            <div>
              <h1 className="text-base font-serif text-[var(--ink)]">Arquitectura</h1>
              <p className="text-xs text-black/70">Obras y autores</p>
            </div>
          </div>
          <nav className="flex gap-2">
            {[
              { id: 'architects', label: 'Arquitectos' },
              { id: 'timeline', label: 'Línea del tiempo' },
              { id: 'map', label: 'Mapa' },
            ].map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  setActive(t.id)
                }}
                className={`px-3 py-2 rounded-xl border text-sm font-semibold transition ${
                  active === t.id
                    ? 'bg-white border-black/30'
                    : 'bg-white/80 border-black/20 hover:-translate-y-0.5 shadow'
                }`}
              >
                {t.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative">
        <div className={`${active === 'architects' ? 'block' : 'hidden'} h-[calc(100dvh-120px)] px-4 pt-4`}>{children.architects}</div>
        <div className={`${active === 'timeline' ? 'block' : 'hidden'} h-[calc(100dvh-120px)] px-4 pt-4 overflow-hidden`}>{children.timeline}</div>
        <div className={`${active === 'map' ? 'block' : 'hidden'} h-[calc(100dvh-120px)] px-4 pt-4 overflow-hidden`}>{children.map}</div>
      </main>

      <footer className="px-4 py-3 text-xs text-black/70">© Archivo de Arquitectura — Interfaz de exploración</footer>
    </div>
  )
}
