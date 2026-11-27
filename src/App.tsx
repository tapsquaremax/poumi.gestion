
import { useState } from 'react'
import Inventory from './pages/Inventory'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('Inicio')
  const [openEntryRequest, setOpenEntryRequest] = useState(0)

  function handleReplenish() {
    setActivePage('Inventario')
    setOpenEntryRequest((previous) => previous + 1)
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <h1>poumi<span>.</span></h1>
          <p>GESTIÓN</p>
        </div>

        <nav className="navigation">
          <p className="nav-label">MENÚ PRINCIPAL</p>

          <button
            type="button"
            className={`nav-item ${activePage === 'Inicio' ? 'active' : ''}`}
            onClick={() => setActivePage('Inicio')}
          >
            <span>⌂</span> Inicio
          </button>

          <button
            type="button"
            className={`nav-item ${activePage === 'Inventario' ? 'active' : ''}`}
            onClick={() => setActivePage('Inventario')}
          >
            <span>▦</span> Inventario
          </button>

          <button type="button" className="nav-item" disabled>
            <span>🛒</span> Compras
          </button>
          <button type="button" className="nav-item" disabled>
            <span>♨</span> Recetas
          </button>
          <button type="button" className="nav-item" disabled>
            <span>▤</span> Producción
          </button>
          <button type="button" className="nav-item" disabled>
            <span>↗</span> Finanzas
          </button>

          <p className="nav-label secondary-label">OTROS</p>

          <button type="button" className="nav-item" disabled>
            <span>⚙</span> Configuración
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">P</div>
          <div>
            <strong>POUMI</strong>
            <small>Administración</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">POUMI / {activePage}</span>
          </div>
          <div className="topbar-right">
            <span className="status-dot"></span>
            <span>Panel de gestión</span>
          </div>
        </header>

        {activePage === 'Inicio' ? (
          <section className="dashboard">
            <div className="welcome">
              <div>
                <p className="eyebrow">TU ESPACIO DE TRABAJO</p>
                <h2>Buenos días ☀️</h2>
                <p>Bienvenido a tu pequeño refugio dulce.</p>
              </div>
              <div className="date">POUMI · Gestión diaria</div>
            </div>

            <div className="section-heading">
              <div>
                <h3>Resumen general</h3>
                <p>Una mirada rápida al estado de tu negocio.</p>
              </div>
            </div>

            <div className="stats-grid">
              <article className="stat-card">
                <div className="stat-top">
                  <span>Inventario</span>
                  <span className="stat-icon">▦</span>
                </div>
                <h4>—</h4>
                <p>Ingredientes registrados</p>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <span>Producción</span>
                  <span className="stat-icon">♨</span>
                </div>
                <h4>—</h4>
                <p>Elaboraciones del período</p>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <span>Ingresos</span>
                  <span className="stat-icon">↗</span>
                </div>
                <h4>$ 0,00</h4>
                <p>Ventas registradas</p>
              </article>

              <article className="stat-card">
                <div className="stat-top">
                  <span>Egresos</span>
                  <span className="stat-icon">↘</span>
                </div>
                <h4>$ 0,00</h4>
                <p>Compras y gastos</p>
              </article>
            </div>

            <div className="bottom-grid">
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Actividad reciente</h3>
                    <p>Los últimos movimientos de POUMI.</p>
                  </div>
                </div>
                <div className="empty-state">
                  <span>✳</span>
                  <strong>Todo comienza acá</strong>
                  <p>Cuando registres compras, producción o ventas, vas a ver tus movimientos aquí.</p>
                </div>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Accesos rápidos</h3>
                    <p>Atajos para tu trabajo diario.</p>
                  </div>
                </div>
                <div className="quick-actions">
                  <button
                    type="button"
                    onClick={() => setActivePage('Inventario')}
                  >
                    ▦ Ver inventario
                  </button>
                  <button
                    type="button"
                    onClick={handleReplenish}
                  >
                    ＋ Reponer stock
                  </button>
                  <button type="button" disabled>＋ Nueva producción</button>
                  <button type="button" disabled>＋ Crear receta</button>
                </div>
              </section>
            </div>

            <footer className="dashboard-footer">
              <span>POUMI</span>
              <span>Un pequeño refugio dulce.</span>
            </footer>
          </section>
        ) : (
          <section className="dashboard">
            <Inventory
              openEntryRequest={openEntryRequest}
              onEntryRequestHandled={() => setOpenEntryRequest(0)}
            />
          </section>
        )}
      </main>
    </div>
  )
}

export default App
