<!-- resources/views/ficha-edit.blade.php -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Editar Ficha Médica - {{ $paciente['nombre'] ?? 'Paciente' }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <link href="{{ asset('css/editfichas.css') }}" rel="stylesheet">
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
            <h1>Editar Ficha Médica</h1>
            <p class="page-subtitle">Actualiza la información del paciente</p>
        </section>

        <!-- Información del paciente -->
        <div class="patient-header">
            <div class="patient-info">
                <i class="bi bi-person-fill"></i>
                <span><strong>Paciente:</strong> {{ $paciente['nombre'] }} {{ $paciente['apellido'] }}</span>
                <span><strong>Ficha Médica ID:</strong> #{{ $paciente['id'] ?? 'N/A' }}</span>
            </div>
        </div>

        <!-- Mostrar errores de validación -->
        @if ($errors->any())
            <div class="alert alert-error">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <!-- Mostrar mensajes de éxito -->
        @if (session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        <!-- Formulario de edición -->
        <form action="{{ route('fichas.update', $paciente['id']) }}" method="POST">
            @csrf
            @method('PUT')

            <!-- Información Básica del Paciente -->
            <div class="form-section">
                <h3>Información del Paciente *</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label for="nombre">Nombre *</label>
                        <input type="text" id="nombre" name="paciente[nombre]" 
                               value="{{ old('paciente.nombre', $paciente['nombre']) }}" 
                               required>
                    </div>
                    <div class="form-group">
                        <label for="apellido">Apellido *</label>
                        <input type="text" id="apellido" name="paciente[apellido]" 
                               value="{{ old('paciente.apellido', $paciente['apellido']) }}" 
                               required>
                    </div>
                    <div class="form-group">
                        <label for="edad">Edad *</label>
                        <input type="number" id="edad" name="paciente[edad]" 
                               value="{{ old('paciente.edad', $paciente['edad']) }}" 
                               min="0" max="150" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="email">Correo Electrónico</label>
                        <input type="email" id="email" name="paciente[email]" 
                               value="{{ old('paciente.email', $paciente['email']) }}">
                    </div>
                    <div class="form-group">
                        <label for="telefono">Teléfono</label>
                        <input type="text" id="telefono" name="paciente[telefono]" 
                               value="{{ old('paciente.telefono', $paciente['telefono']) }}">
                    </div>
                </div>
            </div>

            <!-- Consulta -->
            <div class="form-section">
                <h3>Consulta *</h3>
                <div class="form-row">
                    <div class="form-group">
                        <label for="fecha_consulta">Fecha de Consulta *</label>
                        <input type="date" id="fecha_consulta" name="fecha_consulta" 
                               value="{{ old('fecha_consulta', \Carbon\Carbon::parse($consulta['fecha'] ?? now())->format('Y-m-d')) }}" 
                               required>
                    </div>
                    <div class="form-group">
                        <label for="tipo_consulta">Tipo de Consulta *</label>
                        <select id="tipo_consulta" name="tipo_consulta" required>
                            <option value="">Seleccionar tipo</option>
                            <option value="consulta_rutinaria" {{ old('tipo_consulta', $consulta['tipo_consulta'] ?? '') == 'consulta_rutinaria' ? 'selected' : '' }}>Consulta Rutinaria</option>
                            <option value="emergencia" {{ old('tipo_consulta', $consulta['tipo_consulta'] ?? '') == 'emergencia' ? 'selected' : '' }}>Emergencia</option>
                            <option value="seguimiento" {{ old('tipo_consulta', $consulta['tipo_consulta'] ?? '') == 'seguimiento' ? 'selected' : '' }}>Seguimiento</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="medico_tratante">Médico Tratante *</label>
                        <select id="medico_tratante" name="medico_tratante" required>
                            <option value="">Seleccionar médico</option>
                            <option value="1" {{ old('medico_tratante', $consulta['medico_id'] ?? '') == '1' ? 'selected' : '' }}>Dr. Roberto Mendoza</option>
                            <option value="2" {{ old('medico_tratante', $consulta['medico_id'] ?? '') == '2' ? 'selected' : '' }}>Dra. Ana Pérez</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Diagnóstico -->
            <div class="form-section" style="background-color: #f0f8ff;">
                <h3>Diagnóstico *</h3>
                <div class="form-group">
                    <label for="diagnostico">Descripción del Diagnóstico *</label>
                    <textarea id="diagnostico" name="diagnostico" 
                              placeholder="Describir el diagnóstico principal y secundarios..." 
                              rows="4">{{ old('diagnostico', $diagnostico) }}</textarea>
                </div>
            </div>

            <!-- Tratamiento -->
            <div class="form-section" style="background-color: #f0fff0;">
                <h3>Tratamiento</h3>
                <div class="form-group">
                    <label for="plan_tratamiento">Plan de Tratamiento</label>
                    <textarea id="plan_tratamiento" name="plan_tratamiento" 
                              placeholder="Describir el plan de tratamiento general..." 
                              rows="4">{{ old('plan_tratamiento', $consulta['tratamiento'] ?? '') }}</textarea>
                </div>
            </div>

            <!-- Medicamentos Recetados -->
            <div class="form-section" style="background-color: #faf0ff;">
                <h3>Medicamentos Recetados</h3>
                <div id="medicamentos-list">
                    @php
                        $medicamentosOld = old('medicamentos', []);
                        $dosisOld = old('dosis', []);
                        $medicamentosData = isset($medicamentos) ? $medicamentos : [];
                        $count = max(count($medicamentosOld), count($medicamentosData));
                    @endphp

                    @for ($i = 0; $i < max(1, $count); $i++)
                        <div class="medicamento-item">
                            <input type="text" 
                                   name="medicamentos[]" 
                                   placeholder="Nombre del medicamento"
                                   value="{{ $medicamentosOld[$i] ?? ($medicamentosData[$i]['nombre'] ?? '') }}">
                            <input type="text" 
                                   name="dosis[]" 
                                   placeholder="Dosis"
                                   value="{{ $dosisOld[$i] ?? ($medicamentosData[$i]['dosis'] ?? '') }}">
                            <button type="button" onclick="removeMedicamento(this)">Eliminar</button>
                        </div>
                    @endfor
                </div>
                <button type="button" class="btn btn-outline" onclick="addMedicamento()">+ Agregar Medicamento</button>
            </div>

            <!-- Botones -->
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                <a href="{{ route('fichas.show', $paciente['id']) }}" class="btn btn-outline">Cancelar</a>
            </div>
        </form>
    </main>

    <script>
        function addMedicamento() {
            const container = document.getElementById('medicamentos-list');
            const item = document.createElement('div');
            item.className = 'medicamento-item';
            item.innerHTML = `
                <input type="text" name="medicamentos[]" placeholder="Nombre del medicamento">
                <input type="text" name="dosis[]" placeholder="Dosis">
                <button type="button" onclick="removeMedicamento(this)">Eliminar</button>
            `;
            container.appendChild(item);
        }

        function removeMedicamento(button) {
            const container = document.getElementById('medicamentos-list');
            if (container.children.length > 1) {
                button.parentElement.remove();
            } else {
                // Limpiar los campos si es el último
                const inputs = button.parentElement.querySelectorAll('input');
                inputs.forEach(input => input.value = '');
            }
        }
    </script>
</body>
</html>