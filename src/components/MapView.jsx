import { useEffect, useRef, useState } from 'react'

// Leaflet styles from CDN in index.html not available here; we will use simple div markers for mock without external deps

const mockParadas = [
  { id: 101, nombre: 'Casa Arboleda', tipo: 'vivienda', fecha_inicio: 1999, fecha_fin: null, descripcion: 'Vivienda unifamiliar con patio porticado.', coords: [40.4168, -3.7038], imagenes: ['https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop'], ubicacion: 'https://maps.google.com/?q=40.4168,-3.7038' },
  { id: 102, nombre: 'Torre Horizonte', tipo: 'oficina', fecha_inicio: 2010, fecha_fin: 2013, descripcion: 'Oficinas con doble piel cerámica.', coords: [41.3874, 2.1686], imagenes: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1200&auto=format&fit=crop'], ubicacion: 'https://maps.google.com/?q=41.3874,2.1686' },
  { id: 103, nombre: 'Teatro del Alba', tipo: 'ocio', fecha_inicio: 1987, fecha_fin: 1989, descripcion: 'Centro de artes escénicas con caja escénica de madera.', coords: [39.4699, -0.3763], imagenes: ['https://images.unsplash.com/photo-1445985543470-41fba5c3144a?q=80&w=1200&auto=format&fit=crop'], ubicacion: 'https://maps.google.com/?q=39.4699,-0.3763' },
  { id: 104, nombre: 'Residencia Patio Azul', tipo: 'vivienda', fecha_inicio: 2003, fecha_fin: 2004, descripcion: 'Vivienda colectiva con galerías y sombra.', coords: [37.3891, -5.9845], imagenes: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop'], ubicacion: 'https://maps.google.com/?q=37.3891,-5.9845' },
]

const palette = { vivienda: '#2e5a85', ocio: '#954c2e', oficina: '#131d4f' }

// Very light mercator-like projection just for mock positioning within Spain bbox
function project([lat, lng], bbox) {
  const [minLat, minLng, maxLat, maxLng] = bbox // [36, -9.5, 43.8, 3.5] approx Iberia
  const x = (lng - minLng) / (maxLng - minLng)
  const y = 1 - (lat - minLat) / (maxLat - minLat)
  return [x, y]
}

export default function MapView() {
  const wrapRef = useRef(null)
  const [filters, setFilters] = useState({ vivienda: true, ocio: true, oficina: true })
  const [route, setRoute] = useState([])
  const bbox = [36, -9.5, 43.8, 3.5]

  const toggleFilter = (key) => setFilters((f) => ({ ...f, [key]: !f[key] }))
  const clearRoute = () => setRoute([])

  const fitRoute = () => {
    if (!route.length) return
    const el = wrapRef.current
    const xs = route.map((p) => project(p.coords, bbox)[0])
    const ys = route.map((p) => project(p.coords, bbox)[1])
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    // Scroll or zoom not implemented in mock; we can highlight bounds
    el.animate(
      [
        { boxShadow: '0 0 0 0 rgba(29,60,88,0)' },
        { boxShadow: '0 0 0 8px rgba(29,60,88,0.25)' },
        { boxShadow: '0 0 0 0 rgba(29,60,88,0)' },
      ],
      { duration: 900, easing: 'ease-out' }
    )
  }

  const visibleParadas = mockParadas.filter((p) => filters[p.tipo])

  return (
    <section className="h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-serif text-2xl text-[var(--ink)]">Mapa de edificios</h2>
        <div className="flex items-center gap-3 bg-white rounded-xl border border-black/10 shadow-[0_6px_20px_rgba(0,0,0,0.07)] px-3 py-2">
          {['vivienda', 'ocio', 'oficina'].map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters[t]}
                onChange={() => toggleFilter(t)}
                className="accent-[#2e5a85]"
              />
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-3 rounded-full"
                  style={{ background: palette[t] }}
                />
                {t[0].toUpperCase() + t.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 h-[calc(100%-40px)]">
        <div
          ref={wrapRef}
          className="relative w-full h-full rounded-2xl border border-black/10 overflow-hidden shadow-[0_12px_36px_rgba(11,22,51,0.1)]"
          style={{ background: 'linear-gradient(180deg,#dfe9f3,#fff)' }}
        >
          {/* Simple map background */}
          <div className="absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(800px_500px_at_70%_30%,#2e5a85,transparent)' }}
          />

          {/* Mock markers */}
          {visibleParadas.map((p) => {
            const [x, y] = project(p.coords, bbox)
            return (
              <Marker key={p.id} p={p} x={x} y={y} onAddToRoute={() => setRoute((r) => [...r, p])} />
            )
          })}

          {/* Route polyline mock */}
          <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="#1d3c58"
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={route
                .map((p) => {
                  const [x, y] = project(p.coords, bbox)
                  return `${x * 100},${y * 100}`
                })
                .join(' ')}
            />
          </svg>
        </div>

        <div className="bg-white rounded-2xl border border-black/10 shadow-[0_12px_36px_rgba(11,22,51,0.1)] p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Ruta</h3>
            <button onClick={clearRoute} className="px-3 py-1.5 rounded-lg border border-black/15 bg-white">Limpiar</button>
          </div>
          <div className="flex-1 overflow-auto border border-dashed border-black/10 rounded-xl p-2">
            {route.map((p, i) => (
              <div key={i} className="flex items-center gap-2 py-1 border-b border-dashed border-black/10 last:border-0">
                <span className="w-2 h-2 rounded-full" style={{ background: palette[p.tipo] }} />
                <div className="flex-1">
                  <div className="font-medium">{p.nombre}</div>
                  <div className="text-xs text-black/60">{`${p.fecha_inicio}${p.fecha_fin ? '–' + p.fecha_fin : ''}`} · {p.tipo}</div>
                </div>
                <button
                  onClick={() => setRoute((r) => r.filter((_, idx) => idx !== i))}
                  className="px-2 py-1 rounded-md border border-black/10"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-2">
            <button onClick={fitRoute} className="px-3 py-1.5 rounded-lg border border-black/15 bg-white">Enfocar ruta</button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Marker({ p, x, y, onAddToRoute }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-4 h-4 rounded-full border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
        style={{ background: palette[p.tipo] }}
        title={p.nombre}
      />
      {open && (
        <div className="mt-2 w-[240px] bg-white border border-black/10 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.2)] p-2">
          <div className="font-semibold mb-0.5">{p.nombre}</div>
          <div className="text-xs text-black/70 mb-1">{`${p.fecha_inicio}${p.fecha_fin ? '–' + p.fecha_fin : ''}`} · {p.tipo}</div>
          <p className="text-sm mb-2">{p.descripcion}</p>
          {p.imagenes?.[0] && (
            <img src={p.imagenes[0]} alt="" className="w-full rounded-lg mb-2" />
          )}
          <div className="flex gap-2">
            <a
              href={p.ubicacion}
              target="_blank"
              rel="noreferrer"
              className="text-sm underline"
              style={{ color: palette[p.tipo] }}
            >
              Abrir en mapa
            </a>
            <button onClick={onAddToRoute} className="px-2 py-1 text-sm rounded-md border border-black/10">
              Añadir a ruta
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
