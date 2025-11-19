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
      <a href="/">Inicio</a>
      <a href="#">Dashboard</a>
      <a href="#">Reportes</a>
      <a href="#">Fichas Médicas</a>
      <a href="#">Dr. Carlos Mendoza</a>
    </nav>
  </header>

  <main>
    <h2>Dashboard</h2>

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

    <div class="charts">
      <div class="chart-box">
        <h3>Consultas por Mes</h3>
        <canvas id="consultasChart"></canvas>
      </div>
      <div class="chart-box">
        <h3>Diagnósticos Frecuentes</h3>
        <canvas id="diagnosticosChart"></canvas>
      </div>
    </div>

  </main>

  <script>
const mesesEspañol = {
    'January': 'Enero',
    'February': 'Febrero', 
    'March': 'Marzo',
    'April': 'Abril',
    'May': 'Mayo',
    'June': 'Junio',
    'July': 'Julio',
    'August': 'Agosto',
    'September': 'Septiembre',
    'October': 'Octubre',
    'November': 'Noviembre',
    'December': 'Diciembre'
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
        }]
    },
    options: {
        plugins: { 
            legend: { 
                display: false 
            },
            tooltip: {
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
                title: {
                    display: true,
                    text: 'Número de Consultas'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Meses'
                }
            }
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
        }]
    },
    options: {
        indexAxis: 'y',
        plugins: { 
            legend: { 
                display: false 
            },
            tooltip: {
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
                title: {
                    display: true,
                    text: 'Cantidad de Consultas'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Diagnósticos'
                }
            }
        }
    }
});
</script>
</body>
</html>