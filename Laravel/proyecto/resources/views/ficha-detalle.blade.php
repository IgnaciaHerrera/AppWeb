<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ficha Médica - {{ $paciente['nombre'] }} {{ $paciente['apellido'] }}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link href="{{ asset('css/ficha-detalle.css') }}" rel="stylesheet">
</head>
<body>
  <header>
    <div class="header-content">
      <div class="title">SISTEMA DE GESTIÓN DE FICHAS MÉDICAS</div>
      <nav>
        <a href="/" class="nav-link">Inicio</a>
        <a href="/dashboard" class="nav-link">Dashboard</a>
        <a href="/reportes" class="nav-link">Reportes</a>
        <a href="/fichas" class="nav-link">Fichas Médicas</a>
        <div class="user-profile">
          <i class="bi bi-person-circle"></i>
          <span>Dr. Roberto Mendoza</span>
        </div>
      </nav>
    </div>
  </header>

  <main class="main-container">
    <div class="breadcrumb">
      <a href="/fichas">Fichas Médicas</a> > <span>{{ $paciente['nombre'] }} {{ $paciente['apellido'] }}</span>
    </div>

    <!-- Patient Header -->
    <div class="patient-header">
      <div class="patient-info-card">
        <div class="patient-avatar">
          <i class="bi bi-person-fill"></i>
        </div>
        <div class="patient-details">
          <h3>{{ $paciente['nombre'] }} {{ $paciente['apellido'] }}</h3>
          <div class="patient-meta">
            <div class="meta-item">
              <i class="bi bi-envelope"></i>
              <span>{{ $paciente['email'] }}</span>
            </div>
            <div class="meta-item">
              <i class="bi bi-calendar"></i>
              <span>{{ $paciente['edad'] }} años</span>
            </div>
            <div class="meta-item">
              <i class="bi bi-droplet"></i>
              <span>{{ $paciente['tipo_sanguineo'] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button class="tab-button active" data-tab="consultas">Consultas</button>
      <button class="tab-button" data-tab="medicamentos">Medicamentos</button>
      <button class="tab-button" data-tab="examenes">Exámenes</button>
      <button class="tab-button" data-tab="hospitalizaciones">Hospitalizaciones</button>
      <button class="tab-button" data-tab="cirugias">Cirugías</button>
      <button class="tab-button" data-tab="alergias">Alergias</button>
      <button class="tab-button" data-tab="recetas">Recetas</button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">

     <!-- Consultas -->
<div id="consultas" class="tab-pane active">
  @if(isset($consultas) && count($consultas) > 0)
    @foreach($consultas as $consulta)
      <div class="consultation-card">
        <div class="consultation-header">
          <div class="section-title">
            <i class="bi bi-stethoscope"></i>
            {{ $consulta['tipo_consulta'] ?? 'Consulta General' }}
          </div>
          <div class="consultation-date">
            {{ \Carbon\Carbon::parse($consulta['fecha'])->format('d/m/Y') }}
          </div>
        </div>
        <div class="consultation-body">
          <div class="consultation-doctor">
            <strong>Médico:</strong> {{ $consulta['medico_nombre'] }} {{ $consulta['medico_apellido'] }}
            @if(isset($consulta['especialidad']) && $consulta['especialidad'])
              - {{ $consulta['especialidad'] }}
            @endif
          </div>
          <div class="consultation-diagnosis">
            <div class="field-label">Diagnóstico</div>
            <div class="field-value">{{ $consulta['diagnostico'] }}</div>
          </div>
          <div class="consultation-treatment">
            <div class="field-label">Tratamiento</div>
            <div class="field-value">{{ $consulta['tratamiento'] }}</div>
          </div>
          @if(isset($consulta['proxima_consulta']))
            <div class="consultation-next">
              <div class="field-label">Próximo Control</div>
              <div class="field-value">{{ \Carbon\Carbon::parse($consulta['proxima_consulta'])->format('d/m/Y') }}</div>
              <div class="consultation-status">
                <span class="status-badge 
                  @if($consulta['estado'] == 'Completada') status-active
                  @elseif($consulta['estado'] == 'Con seguimiento') status-warning
                  @else status-inactive
                  @endif">
                  {{ $consulta['estado'] }}
                </span>
              </div>
            </div>
          @endif
        </div>
      </div>
    @endforeach
  @else
    <div class="empty-state">
      <i class="bi bi-file-earmark-text"></i>
      <p>No hay consultas registradas.</p>
    </div>
  @endif
</div>

      <!-- Medicamentos -->
<div id="medicamentos" class="tab-pane">
  @if(isset($medicamentos) && count($medicamentos) > 0)
    <div class="medications-title">
      <i class="bi bi-capsule"></i>
      Medicamentos Activos
    </div>
    <div class="medication-list">
      @foreach($medicamentos as $medicamento)
        <div class="medication-item">
          <div class="medication-name">{{ $medicamento['nombre'] }}</div>
          <div class="medication-dosage">Cantidad: {{ $medicamento['dosis'] }}</div>
          <div class="medication-frequency">Frecuencia: {{ $medicamento['frecuencia'] }}</div>
          <div class="medication-duration">Inicio: {{ $medicamento['duracion'] }}</div>
          <div class="medication-status active">Activo</div>
        </div>
      @endforeach
    </div>

    <div class="history-title">
      <i class="bi bi-clock-history"></i>
      Historial de Medicamentos
    </div>
    <div class="medication-list">
      <!-- Aquí podrías mostrar medicamentos antiguos si los tienes -->
      <div class="empty-state">
        <i class="bi bi-clock-history"></i>
        <p>No hay medicamentos antiguos registrados.</p>
      </div>
    </div>
  @else
    <div class="empty-state">
      <i class="bi bi-capsule"></i>
      <p>No hay medicamentos registrados.</p>
    </div>
  @endif
</div>

<!-- Exámenes -->
<div id="examenes" class="tab-pane">
  @if(isset($examenes) && count($examenes) > 0)
    <div class="section-title">
      <i class="bi bi-file-medical"></i>
      Exámenes Registrados
    </div>
    @foreach($examenes as $examen)
      <div class="exam-item">
        <div class="exam-name">{{ $examen['nombre'] }}</div>
        <div class="exam-procedure">Procedimiento: {{ $examen['procedimiento'] }}</div>
        <div class="exam-treatment">Tratamiento: {{ $examen['tratamiento'] }}</div>

        @if(isset($examen['detalles']) && count($examen['detalles']) > 0)
          <div class="lab-exam-grid">
            @foreach($examen['detalles'] as $detalle)
              <div class="lab-exam-item">
                <div class="value">{{ $detalle['valor'] }} {{ $detalle['unidad'] }}</div>
                <div class="label">{{ $detalle['dato'] }}</div>
                <div class="status 
                  @if($detalle['valor'] >= explode('-', $detalle['rango_referencia'])[0] && $detalle['valor'] <= explode('-', $detalle['rango_referencia'])[1]) status-normal
                  @else status-elevado
                  @endif">
                  {{ $detalle['rango_referencia'] }}
                </div>
              </div>
            @endforeach
          </div>
        @endif
      </div>
    @endforeach
  @else
    <div class="empty-state">
      <i class="bi bi-file-medical"></i>
      <p>No hay exámenes registrados.</p>
    </div>
  @endif
</div>
      <!-- Hospitalizaciones -->
<div id="hospitalizaciones" class="tab-pane">
  @if(isset($hospitalizaciones) && count($hospitalizaciones) > 0)
    <div class="section-title">
      <i class="bi bi-hospital"></i>
      Hospitalizaciones Registradas
    </div>
    <div class="hospitalization-list">
      @foreach($hospitalizaciones as $hosp)
        <div class="hospitalization-item">
          <div class="hospitalization-header">
            <div class="hospitalization-reason">
              <strong>Motivo:</strong> {{ $hosp['motivo'] }}
            </div>
            @if(isset($hosp['hospital']))
              <div class="hospitalization-hospital">
                <strong>Hospital:</strong> {{ $hosp['hospital'] }}
              </div>
            @endif
          </div>
          
          <div class="hospitalization-dates">
            <div class="hospitalization-date">
              <strong>Fecha de ingreso:</strong> 
              {{ \Carbon\Carbon::parse($hosp['fecha_ingreso'])->format('d/m/Y') }}
            </div>
            @if(isset($hosp['fecha_egreso']) && $hosp['fecha_egreso'])
              <div class="hospitalization-date">
                <strong>Fecha de egreso:</strong> 
                {{ \Carbon\Carbon::parse($hosp['fecha_egreso'])->format('d/m/Y') }}
              </div>
            @else
              <div class="hospitalization-date">
                <strong>Fecha de egreso:</strong> <span class="text-muted">Sin egreso</span>
              </div>
            @endif
          </div>

          <div class="hospitalization-status">
            <span class="status-badge 
              @if($hosp['estado'] == 'Alta') status-active
              @elseif($hosp['estado'] == 'Hospitalizado') status-warning
              @else status-inactive
              @endif">
              {{ $hosp['estado'] }}
            </span>
          </div>
        </div>
      @endforeach
    </div>
  @else
    <div class="empty-state">
      <i class="bi bi-hospital"></i>
      <p>No hay hospitalizaciones registradas.</p>
    </div>
  @endif
</div>

      <!-- Cirugías -->
      <div id="cirugias" class="tab-pane">
        @if(isset($cirugias) && count($cirugias) > 0)
          <div class="surgery-list">
            @foreach($cirugias as $cirugia)
              <div class="surgery-item">
                <div class="surgery-name">{{ $cirugia['nombre'] }}</div>
                <div class="surgery-date">{{ \Carbon\Carbon::parse($cirugia['fecha'])->format('d/m/Y') }}</div>
                <div class="surgery-medic">{{ $cirugia['medico'] }}</div>
                <div class="surgery-status">
                  <span class="status-badge 
                    @if($cirugia['estado'] == 'Completada') status-active
                    @else status-inactive
                    @endif">
                    {{ $cirugia['estado'] }}
                  </span>
                </div>
              </div>
            @endforeach
          </div>
        @else
          <div class="empty-state">
            <i class="bi bi-scissors"></i>
            <p>No hay cirugías registradas.</p>
          </div>
        @endif
      </div>

<!-- Alergias -->
<div id="alergias" class="tab-pane">
  @if(isset($alergias) && count($alergias) > 0)
    <div class="section-title">
      <i class="bi bi-bug"></i>
      Alergias Registradas
    </div>
    @foreach($alergias as $alergia)
      <div class="allergy-item 
        @if($alergia['grado'] == 'Severo') severe
        @elseif($alergia['grado'] == 'Moderado') moderate
        @else mild
        @endif">
        <div class="allergy-name">{{ $alergia['nombre'] }}</div>
        <div class="allergy-description">{{ $alergia['descripcion'] }}</div>
        <div class="allergy-severity">
          <strong>Grado:</strong> 
          <span class="medication-status 
            @if($alergia['grado'] == 'Severo') temporal
            @elseif($alergia['grado'] == 'Moderado') completed
            @else active
            @endif">
            {{ $alergia['grado'] }}
          </span>
        </div>
        <div class="allergy-date">
          <strong>Fecha de registro:</strong> 
          {{ \Carbon\Carbon::parse($alergia['fechaRegistro'])->format('d/m/Y H:i') }}
        </div>
      </div>
    @endforeach
  @else
    <div class="empty-state">
      <i class="bi bi-bug"></i>
      <p>No hay alergias registradas.</p>
    </div>
  @endif
</div>

      <!-- Recetas -->
      <div id="recetas" class="tab-pane">
        @if(isset($recetas) && count($recetas) > 0)
          <div class="prescription-list">
            @foreach($recetas as $receta)
              <div class="prescription-item">
                <div class="prescription-medicamento">{{ $receta['medicamento'] }}</div>
                <div class="prescription-dosage">{{ $receta['dosis'] }}</div>
                <div class="prescription-frecuency">{{ $receta['frecuencia'] }}</div>
              </div>
            @endforeach
          </div>
        @else
          <div class="empty-state">
            <i class="bi bi-prescription"></i>
            <p>No hay recetas registradas.</p>
          </div>
        @endif
      </div>

    </div>

  </main>

  <script>
    // Funcionalidad de pestañas
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', function() {
        // Remover clase activa de todos los botones y paneles
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

        // Agregar clase activa al botón clickeado
        this.classList.add('active');

        // Mostrar el panel correspondiente
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
      });
    });

    // Funcionalidad de búsqueda (opcional, si quieres buscar dentro de las consultas)
    // document.getElementById('searchInput').addEventListener('input', function(e) {
    //   const searchTerm = e.target.value.toLowerCase();
    //   const rows = document.querySelectorAll('.consultation-card');
    //   rows.forEach(row => {
    //     const text = row.textContent.toLowerCase();
    //     row.style.display = text.includes(searchTerm) ? '' : 'none';
    //   });
    // });
  </script>
</body>
</html>