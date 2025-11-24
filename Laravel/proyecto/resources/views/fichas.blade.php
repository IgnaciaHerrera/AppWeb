<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sistema de Salud - Fichas Médicas</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link href="{{ asset('css/fichas.css') }}" rel="stylesheet">
</head>
<body>
  <header>
    <div class="header-content">
      <div class="title">SISTEMA DE GESTIÓN DE FICHAS MÉDICAS</div>
      <nav>
        <a href="/" class="nav-link">Inicio</a>
        <a href="/dashboard" class="nav-link">Dashboard</a>
        <a href="/reportes" class="nav-link">Reportes</a>
        <a href="/fichas" class="nav-link active">Fichas Médicas</a>
        <div class="user-profile">
          <i class="bi bi-person-circle"></i>
          <span>Dr. Roberto Mendoza</span>
        </div>
      </nav>
    </div>
  </header>

  <main class="main-container">
    <section class="page-header">
      <h1>Fichas Médicas</h1>
      <p class="page-subtitle">Gestión de pacientes y historiales médicos</p>
    </section>
    <section class="search-actions">
      <div class="search-box">
        <i class="bi bi-search search-icon"></i>
        <input type="text" id="searchInput" class="search-input" placeholder="Buscar por nombre o RUT...">
      </div>
      <div class="action-buttons">
        <button class="btn btn-outline">
          <i class="bi bi-filter"></i>
          Filtrar
        </button>
        <button class="btn btn-primary">
          <i class="bi bi-plus-lg"></i>
          Nueva Ficha
        </button>
      </div>
    </section>

    <section class="table-container">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Edad</th>
              <th>Tipo Sanguíneo</th>
              <th>Última Consulta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @if(isset($pacientes) && count($pacientes) > 0)
              @foreach($pacientes as $paciente)
                <tr>
                  <td>
                    <div class="patient-info">
                      <span class="patient-name">{{ $paciente['nombre'] }} {{ $paciente['apellido'] }}</span>
                      <span class="patient-phone">{{ $paciente['telefono'] }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="patient-email">{{ $paciente['email'] }}</span>
                  </td>
                  <td>{{ $paciente['edad'] }} años</td>
                  <td>{{ $paciente['tipo_sanguineo'] }}</td>
                  <td>{{ \Carbon\Carbon::parse($paciente['ultima_consulta'])->format('d/m/Y') }}</td>
                  <td>
                    <div class="action-buttons-cell">
                     <a href="{{ route('fichas.show', $paciente['id']) }}" class="action-btn" title="Ver ficha">
                        <i class="bi bi-eye"></i>
                      </a>
                      <a href="{{ route('fichas.edit', $paciente['id']) }}" class="action-btn" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </a>
                      <form action="{{ route('fichas.destroy', $paciente['id']) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="action-btn" title="Eliminar" onclick="return confirm('¿Estás seguro de eliminar esta ficha?')">
                          <i class="bi bi-trash"></i>
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              @endforeach
            @else
              <tr>
                <td colspan="7" class="text-center">No hay pacientes registrados.</td>
              </tr>
            @endif
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <div class="pagination-info">
          Mostrando {{ count($pacientes) }} paciente{{ count($pacientes) != 1 ? 's' : '' }} de {{ count($pacientes) }}
        </div>
        <div class="pagination-controls">
          <button class="pagination-btn" disabled>
            <i class="bi bi-chevron-left"></i>
          </button>
          <button class="pagination-btn active">1</button>
          <button class="pagination-btn">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  </main>

  <script>
    // Funcionalidad básica de búsqueda
    document.getElementById('searchInput').addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('tbody tr');
      
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
      });
    });

    // Funcionalidad de botones de acción (ya están enlaces o formularios, pero puedes agregar más lógica si necesitas)
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const action = this.title;
        const patientName = this.closest('tr').querySelector('.patient-name').textContent;
        console.log(`${action} para ${patientName}`);
        // Aquí puedes agregar la lógica específica para cada acción
      });
    });
  </script>
</body>
</html>