<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sistema de Salud - Reportes</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link href="/css/reporte.css" rel="stylesheet">
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
        
        <div class="form-group">
          <div class="form-row">
            <div>
              <label for="report-type">Tipo de Reporte</label>
              <select id="report-type" class="select-input">
                <option value="consultas">Consultas por periodo</option>
                <option value="pacientes">Pacientes nuevos</option>
                <option value="hospitalizaciones">Hospitalizaciones</option>
                <option value="cirugias">Cirugías programadas</option>
                <option value="medicamentos">Uso de medicamentos</option>
                <option value="diagnosticos">Diagnósticos frecuentes</option>
              </select>
            </div>
            <div>
              <label for="period">Periodo</label>
              <select id="period" class="select-input">
                <option value="last-month">Último mes</option>
                <option value="last-week">Última semana</option>
                <option value="last-quarter">Último trimestre</option>
                <option value="last-year">Último año</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>
          </div>
          
          <div id="custom-dates" style="display: none;">
            <div class="form-row">
              <div>
                <label for="start-date">Fecha de inicio</label>
                <input type="date" id="start-date" class="date-input">
              </div>
              <div>
                <label for="end-date">Fecha de fin</label>
                <input type="date" id="end-date" class="date-input">
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn btn-primary">
            <i class="bi bi-file-earmark-pdf"></i>
            Generar Reporte
          </button>
        </div>

        <div class="divider"></div>

        <h3 class="section-title">Resumen del Periodo Seleccionado</h3>
        
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">342</div>
            <div class="metric-label">Consultas</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">89</div>
            <div class="metric-label">Nuevos Pacientes</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">23</div>
            <div class="metric-label">Hospitalizaciones</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">12</div>
            <div class="metric-label">Cirugías</div>
          </div>
        </div>
      </section>

      <section class="export-section">
        <h2 class="section-title">Exportar</h2>
        
        <div class="reports-list">
          <div class="report-item">
            <div class="report-info">
              <div class="report-name">Consultas Junio</div>
              <div class="report-details">PDF - 2,3 MB</div>
            </div>
            <button class="download-btn">
              <i class="bi bi-download"></i>
              Descargar
            </button>
          </div>
          
          <div class="report-item">
            <div class="report-info">
              <div class="report-name">Disposiciones C2</div>
              <div class="report-details">Excel - 1,8 MB</div>
            </div>
            <button class="download-btn">
              <i class="bi bi-download"></i>
              Descargar
            </button>
          </div>
          
          <div class="report-item">
            <div class="report-info">
              <div class="report-name">Medicamentos Mayo</div>
              <div class="report-details">PDF - 1,2 MB</div>
            </div>
            <button class="download-btn">
              <i class="bi bi-download"></i>
              Descargar
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>

  <script>
    // Mostrar/ocultar fechas personalizadas
    document.getElementById('period').addEventListener('change', function() {
      const customDates = document.getElementById('custom-dates');
      if (this.value === 'custom') {
        customDates.style.display = 'block';
      } else {
        customDates.style.display = 'none';
      }
    });

    // Funcionalidad de descarga
    document.querySelectorAll('.download-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const reportName = this.closest('.report-item').querySelector('.report-name').textContent;
        alert(`Descargando: ${reportName}`);
        // Aquí iría la lógica real de descarga
      });
    });

    // Generar reporte
    document.querySelector('.btn-primary').addEventListener('click', function() {
      const reportType = document.getElementById('report-type').value;
      const period = document.getElementById('period').value;
      
      let message = `Generando reporte de ${document.getElementById('report-type').options[document.getElementById('report-type').selectedIndex].text}`;
      message += ` para el periodo: ${document.getElementById('period').options[document.getElementById('period').selectedIndex].text}`;
      
      alert(message);
      // Aquí iría la lógica real de generación de reportes
    });
  </script>
</body>
</html>