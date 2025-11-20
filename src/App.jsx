import { useState } from 'react'
import Architects from './components/Architects'
import Timeline from './components/Timeline'
import MapView from './components/MapView'
import Layout from './components/Layout'

function App() {
  const [modal, setModal] = useState(null)

  return (
    <div className="min-h-screen" style={{ ['--ink']: '#131d4f', ['--parchment']: '#efe4d2', ['--sea']: '#2e5a85', ['--terra']: '#954c2e' }}>
      <Layout
        children={{
          architects: (
            <>
              <Architects
                onOpenModal={(data) =>
                  setModal({ title: data.title, foto: data.foto, html: data.html })
                }
              />
              {/* Modal */}
              {modal && (
                <div className="fixed inset-0 z-40">
                  <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setModal(null)}
                  />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,90vw)] bg-white rounded-2xl border border-black/10 shadow-[0_30px_70px_rgba(0,0,0,0.4)] p-4">
                    <button
                      className="absolute right-2 top-2 w-8 h-8 rounded-lg border border-black/20"
                      onClick={() => setModal(null)}
                    >
                      ×
                    </button>
                    <div className="grid grid-cols-[180px_1fr] gap-3 items-start">
                      <div
                        className="w-[180px] h-[220px] rounded-xl bg-center bg-cover shadow-inner border border-black/10"
                        style={{ backgroundImage: `url(${modal.foto})` }}
                      />
                      <div>
                        <h2 className="text-xl font-semibold mb-1">{modal.title}</h2>
                        <div dangerouslySetInnerHTML={{ __html: modal.html }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ),
          timeline: <Timeline />,
          map: <MapView />,
        }}
      />
    </div>
  )
}

export default App
