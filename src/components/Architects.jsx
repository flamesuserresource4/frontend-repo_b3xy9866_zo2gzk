import { useEffect, useRef, useState } from 'react'

const mockData = {
  arquitectos: [
    {
      id: 1,
      nombre: 'María Cifuentes',
      fecha_nacimiento: '1972-03-12',
      fecha_muerte: null,
      biografia:
        'Líneas sobrias, tradición reinterpretada y atención artesanal al detalle.',
      foto:
        'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 2,
      nombre: 'J. R. Valcárcel',
      fecha_nacimiento: '1946-07-01',
      fecha_muerte: '2019-10-10',
      biografia:
        'Racionalismo cálido en diálogo con el paisaje urbano clásico.',
      foto:
        'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 3,
      nombre: 'Elena Prats',
      fecha_nacimiento: '1981-09-05',
      fecha_muerte: null,
      biografia:
        'Estructuras ligeras, geometrías puras y materiales nobles.',
      foto:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: 4,
      nombre: 'Diego Serrahima',
      fecha_nacimiento: '1965-11-21',
      fecha_muerte: null,
      biografia:
        'Espacios atemporales con guiños a la tradición mediterránea.',
      foto:
        'https://images.unsplash.com/photo-1615486632359-4ff1b145c1f5?q=80&w=1200&auto=format&fit=crop',
    },
  ],
  paradas: [
    {
      id: 101,
      nombre: 'Casa Arboleda',
      fecha_inicio: 1999,
      fecha_fin: null,
      descripcion: 'Vivienda unifamiliar con patio porticado.',
      tipo: 'vivienda',
      arquitecto_ids: [2],
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
      arquitecto_ids: [3],
      imagenes: [
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1200&auto=format&fit=crop',
      ],
    },
    {
      id: 103,
      nombre: 'Teatro del Alba',
      fecha_inicio: 1987,
      fecha_fin: 1989,
      descripcion:
        'Centro de artes escénicas con caja escénica de madera.',
      tipo: 'ocio',
      arquitecto_ids: [2, 4],
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
      arquitecto_ids: [1],
      imagenes: [
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop',
      ],
    },
  ],
}

export default function Architects({ onOpenModal }) {
  const containerRef = useRef(null)
  const [init, setInit] = useState(false)

  useEffect(() => {
    if (init) return
    setInit(true)
    const el = containerRef.current

    const update = () => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      Array.from(el.querySelectorAll('.arch-card')).forEach((card) => {
        const r = card.getBoundingClientRect()
        const center = r.left + r.width / 2
        const delta = (center - (rect.left + rect.width / 2)) / rect.width
        const rotate = -delta * 28
        const scale = 1 - Math.min(Math.abs(delta) * 0.6, 0.6)
        card.style.transform = `translateZ(0) rotateY(${rotate}deg) scale(${scale})`
        card.style.filter = `saturate(${0.9 + (1 - Math.abs(delta)) * 0.4})`
      })
    }

    update()
    const onScroll = () => requestAnimationFrame(update)
    const onResize = () => requestAnimationFrame(update)
    el?.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => {
      el?.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [init])

  const scrollBy = (dx) => {
    containerRef.current?.scrollBy({ left: dx, behavior: 'smooth' })
  }

  const verObras = (arqId) => {
    const arq = mockData.arquitectos.find((a) => a.id === arqId)
    const obras = mockData.paradas.filter((p) => p.arquitecto_ids.includes(arqId))
    const html = `
      <h3 style="margin-bottom:8px">${arq.nombre} — Obras</h3>
      <ul style="list-style:disc; padding-left:16px">
        ${obras
          .map(
            (o) => `<li><strong>${o.nombre}</strong> (${o.fecha_inicio}${
              o.fecha_fin ? '–' + o.fecha_fin : ''
            }) — ${o.tipo}</li>`
          )
          .join('')}
      </ul>
    `
    onOpenModal({
      title: arq.nombre,
      foto: arq.foto,
      html,
    })
  }

  const verBio = (arqId) => {
    const arq = mockData.arquitectos.find((a) => a.id === arqId)
    const html = `<p style="margin-top:8px">${arq.biografia}</p>`
    onOpenModal({ title: arq.nombre, foto: arq.foto, html })
  }

  return (
    <section className="h-full">
      <div className="flex items-baseline gap-3 mb-3">
        <h2 className="font-serif text-2xl text-[var(--ink)]">Arquitectos</h2>
        <p className="text-sm text-black/60">Desliza o usa las flechas</p>
      </div>

      <div className="relative h-[calc(100%-40px)]">
        <button
          onClick={() => scrollBy(-340)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-black/20 bg-white shadow-xl hover:-translate-y-[52%] transition"
          aria-label="Anterior"
        >
          ‹
        </button>

        <div
          ref={containerRef}
          className="h-full flex gap-6 overflow-auto scroll-smooth px-5 py-4 [perspective:1200px]"
        >
          {mockData.arquitectos.map((a) => (
            <article
              key={a.id}
              className="arch-card w-[300px] min-h-[420px] bg-white rounded-[18px] p-3 shadow-[0_15px_40px_rgba(11,22,51,0.2)] border border-black/10 will-change-transform"
            >
              <div
                className="w-full h-[200px] rounded-xl bg-center bg-cover shadow-inner"
                style={{ backgroundImage: `url(${a.foto})` }}
              />
              <div className="pt-2 px-1">
                <div className="flex gap-2 text-xs text-black/60 mb-1">
                  <span>{a.fecha_nacimiento || 's. XX'}</span>
                  <span>·</span>
                  <span>{a.fecha_muerte || '—'}</span>
                </div>
                <h3 className="text-lg font-semibold">{a.nombre}</h3>
                <p className="text-sm text-black/70 leading-relaxed mt-1">{a.biografia}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => verObras(a.id)}
                    className="px-3 py-2 rounded-lg font-semibold text-white border border-[#274a6d] bg-gradient-to-b from-[#2e5a85] to-[#1d3c58]"
                  >
                    Ver obras
                  </button>
                  <button
                    onClick={() => verBio(a.id)}
                    className="px-3 py-2 rounded-lg font-semibold border border-black/15 bg-white"
                  >
                    Biografía
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          onClick={() => scrollBy(340)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-black/20 bg-white shadow-xl hover:-translate-y-[52%] transition"
          aria-label="Siguiente"
        >
          ›
        </button>
      </div>
    </section>
  )
}
