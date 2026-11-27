
import './App.css'

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <h1>poumi<span>.</span></h1>
          <p>GESTIÓN</p>
        </div>

        <nav className="navigation">
          <p className="nav-label">MENÚ PRINCIPAL</p>

          <a className="nav-item active" href="#">
            <span>⌂</span> Inicio
          </a>
          <a className="nav-item" href="#">
            <span>▦</span> Inventario
          </a>
          <a className="nav-item" href="#">
            <span>🛒</span> Compras
          </a>
          <a className="nav-item" href="#">
            <span>♨</span> Recetas
          </a>
          <a className="nav-item" href="#">
            <span>▤</span> Producción
          </a>
          <a className="nav-item" href="#">
            <span>↗</span> Finanzas
          </a>

          <p className="nav-label secondary-label">OTROS</p>

          <a className="nav-item" href="#">
            <span>⚙</span> Configuración
          </a>
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
            <span className="breadcrumb">POUMI / Inicio</span>
          </div>
          <div className="topbar-right">
            <span className="status-dot"></span>
            <span>Panel de gestión</span>
          </div>
        </header>

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
                <button type="button">＋ Registrar compra</button>
                <button type="button">＋ Nueva producción</button>
                <button type="button">＋ Crear receta</button>
              </div>
            </section>
          </div>

          <footer className="dashboard-footer">
            <span>POUMI</span>
            <span>Un pequeño refugio dulce.</span>
          </footer>
        </section>
      </main>
    </div>
  )
}

export default App
