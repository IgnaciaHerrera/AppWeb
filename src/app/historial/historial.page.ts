import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonSelect, IonSelectOption, IonFab, IonFabButton 
} from '@ionic/angular/standalone';

interface Consulta {
  id: string;
  tipoConsulta: string;
  fecha: string;
  estado: 'Programada' | 'Finalizada';
  medico: string;
  especialidad?: string;
  diagnostico?: string;
  tratamiento?: string;
  expanded: boolean;
}

type TipoOrden = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonSelect, IonSelectOption, IonFab, IonFabButton 
  ]
})
export class HistorialPage implements OnInit {
  consultas: Consulta[] = [];
  ordenSeleccionado: TipoOrden = 'recientes';

  constructor() {
    this.inicializarDatosDePrueba();
  }

  ngOnInit() {
    this.aplicarOrden();
  }

  toggleConsulta(consulta: Consulta): void {
    consulta.expanded = !consulta.expanded;
  }

  getStatusClass(consulta: Consulta): string {
    switch (consulta.estado) {
      case 'Programada': return 'status-programada';
      case 'Finalizada': return 'status-finalizada';
      default: return '';
    }
  }

  getBadgeClass(consulta: Consulta): string {
    switch (consulta.estado) {
      case 'Programada': return 'badge-programada';
      case 'Finalizada': return 'badge-finalizada';
      default: return 'badge-finalizada';
    }
  }

  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  aplicarOrden(): void {
    switch (this.ordenSeleccionado) {
      case 'recientes':
        // Orden descendente por fecha (más nuevas primero)
        this.consultas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        break;
        
      case 'antiguas':
        // Orden ascendente por fecha (más antiguas primero)
        this.consultas.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        break;
        
      case 'alfabetico-asc':
        // Orden alfabético ascendente por tipo de consulta (A-Z)
        this.consultas.sort((a, b) => a.tipoConsulta.localeCompare(b.tipoConsulta, 'es', { sensitivity: 'base' }));
        break;
        
      case 'alfabetico-desc':
        // Orden alfabético descendente por tipo de consulta (Z-A)
        this.consultas.sort((a, b) => b.tipoConsulta.localeCompare(a.tipoConsulta, 'es', { sensitivity: 'base' }));
        break;
        
      default:
        // Por defecto, más recientes
        this.consultas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }
  }

  getOrdenLabel(): string {
    const labels: Record<TipoOrden, string> = {
      'recientes': 'Más recientes',
      'antiguas': 'Más antiguas',
      'alfabetico-asc': 'Alfabético (A-Z)',
      'alfabetico-desc': 'Alfabético (Z-A)'
    };
    
    return labels[this.ordenSeleccionado];
  }

  private inicializarDatosDePrueba(): void {
    this.consultas = [
      {
        id: '1',
        tipoConsulta: 'Consulta General',
        fecha: '2025-01-15',
        estado: 'Finalizada',
        medico: 'Dr. Carlos Mendoza',
        especialidad: 'Medicina General',
        diagnostico: 'Infección respiratoria alta',
        tratamiento: 'Antibióticos y reposo por 7 días',
        expanded: false
      },
      {
        id: '2',
        tipoConsulta: 'Control Cardiológico',
        fecha: '2025-02-10',
        estado: 'Finalizada',
        medico: 'Dra. Ana Vargas',
        especialidad: 'Cardiología',
        diagnostico: 'Hipertensión arterial controlada',
        tratamiento: 'Continuar medicación antihipertensiva',
        expanded: false
      },
      {
        id: '3',
        tipoConsulta: 'Consulta Dermatológica',
        fecha: '2025-03-20',
        estado: 'Programada',
        medico: 'Dr. Roberto Silva',
        especialidad: 'Dermatología',
        expanded: false
      },
      {
        id: '4',
        tipoConsulta: 'Examen Oftalmológico',
        fecha: '2025-04-05',
        estado: 'Programada',
        medico: 'Dra. Carmen Ruiz',
        especialidad: 'Oftalmología',
        expanded: false
      },
      {
        id: '5',
        tipoConsulta: 'Control Diabetológico',
        fecha: '2024-12-18',
        estado: 'Finalizada',
        medico: 'Dr. Miguel Torres',
        especialidad: 'Endocrinología',
        diagnostico: 'Diabetes tipo 2 compensada',
        tratamiento: 'Ajuste de dosis de insulina y dieta',
        expanded: false
      },
      {
        id: '6',
        tipoConsulta: 'Consulta Traumatológica',
        fecha: '2024-11-25',
        estado: 'Finalizada',
        medico: 'Dra. Patricia López',
        especialidad: 'Traumatología',
        diagnostico: 'Esguince de tobillo grado I',
        tratamiento: 'Reposo, antiinflamatorios y fisioterapia',
        expanded: false
      }
    ];
  }
}