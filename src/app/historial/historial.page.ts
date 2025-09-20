import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonButton
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

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonButton
  ]
})
export class HistorialPage implements OnInit {

  consultas: Consulta[] = [];

  constructor() {
    this.inicializarDatosDePrueba();
  }

  ngOnInit() {}

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