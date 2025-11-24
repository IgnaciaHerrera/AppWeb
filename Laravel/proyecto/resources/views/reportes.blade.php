<!-- resources/views/reportes.blade.php -->
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sistema de Salud - Reportes</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link href="{{ asset('css/reporte.css') }}" rel="stylesheet">
</head>
<body>
  <header>
    <div class="header-content">
      <div class="title">SISTEMA DE GESTIÓN DE FICHAS MÉDICAS</div>
      <nav>
        <a href="/" class="nav-link">Inicio</a>
        <a href="/dashboard" class="nav-link">Dashboard</a>
        <a href="/reportes" class="nav-link active">Reportes</a>
        <a href="/fichas" class="nav-link">Fichas Médicas</a>
        <div class="user-profile">
          <i class="bi bi-person-circle"></i>
          <span>Dr. Carlos Mendoza</span>
        </div>
      </nav>
    </div>
  </header>

  <main class="main-container">
    <section class="page-header">
      <h1>Reportes</h1>
      <p class="page-subtitle">Informes detallados y exportación de datos</p>
    </section>

    <div class="content-grid">
      <section class="report-generation">
        <h2 class="section-title">Generar Reportes</h2>
        
        <form method="GET" action="{{ route('reportes.index') }}">
          <div class="form-group">
            <div class="form-row">
              <div>
                <label for="report-type">Tipo de Reporte</label>
                <select id="report-type" class="select-input" disabled>
                  <option value="consultas">Consultas por periodo</option>
                  <!-- Puedes habilitar otros tipos más adelante -->
                </select>
              </div>
              <div>
                <label for="period">Periodo</label>
                <select id="period" name="periodo" class="select-input">
                  <option value="last-month" {{ $periodo == 'last-month' ? 'selected' : '' }}>Último mes</option>
                  <option value="last-week" {{ $periodo == 'last-week' ? 'selected' : '' }}>Última semana</option>
                  <option value="last-quarter" {{ $periodo == 'last-quarter' ? 'selected' : '' }}>Último trimestre</option>
                  <option value="last-year" {{ $periodo == 'last-year' ? 'selected' : '' }}>Último año</option>
                </select>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-file-earmark-pdf"></i>
              Actualizar Reporte
            </button>
          </div>
        </form>

        <div class="divider"></div>

        <h3 class="section-title">Resumen del Periodo Seleccionado</h3>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">{{ $metrics['consultas'] }}</div>
            <div class="metric-label">Consultas</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ $metrics['nuevos_pacientes'] }}</div>
            <div class="metric-label">Nuevos Pacientes</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ $metrics['hospitalizaciones'] }}</div>
            <div class="metric-label">Hospitalizaciones</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">{{ $metrics['cirugias'] }}</div>
            <div class="metric-label">Cirugías</div>
          </div>
        </div>
      </section>

      <section class="export-section">
        <h2 class="section-title">Reportes Generados</h2>
        
        <div class="reports-list">
          <div class="report-item">
  <div class="report-info">
    <div class="report-name">Consultas {{ ucfirst(str_replace('-', ' ', $periodo)) }}</div>
    <div class="report-details">CSV - Abre en Excel</div>
  </div>
  <a href="{{ route('reportes.export.excel', ['periodo' => $periodo]) }}" class="download-btn">
    <i class="bi bi-download"></i>
    Descargar Datos
  </a>
</div>
        </div>
      </section>
    </div>
  </main>
</body>
</html>