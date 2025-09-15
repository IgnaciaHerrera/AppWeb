import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonGrid, IonRow, IonCol, IonButton, IonIcon,
  IonSearchbar, IonModal
} from '@ionic/angular/standalone';

interface Enfermedad {
  idEnfermedad: string;
  nombre: string;
  fase?: string;
  severidad?: string;
}

interface Diagnostico {
  idDiagnostico: string;
  descripcion: string;
  enfermedad?: Enfermedad;
}

interface Medicamento {
  idMedicamento: string;
  nombre: string;
  descripcion: string;
}

interface Receta {
  idReceta: string;
  cantidadMedicamento: string;
  medicamento: Medicamento;
}

interface Hospitalizacion {
  idHospitalizacion: string;
  descripcion: string;
}

interface Cirugia {
  idCirugia: string;
  descripcion: string;
}

interface Procedimiento {
  idExamen: string;
  tratamiento: string;
  procedimiento: string;
  descripcion: string;
  fechaConsulta: string;
  tipoConsulta: string;
  nombreMedico: string;
  apellidoMedico: string;
  especialidad?: string;
  diagnosticos?: Diagnostico[];
  recetas?: Receta[];
  hospitalizacion?: Hospitalizacion;
  cirugias?: Cirugia[];
}

@Component({
  selector: 'app-procedimientos',
  templateUrl: './procedimientos.page.html',
  styleUrls: ['./procedimientos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonGrid, IonRow, IonCol, IonButton, IonIcon,
    IonSearchbar, IonModal
  ]
})
export class ProcedimientosPage implements OnInit {
  terminoBusqueda: string = '';
  mostrarDetalleModal: boolean = false;
  procedimientoSeleccionado: Procedimiento | null = null;

  procedimientos: Procedimiento[] = [
    {
      idExamen: '1',
      tratamiento: 'Tratamiento de Hipertensión',
      procedimiento: 'Control y Seguimiento',
      descripcion: 'Control rutinario de presión arterial con ajuste de medicación',
      fechaConsulta: '15 Ago 2025',
      tipoConsulta: 'Control',
      nombreMedico: 'Dr. Carlos',
      apellidoMedico: 'Mendoza',
      especialidad: 'Cardiología',
      diagnosticos: [
        {
          idDiagnostico: '1',
          descripcion: 'Hipertensión arterial esencial',
          enfermedad: {
            idEnfermedad: '1',
            nombre: 'Hipertensión Arterial',
            fase: 'Crónica',
            severidad: 'Moderada'
          }
        }
      ],
      recetas: [
        {
          idReceta: '1',
          cantidadMedicamento: '1 tableta diaria',
          medicamento: {
            idMedicamento: '1',
            nombre: 'Enalapril 10mg',
            descripcion: 'Inhibidor de la enzima convertidora de angiotensina para control de presión arterial'
          }
        }
      ]
    },
    {
      idExamen: '2',
      tratamiento: 'Cirugía de Vesícula Biliar',
      procedimiento: 'Colecistectomía Laparoscópica',
      descripcion: 'Extirpación de vesícula biliar por vía laparoscópica debido a cálculos biliares',
      fechaConsulta: '10 Ago 2025',
      tipoConsulta: 'Pre-operatoria',
      nombreMedico: 'Dr. Ana',
      apellidoMedico: 'Vargas',
      especialidad: 'Cirugía General',
      diagnosticos: [
        {
          idDiagnostico: '2',
          descripcion: 'Colelitiasis sintomática',
          enfermedad: {
            idEnfermedad: '2',
            nombre: 'Cálculos biliares',
            fase: 'Aguda',
            severidad: 'Alta'
          }
        }
      ],
      hospitalizacion: {
        idHospitalizacion: '1',
        descripcion: 'Hospitalización programada para cirugía laparoscópica de vesícula biliar'
      },
      cirugias: [
        {
          idCirugia: '1',
          descripcion: 'Colecistectomía laparoscópica programada'
        }
      ],
      recetas: [
        {
          idReceta: '2',
          cantidadMedicamento: '1 cada 8 horas por 5 días',
          medicamento: {
            idMedicamento: '2',
            nombre: 'Omeprazol 20mg',
            descripcion: 'Inhibidor de bomba de protones para protección gástrica'
          }
        }
      ]
    },
    {
      idExamen: '3',
      tratamiento: 'Manejo de Diabetes Tipo 2',
      procedimiento: 'Control Glucémico',
      descripcion: 'Seguimiento y ajuste de tratamiento para diabetes mellitus tipo 2',
      fechaConsulta: '05 Ago 2025',
      tipoConsulta: 'Control',
      nombreMedico: 'Dr. Luis',
      apellidoMedico: 'Prado',
      especialidad: 'Endocrinología',
      diagnosticos: [
        {
          idDiagnostico: '3',
          descripcion: 'Diabetes mellitus tipo 2 con buen control glucémico',
          enfermedad: {
            idEnfermedad: '3',
            nombre: 'Diabetes Mellitus Tipo 2',
            fase: 'Crónica',
            severidad: 'Moderada'
          }
        }
      ],
      recetas: [
        {
          idReceta: '3',
          cantidadMedicamento: '1 tableta con el desayuno',
          medicamento: {
            idMedicamento: '3',
            nombre: 'Metformina 850mg',
            descripcion: 'Antidiabético oral para control de glucemia'
          }
        },
        {
          idReceta: '4',
          cantidadMedicamento: '1 tableta antes de almuerzo y cena',
          medicamento: {
            idMedicamento: '4',
            nombre: 'Glibenclamida 5mg',
            descripcion: 'Hipoglucemiante oral para estimular la producción de insulina'
          }
        }
      ]
    },
    {
      idExamen: '4',
      tratamiento: 'Terapia Física Post-Fractura',
      procedimiento: 'Rehabilitación Ortopédica',
      descripcion: 'Programa de rehabilitación posterior a fractura de muñeca',
      fechaConsulta: '28 Jul 2025',
      tipoConsulta: 'Seguimiento',
      nombreMedico: 'Dr. Patricia',
      apellidoMedico: 'Silva',
      especialidad: 'Traumatología',
      diagnosticos: [
        {
          idDiagnostico: '4',
          descripcion: 'Fractura consolidada de radio distal derecho',
          enfermedad: {
            idEnfermedad: '4',
            nombre: 'Fractura de Radio',
            fase: 'Consolidación',
            severidad: 'Leve'
          }
        }
      ],
      recetas: [
        {
          idReceta: '5',
          cantidadMedicamento: '1 tableta cada 8 horas solo si hay dolor',
          medicamento: {
            idMedicamento: '5',
            nombre: 'Ibuprofeno 400mg',
            descripcion: 'Antiinflamatorio no esteroideo para control del dolor y inflamación'
          }
        }
      ]
    },
    {
      idExamen: '5',
      tratamiento: 'Control de Asma Bronquial',
      procedimiento: 'Manejo Respiratorio',
      descripcion: 'Evaluación y ajuste de tratamiento para asma bronquial controlada',
      fechaConsulta: '20 Jul 2025',
      tipoConsulta: 'Control',
      nombreMedico: 'Dr. Roberto',
      apellidoMedico: 'Martinez',
      especialidad: 'Neumología',
      diagnosticos: [
        {
          idDiagnostico: '5',
          descripcion: 'Asma bronquial controlada con tratamiento',
          enfermedad: {
            idEnfermedad: '5',
            nombre: 'Asma Bronquial',
            fase: 'Crónica',
            severidad: 'Leve'
          }
        }
      ],
      recetas: [
        {
          idReceta: '6',
          cantidadMedicamento: '2 puffs cada 12 horas',
          medicamento: {
            idMedicamento: '6',
            nombre: 'Salbutamol inhalador',
            descripcion: 'Broncodilatador de acción corta para control del asma'
          }
        },
        {
          idReceta: '7',
          cantidadMedicamento: '1 puff cada 12 horas',
          medicamento: {
            idMedicamento: '7',
            nombre: 'Beclometasona inhalador',
            descripcion: 'Corticoide inhalado para prevención de crisis asmáticas'
          }
        }
      ]
    }
  ];

  procedimientosFiltrados: Procedimiento[] = [];

  constructor() { }

  ngOnInit() {
    this.procedimientosFiltrados = [...this.procedimientos];
  }

  buscarProcedimientos() {
    this.filtrarProcedimientos();
  }

  filtrarProcedimientos() {
    let procedimientosFiltrados = [...this.procedimientos];

    // Aplicar búsqueda por texto
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      procedimientosFiltrados = procedimientosFiltrados.filter(p =>
        p.tratamiento.toLowerCase().includes(termino) ||
        p.procedimiento.toLowerCase().includes(termino) ||
        p.descripcion.toLowerCase().includes(termino) ||
        p.nombreMedico.toLowerCase().includes(termino) ||
        p.apellidoMedico.toLowerCase().includes(termino) ||
        (p.especialidad && p.especialidad.toLowerCase().includes(termino))
      );
    }

    this.procedimientosFiltrados = procedimientosFiltrados;
  }

  verDetalleProcedimiento(procedimiento: Procedimiento) {
    this.procedimientoSeleccionado = procedimiento;
    this.mostrarDetalleModal = true;
  }

  cerrarDetalleModal() {
    this.mostrarDetalleModal = false;
    this.procedimientoSeleccionado = null;
  }
}