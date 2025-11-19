  <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sistema de Salud - Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="{{ asset('css/welcome.css') }}">
</head>
<body>
  <header>
    <div class="title"> SISTEMA DE GESTIÓN DE FICHAS MÉDICAS</div>
    <nav>
      <a href=''>Inicio</a>
      <a href="/dashboard">Dashboard</a>
      <a href="#">Reportes</a>
      <a href="#">Fichas Médicas</a>
      <a href="#">Dr. Carlos Mendoza</a>
    </nav>
  </header>
  <main>
  <div class="card_titulo">
    <h3>Bienvenido/a Dr. Carlos Mendoza</h3>
    <p class="subtitulo">Hoy es lunes, 27 de octubre</p>
  </div>

  <div class="cards">
    <div class="card-opcion">
      <div class="card-contenido">
        <div class="icono">
          <i class="bi bi-bar-chart"></i>
        </div>
        <div class="texto">
          <h4>Dashboard</h4>
          <p>Métricas y estadísticas generales</p>
        </div>
      </div>
      <a href="/dashboard" class="btn-flecha">
        <i class="bi bi-arrow-right"></i>
      </a>
    </div>
    <div class="card-opcion">
      <div class="card-contenido">
        <div class="icono">
          <i class="bi bi-file-earmark-bar-graph"></i>
        </div>
        <div class="texto">
          <h4>Reportes</h4>
          <p>Informes detallados y exportación</p>
        </div>
      </div>
      <button class="btn-flecha">
        <i class="bi bi-arrow-right"></i>
      </button>
    </div>

    <div class="card-opcion">
      <div class="card-contenido">
        <div class="icono">
          <i class="bi bi-people"></i>
        </div>
        <div class="texto">
          <h4>Fichas Médicas</h4>
          <p>Gestión de pacientes</p>
        </div>
      </div>
      <button class="btn-flecha">
        <i class="bi bi-arrow-right"></i>
      </button>
    </div>
    <div class="card-opcion">
      <div class="card-contenido">
        <div class="icono" style="background-color: #e9f7ef; color: #198754;">
          <i class="bi bi-plus-lg"></i>
        </div>
        <div class="texto">
          <h4>Nueva Ficha Médica</h4>
          <p>Registrar nuevo paciente</p>
        </div>
      </div>
      <button class="btn-flecha">
        <i class="bi bi-arrow-right"></i>
      </button>
    </div>
  </div>

  <div class="actividad-reciente">
  <h3>Actividad reciente</h3>
  <div class="card-actividad">
    <div class="card-contenido">
      <div class="icono">
        <i class="bi bi-people"></i>
      </div>
      <div class="texto">
        <h4>Pedro Sánchez</h4>
        <p>Consulta Finalizada - Cardiología</p>
      </div>
    </div>
  </div>

  <div class="card-actividad">
    <div class="card-contenido">
      <div class="icono">
        <i class="bi bi-people"></i>
      </div>
      <div class="texto">
        <h4>Ignacia Fernandez</h4>
        <p>Consulta Finalizada - Pediatría</p>
      </div>
    </div>
  </div>

  <div class="card-actividad">
    <div class="card-contenido">
      <div class="icono">
        <i class="bi bi-people"></i>
      </div>
      <div class="texto">
        <h4>Jaime Gonzalez</h4>
        <p>Consulta Finalizada - Medicina General</p>
      </div>
    </div>
  </div>
</div>

</main>

</body>
</html>
