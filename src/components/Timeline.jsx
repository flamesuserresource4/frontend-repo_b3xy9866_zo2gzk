import { useEffect, useMemo, useRef, useState } from 'react'

const mockParadas = [
  {
    id: 101,
    nombre: 'Casa Arboleda',
    fecha_inicio: 1999,
    fecha_fin: null,
    descripcion: 'Vivienda unifamiliar con patio porticado.',
    tipo: 'vivienda',
    imagenes: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    id: 102,
    nombre: 'Torre Horizonte',
    fecha_inicio: 2010,
    fecha_fin: 2013,
    descripcion: 'Oficinas con doble piel cerámica.',
    tipo: 'oficina',
    imagenes: [
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    id: 103,
    nombre: 'Teatro del Alba',
    fecha_inicio: 1987,
    fecha_fin: 1989,
    descripcion: 'Centro de artes escénicas con caja escénica de madera.',
    tipo: 'ocio',
    imagenes: [
      'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  {
    id: 104,
    nombre: 'Residencia Patio Azul',
    fecha_inicio: 2003,
    fecha_fin: 2004,
    descripcion: 'Vivienda colectiva con galerías y sombra.',
    tipo: 'vivienda',
    imagenes: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop',
    ],
  },
]

const palette = {
  ink: '#131d4f',
  parchment: '#efe4d2',
  sea: '#2e5a85',
  terra: '#954c2e',
}

export default function Timeline() {
  const tvRef = useRef(null)
  const thRef = useRef(null)
  const popRef = useRef(null)

  const [popover, setPopover] = useState(null)

  const { minYear, maxYear, span } = useMemo(() => {
    const years = mockParadas
      .map((p) => p.fecha_inicio ?? p.fecha_fin)
      .filter(Boolean)
    const min = Math.min(...years, 1850)
    const max = Math.max(...years, new Date().getFullYear())
    return { minYear: min, maxYear: max, span: max - min }
  }, [])

  useEffect(() => {
    const tv = tvRef.current
    const th = thRef.current
    if (!tv || !th) return

    let syncing = false
    const maxHScroll = () => th.scrollWidth - th.clientWidth
    const maxVScroll = () => tv.scrollHeight - tv.clientHeight

    const syncHToV = () => {
      if (syncing) return
      syncing = true
      const t = maxHScroll() ? th.scrollLeft / maxHScroll() : 0
      tv.scrollTop = t * maxVScroll()
      requestAnimationFrame(() => (syncing = false))
    }
    const syncVToH = () => {
      if (syncing) return
      syncing = true
      const t = maxVScroll() ? tv.scrollTop / maxVScroll() : 0
      th.scrollLeft = t * maxHScroll()
      requestAnimationFrame(() => (syncing = false))
    }

    th.addEventListener('scroll', syncHToV, { passive: true })
    tv.addEventListener('scroll', syncVToH, { passive: true })
    return () => {
      th.removeEventListener('scroll', syncHToV)
      tv.removeEventListener('scroll', syncVToH)
    }
  }, [])

  const openPop = (p) => {
    setPopover({
      title: p.nombre,
      img: p.imagenes?.[0],
      info: `${p.fecha_inicio}${p.fecha_fin ? '–' + p.fecha_fin : ''} · ${p.tipo}`,
      desc: p.descripcion,
    })
  }

  return (
    <section className="h-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-3 h-full">
        {/* Vertical */}
        <div className="bg-white/90 rounded-xl border border-black/10 shadow-[0_12px_36px_rgba(11,22,51,0.1)] overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-dashed border-black/10 bg-gradient-to-b from-white to-[#faf7f0]">
            <h2 className="font-serif text-xl text-[var(--ink)]">Vertical</h2>
            <p className="text-xs text-black/60">Scroll dentro de esta columna</p>
          </div>
          <div
            ref={tvRef}
            className="relative flex-1 overflow-auto [perspective:1200px] bg-gradient-to-b from-[#f8f5ef] to-white"
          >
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-1 h-[200%] bg-gradient-to-b from-[var(--sea)] to-[var(--ink)] shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_0_20px_rgba(46,90,133,0.3)]" />
            {mockParadas.map((p, idx) => {
              const y = ((p.fecha_inicio ?? p.fecha_fin) - minYear) / span
              const top = 100 + y * 1400
              const side = idx % 2 === 0 ? 'left' : 'right'
              return (
                <div
                  key={p.id}
                  className={`absolute w-[240px] p-3 rounded-xl bg-white border border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] ${
                    side === 'left'
                      ? '-left-[280px] [transform:translate3d(0,0,0)_rotateY(14deg)]'
                      : 'left-[40px] [transform:translate3d(0,0,0)_rotateY(-14deg)]'
                  }`}
                  style={{ top }}
                  onClick={() => openPop(p)}
                >
                  <div className="font-bold text-[var(--sea)]">{`${p.fecha_inicio}${
                    p.fecha_fin ? '–' + p.fecha_fin : ''
                  }`}</div>
                  <div className="font-bold">{p.nombre}</div>
                  <div className="text-sm text-black/70 mt-1">{p.descripcion}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Horizontal */}
        <div className="bg-white/90 rounded-xl border border-black/10 shadow-[0_12px_36px_rgba(11,22,51,0.1)] overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-dashed border-black/10 bg-gradient-to-b from-white to-[#faf7f0]">
            <h2 className="font-serif text-xl text-[var(--ink)]">Horizontal</h2>
            <p className="text-xs text-black/60">Arrastra la regla</p>
          </div>
          <div className="relative flex-1 overflow-hidden bg-gradient-to-b from-white to-[#f8f5ef]">
            <div className="absolute inset-x-0 top-0 h-[70px] border-b border-dashed border-black/10 bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.12)_0_1px,transparent_1px_40px)] flex items-end gap-10 px-4 pb-1 pointer-events-none select-none">
              {Array.from(
                { length: Math.floor((maxYear - minYear) / (span > 120 ? 10 : 5)) + 1 },
                (_, i) => minYear + i * (span > 120 ? 10 : 5)
              ).map((y) => (
                <div key={y} className="min-w-10 text-center text-sm">
                  {y}
                </div>
              ))}
            </div>
            <div ref={thRef} className="absolute left-0 top-[70px] right-0 bottom-0 overflow-auto whitespace-nowrap">
              {mockParadas.map((p) => {
                const x = ((p.fecha_inicio ?? p.fecha_fin) - minYear) / span
                return (
                  <button
                    key={p.id}
                    className="inline-block align-top m-5 px-3 py-2 min-w-[220px] text-left bg-white border border-black/10 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_30px_rgba(0,0,0,0.12)] transition"
                    style={{ marginLeft: Math.round(x * 1600) }}
                    onClick={() => openPop(p)}
                  >
                    <div className="font-bold text-[var(--terra)]">{`${p.fecha_inicio}${
                      p.fecha_fin ? '–' + p.fecha_fin : ''
                    }`}</div>
                    <div className="font-semibold">{p.nombre}</div>
                    <div className="text-sm text-black/70 mt-1">{p.descripcion}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Popover */}
      {popover && (
        <div className="absolute right-3 bottom-3 w-[360px] max-w-[90vw] bg-white border border-black/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-3">
          <button
            onClick={() => setPopover(null)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full border border-black/20 bg-white"
          >
            ×
          </button>
          <h3 className="font-semibold mb-1">{popover.title}</h3>
          <div className="text-sm text-black/70 mb-2">{popover.info}</div>
          <p className="mb-2 text-sm">{popover.desc}</p>
          {popover.img && (
            <img
              src={popover.img}
              alt=""
              className="w-full rounded-lg shadow-[0_6px_20px_rgba(0,0,0,0.1)]"
            />
          )}
        </div>
      )}
    </section>
  )
}
