<h1>Listado de Alergias</h1>

@if ($errors->any())
    <div style="color: red;">
        {{ $errors->first('api_error') }}
    </div>
@endif

@if (!empty($alergias))
    <ul>
        @foreach ($alergias as $alergia)
            <li>
                <strong>{{ $alergia['enfermedad'] }}</strong><br>
                {{ $alergia['total_diagnosticos'] }}
                 {{ $alergia['estado_comun'] }}
            </li>
        @endforeach
    </ul>
@else
    <p>No hay alergias disponibles.</p>
@endif
