import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge
} from '@ionic/angular/standalone';

interface Diagnostico {
  id: string;
  enfermedad: string; 
  descripcion: string; 
  severidad: 'leve' | 'moderado' | 'severo' | 'critico'; 
  fase: 'inicial' | 'progreso' | 'estable' | 'remision'; 
  fechaDiagnostico: string;
  medico: string;
  tratamiento?: string;
  proximaConsulta?: string;
  expanded: boolean;
}

@Component({
  selector: 'app-diagnosticos',
  templateUrl: './diagnosticos.page.html',
  styleUrls: ['./diagnosticos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge
  ]
})
export class DiagnosticosPage implements OnInit {
  
  // Array de datos (se reemplazará por servicios)
  diagnosticos: Diagnostico[] = [];

  constructor() { 
    this.inicializarDatosDePrueba();
  }

  ngOnInit() {
    // Aquí se conectarán los servicios reales
  }

  toggleDiagnostico(diagnostico: Diagnostico): void {
    diagnostico.expanded = !diagnostico.expanded;
  }

  getDiagnosticoSeverityClass(diagnostico: Diagnostico): string {
    return `severity-${diagnostico.severidad}`;
  }

  getSeverityBadgeColor(diagnostico: Diagnostico): string {
    switch (diagnostico.severidad) {
      case 'leve': return 'success';
      case 'moderado': return 'warning';
      case 'severo': return 'danger';
      case 'critico': return 'dark';
      default: return 'medium';
    }
  }

  getSeverityLabel(severidad: string): string {
    switch (severidad) {
      case 'leve': return 'Leve';
      case 'moderado': return 'Moderado';
      case 'severo': return 'Severo';
      case 'critico': return 'Crítico';
      default: return 'Sin clasificar';
    }
  }

  getFaseDescription(fase: string): string {
    switch (fase) {
      case 'inicial': return 'Fase inicial';
      case 'progreso': return 'En progreso';
      case 'estable': return 'Estable';
      case 'remision': return 'En remisión';
      default: return 'Sin fase definida';
    }
  }

  // Datos de prueba (temporal - se eliminará cuando se conecten servicios)
  private inicializarDatosDePrueba(): void {
    this.diagnosticos = [
      {
        id: '1',
        enfermedad: 'Hipertensión Arterial',
        descripcion: 'Presión arterial elevada sostenida',
        severidad: 'moderado',
        fase: 'estable',
        fechaDiagnostico: '12 Mar 2024',
        medico: 'Dr. Carlos Mendoza',
        tratamiento: 'Losartán 50mg cada 12 horas, dieta baja en sodio, ejercicio regular',
        expanded: false
      },
      {
        id: '2',
        enfermedad: 'Diabetes Mellitus Tipo 2',
        descripcion: 'Trastorno metabólico caracterizado por hiperglucemia',
        severidad: 'severo',
        fase: 'progreso',
        fechaDiagnostico: '08 Jun 2024',
        medico: 'Dra. Ana Vargas',
        tratamiento: 'Metformina 850mg, control de carbohidratos, monitoreo de glucosa',
        expanded: false
      },
      {
        id: '3',
        enfermedad: 'Gastritis Crónica',
        descripcion: 'Inflamación crónica de la mucosa gástrica',
        severidad: 'leve',
        fase: 'remision',
        fechaDiagnostico: '25 Ene 2024',
        medico: 'Dr. Luis Prado',
        tratamiento: 'Omeprazol 20mg, dieta blanda, evitar irritantes',
        expanded: false
      },
      {
        id: '4',
        enfermedad: 'Arritmia Cardíaca',
        descripcion: 'Alteración del ritmo cardíaco normal',
        severidad: 'critico',
        fase: 'inicial',
        fechaDiagnostico: '30 Ago 2025',
        medico: 'Dr. Pedro Ramírez',
        tratamiento: 'Bajo evaluación cardiológica especializada',
        expanded: false
      }
    ];
  }
}