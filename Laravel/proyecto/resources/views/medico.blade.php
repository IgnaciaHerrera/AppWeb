  <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sistema de Salud - Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
</head>
<body>
  <header>
    <div class="title"> SISTEMA DE GESTIÓN DE FICHAS MÉDICAS</div>
    <nav>
      <a href="#">Inicio</a>
      <a href="#">Dashboard</a>
      <a href="#">Reportes</a>
      <a href="#">Fichas Médicas</a>
      <a href="#">Dr. Carlos Mendoza</a>
    </nav>
  </header>

  <main>
    <div class="cards">
      <div class="card blue">
        <h3>Consultas Hoy</h3>
        <p>24</p>
      </div>
      <div class="card green">
        <h3>Pacientes Activos</h3>
        <p>1,247</p>
      </div>
      <div class="card orange">
        <h3>Hospitalizaciones</h3>
        <p>18</p>
      </div>
      <div class="card red">
        <h3>Cirugías Programadas</h3>
        <p>7</p>
      </div>
    </div>
  </main>
</body>
</html>
