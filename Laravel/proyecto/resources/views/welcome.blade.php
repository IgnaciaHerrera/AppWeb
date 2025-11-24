<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sistema de Salud - Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="{{ asset('css/welcome.css') }}">
</head>
<body>

  <header>
    <div class="header-content">
      <div class="title">SISTEMA DE GESTIÓN DE FICHAS MÉDICAS</div>
      <nav>
        <a href='' class="nav-link active">Inicio</a>
        <a href="/dashboard" class="nav-link">Dashboard</a>
        <a href="/reportes" class="nav-link">Reportes</a>
        <a href="/fichas" class="nav-link">Fichas Médicas</a>
        <div class="user-profile">
  <i class="bi bi-person-circle"></i>
  <form method="POST" action="{{ route('logout') }}" style="display: inline;">
    @csrf
    <button type="submit" class="user-name-btn">
      Dr. Roberto Mendoza
    </button>
  </form>
</div>
      </nav>
    </div>
  </header>
  
  <main class="main-container">
    <section class="welcome-section">
      <div class="welcome-card">
        <h1>Bienvenido/a Dr. Carlos Mendoza</h1>
        <p class="subtitle" id="current-date">Hoy es lunes, 27 de octubre</p>
      </div>
    </section>
    
    <section class="quick-access">
      <h2>Accesos Rápidos</h2>
      <div class="cards-grid">
        <div class="card-option">
          <div class="card-content">
            <div class="icon">
              <i class="bi bi-bar-chart"></i>
            </div>
            <div class="text">
              <h3>Dashboard</h3>
              <p>Métricas y estadísticas generales</p>
            </div>
          </div>
          <a href="/dashboard" class="arrow-btn">
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
        
        <div class="card-option">
          <div class="card-content">
            <div class="icon">
              <i class="bi bi-file-earmark-bar-graph"></i>
            </div>
            <div class="text">
              <h3>Reportes</h3>
              <p>Informes detallados y exportación</p>
            </div>
          </div>
          <a href="/reportes" class="arrow-btn">
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>

        <div class="card-option">
          <div class="card-content">
            <div class="icon">
              <i class="bi bi-people"></i>
            </div>
            <div class="text">
              <h3>Fichas Médicas</h3>
              <p>Gestión de pacientes</p>
            </div>
          </div>
          <a href="/fichas" class="arrow-btn">
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
        
        <div class="card-option">
          <div class="card-content">
            <div class="icon highlight">
              <i class="bi bi-plus-lg"></i>
            </div>
            <div class="text">
              <h3>Nueva Ficha Médica</h3>
              <p>Registrar nuevo paciente</p>
            </div>
          </div>
          <a href="#" class="arrow-btn">
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
    

    <section class="recent-activity">
      <div class="activity-header">
        <h2>Actividad Reciente</h2>
        <a href="#" class="view-all">Ver todo</a>
      </div>
    </section>
  </main>

  <script>
    // Función para actualizar la fecha actual
    function updateCurrentDate() {
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      const today = new Date();
      const formattedDate = today.toLocaleDateString('es-ES', options);
      document.getElementById('current-date').textContent = `Hoy es ${formattedDate}`;
    }
    
    // Actualizar la fecha al cargar la página
    document.addEventListener('DOMContentLoaded', updateCurrentDate);
  </script>
</body>
</html>