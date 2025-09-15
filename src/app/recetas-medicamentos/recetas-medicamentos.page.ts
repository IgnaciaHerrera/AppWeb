import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonSegment, IonSegmentButton, IonBadge, IonChip, IonButton,
  IonProgressBar, IonModal
} from '@ionic/angular/standalone';

// Interfaces limpias
interface Medicamento {
  id: string;
  nombre: string;
  dosis: string;
  presentacion: string;
  horario: string;
  tipo: 'cronico' | 'corta-duracion' | 'finalizado';
  medico: string;
  fechaInicio: string;
  fechaFin?: string;
  fechaRenovacion?: string;
  duracion?: string;
  expanded: boolean;
  progreso?: {
    porcentaje: number;
    diasTomados: string;
    diasRestantes: string;
  };
}

interface Receta {
  id: string;
  numero: string;
  titulo: string;
  fecha: string;
  estado: 'vigente' | 'renovable' | 'vencida';
  validez: string;
  instrucciones?: string;
  doctor: {
    nombre: string;
    especialidad: string;
    rut: string;
    registro: string;
    centro: string;
  };
  paciente: {
    nombre: string;
    rut: string;
  };
  medicamentos: {
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
    cantidad: string;
    via: string;
  }[];
}

@Component({
  selector: 'app-recetas-medicamentos',
  templateUrl: './recetas-medicamentos.page.html',
  styleUrls: ['./recetas-medicamentos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonSegment, IonSegmentButton, IonBadge, IonChip, IonButton,
    IonProgressBar, IonModal
  ]
})
export class RecetasMedicamentosPage implements OnInit {
  // Propiedades de estado
  selectedTab: string = 'medicamentos';
  mostrarRecetaModal: boolean = false;
  recetaSeleccionada: Receta | null = null;

  // Arrays de datos (estos se reemplazarán por servicios)
  medicamentosActivos: Medicamento[] = [];
  medicamentosFinalizados: Medicamento[] = [];
  recetas: Receta[] = [];

  constructor() { 
    this.inicializarDatosDePrueba();
  }

  ngOnInit() {
    // Aquí se conectarán los servicios reales
  }

  // Métodos de navegación y UI
  onTabChange(event: any): void {
    this.selectedTab = event.detail.value;
  }

  toggleMedicamento(medicamento: Medicamento): void {
    medicamento.expanded = !medicamento.expanded;
  }

  // Métodos de modal
  verRecetaCompleta(receta: Receta): void {
    this.recetaSeleccionada = receta;
    this.mostrarRecetaModal = true;
  }

  cerrarRecetaModal(): void {
    this.mostrarRecetaModal = false;
    this.recetaSeleccionada = null;
  }

  // Métodos de acciones (placeholders para servicios futuros)
  descargarReceta(receta: Receta): void {
    console.log('Descargar receta:', receta.numero);
    // TODO: Implementar servicio de descarga PDF
  }

  // Helpers para obtener clases CSS dinámicas
  getMedicamentoTypeClass(medicamento: Medicamento): string {
    return medicamento.tipo;
  }

  getBadgeColor(medicamento: Medicamento): string {
    switch (medicamento.tipo) {
      case 'cronico': return 'success';
      case 'corta-duracion': return 'warning';
      case 'finalizado': return 'medium';
      default: return 'medium';
    }
  }

  getBadgeLabel(medicamento: Medicamento): string {
    switch (medicamento.tipo) {
      case 'cronico': return 'Crónico';
      case 'corta-duracion': return '7 días'; // Esto debería calcularse dinámicamente
      case 'finalizado': return 'Completado';
      default: return '';
    }
  }

  // Datos de prueba (temporal - se eliminará cuando se conecten servicios)
  private inicializarDatosDePrueba(): void {
    this.medicamentosActivos = [
      {
        id: '1',
        nombre: 'Losartán',
        dosis: '50 mg',
        presentacion: 'Comprimidos',
        horario: 'Cada 12 horas',
        tipo: 'cronico',
        medico: 'Dr. Carlos Mendoza',
        fechaInicio: '15 Jun 2025',
        fechaRenovacion: '15 Sep 2025',
        expanded: false
      },
      {
        id: '2',
        nombre: 'Amoxicilina',
        dosis: '500 mg',
        presentacion: 'Cápsulas',
        horario: 'Cada 8 horas por 7 días',
        tipo: 'corta-duracion',
        medico: 'Dr. Ana Vargas',
        fechaInicio: '18 Ago 2025',
        fechaFin: '25 Ago 2025',
        expanded: false,
        progreso: {
          porcentaje: 0.43,
          diasTomados: '3 de 7 días',
          diasRestantes: '4 días restantes'
        }
      }
    ];

    this.medicamentosFinalizados = [
      {
        id: '3',
        nombre: 'Omeprazol',
        dosis: '20 mg',
        presentacion: 'Cápsulas',
        horario: 'Finalizado el 10 Ago 2025',
        tipo: 'finalizado',
        medico: 'Dr. Luis Prado',
        fechaInicio: '10 Jul 2025',
        fechaFin: '10 Ago 2025',
        duracion: '30 días',
        expanded: false
      }
    ];

    this.recetas = [
      {
        id: '1',
        numero: '#2025-0145',
        titulo: 'Receta #2025-0145',
        fecha: '21 Agosto 2025',
        estado: 'vigente',
        validez: '30 días',
        doctor: {
          nombre: 'Dr. Juan C. Herrera',
          especialidad: 'Medicina General',
          rut: '12.345.678-9',
          registro: '12345',
          centro: 'Centro Médico San Juan'
        },
        paciente: {
          nombre: 'Rosa Pino',
          rut: '98.765.432-1'
        },
        medicamentos: [
          {
            nombre: 'Amoxar 150mg',
            dosis: '1 cápsula',
            frecuencia: 'Cada 8 horas',
            duracion: '7 días',
            cantidad: '21 cápsulas',
            via: 'Oral'
          },
          {
            nombre: 'Ketazol 200mg',
            dosis: '2 comprimidos',
            frecuencia: 'Al día',
            duracion: '6 días',
            cantidad: '12 comprimidos',
            via: 'Oral'
          }
        ]
      }
      // Más recetas de prueba se pueden agregar aquí
    ];
  }
}