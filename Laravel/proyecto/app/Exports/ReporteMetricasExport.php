<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ReporteMetricasExport implements FromCollection, WithHeadings, WithMapping
{
    protected $metrics;
    protected $periodo;

    public function __construct(array $metrics, string $periodo)
    {
        $this->metrics = $metrics;
        $this->periodo = $periodo;
    }

    public function collection()
    {
        // Devolvemos una colección con una sola fila de datos
        return collect([[
            'periodo' => $this->periodo,
            'consultas' => $this->metrics['consultas'],
            'nuevos_pacientes' => $this->metrics['nuevos_pacientes'],
            'hospitalizaciones' => $this->metrics['hospitalizaciones'],
            'cirugias' => $this->metrics['cirugias'],
        ]]);
    }

    public function map($row): array
    {
        // Formatear los valores como desees
        return [
            ucfirst(str_replace('-', ' ', $row['periodo'])),
            $row['consultas'],
            $row['nuevos_pacientes'],
            $row['hospitalizaciones'],
            $row['cirugias'],
        ];
    }

    public function headings(): array
    {
        return [
            'Periodo',
            'Consultas',
            'Nuevos Pacientes',
            'Hospitalizaciones',
            'Cirugías',
        ];
    }
}