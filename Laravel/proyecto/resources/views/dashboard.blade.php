<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sistema de Salud - Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
</head>
<body>
  <header>
    <div class="header-content">
      <div class="title">SISTEMA DE GESTIÓN DE FICHAS MÉDICAS</div>
      <nav>
        <a href="/" class="nav-link">Inicio</a>
        <a href="/dashboard" class="nav-link active">Dashboard</a>
        <a href="/reportes" class="nav-link">Reportes</a>
        <a href="/fichas" class="nav-link">Fichas Médicas</a>
        <div class="user-profile">
          <i class="bi bi-person-circle"></i>
          <span>Dr. Carlos Mendoza</span>
        </div>
      </nav>
    </div>
  </header>

  <main class="dashboard-container">
    <section class="dashboard-header">
      <div class="header-content">
        <h1>Dashboard</h1>
      </div>
    </section>

    <section class="metrics-section">
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon blue">
            <i class="bi bi-calendar-check"></i>
          </div>
          <div class="metric-content">
            <h3>Consultas Hoy</h3>
            <p class="metric-value">24</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon green">
            <i class="bi bi-people"></i>
          </div>
          <div class="metric-content">
            <h3>Pacientes Activos</h3>
            <p class="metric-value">1,247</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon orange">
            <i class="bi bi-hospital"></i>
          </div>
          <div class="metric-content">
            <h3>Hospitalizaciones</h3>
            <p class="metric-value">18</p>
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon red">
            <i class="bi bi-scissors"></i>
          </div>
          <div class="metric-content">
            <h3>Cirugías Programadas</h3>
            <p class="metric-value">7</p>
          </div>
        </div>
      </div>
    </section>

    <section class="charts-section">
      <div class="charts-grid">
        <div class="chart-container">
          <div class="chart-header">
            <h3>Consultas por Mes</h3>
            <div class="chart-actions">
              <button class="action-btn">
                <i class="bi bi-download"></i>
              </button>
              <button class="action-btn">
                <i class="bi bi-three-dots"></i>
              </button>
            </div>
          </div>
          <div class="chart-wrapper">
            <canvas id="consultasChart"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <div class="chart-header">
            <h3>Diagnósticos Frecuentes</h3>
            <div class="chart-actions">
              <button class="action-btn">
                <i class="bi bi-download"></i>
              </button>
              <button class="action-btn">
                <i class="bi bi-three-dots"></i>
              </button>
            </div>
          </div>
          <div class="chart-wrapper">
            <canvas id="diagnosticosChart"></canvas>
          </div>
        </div>
      </div>
    </section> 
  </main>

  <script>
    const mesesEspañol = {
      'January': 'Enero', 'February': 'Febrero', 'March': 'Marzo',
      'April': 'Abril', 'May': 'Mayo', 'June': 'Junio',
      'July': 'Julio', 'August': 'Agosto', 'September': 'Septiembre',
      'October': 'Octubre', 'November': 'Noviembre', 'December': 'Diciembre'
    };

    const ctx1 = document.getElementById('consultasChart').getContext('2d');
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: [
          @foreach ($consultasPorMes as $consulta)
            "{{ $mesesEspañol[$consulta['nombre_mes']] ?? $consulta['nombre_mes'] ?? 'N/A' }}",
          @endforeach
        ],
        datasets: [{
          label: 'Consultas',
          data: [
            @foreach ($consultasPorMes as $consulta)
              {{ $consulta['total_consultas'] ?? 0 }},
            @endforeach
          ],
          backgroundColor: '#1c687f',
          borderRadius: 6,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
              label: function(context) {
                return `Consultas: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: { 
          y: { 
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            title: { display: true, text: 'Número de Consultas' }
          },
          x: {
            grid: { display: false },
            title: { display: true, text: 'Meses' }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });

    const ctx2 = document.getElementById('diagnosticosChart').getContext('2d');
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: [
          @foreach ($diagnosticosFrecuentes as $diagnostico)
            "{{ addslashes($diagnostico['diagnostico'] ?? 'Sin diagnóstico') }}",
          @endforeach
        ],
        datasets: [{
          label: 'Total Consultas',
          data: [
            @foreach ($diagnosticosFrecuentes as $diagnostico)
              {{ $diagnostico['total_consultas'] ?? 0 }},
            @endforeach
          ],
          backgroundColor: '#1c687f',
          borderRadius: 6,
          borderWidth: 0
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
              label: function(context) {
                return `Consultas: ${context.parsed.x}`;
              }
            }
          }
        },
        scales: { 
          x: { 
            beginAtZero: true,
            max: {{ !empty($diagnosticosFrecuentes) ? max(array_column($diagnosticosFrecuentes, 'total_consultas')) + 2 : 10 }},
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            title: { display: true, text: 'Cantidad de Consultas' }
          },
          y: {
            grid: { display: false },
            title: { display: true, text: 'Diagnósticos' }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });
  </script>
</body>
</html>