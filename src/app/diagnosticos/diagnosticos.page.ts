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
  severidad: 'leve' | 'moderado' | 'severo' | 'critico'; 
  fase: 'inicial' | 'progreso' | 'estable' | 'remision'; 
  fechaDiagnostico: string;
  medico: string;
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
  
  diagnosticos: Diagnostico[] = [];

  constructor() { this.inicializarDatosDePrueba(); }
  ngOnInit() {}

  toggleDiagnostico(d: Diagnostico) { d.expanded = !d.expanded; }

  getDiagnosticoSeverityClass(d: Diagnostico): string {
    return `severity-${d.severidad}`;
  }
  getSeverityBadgeColor(d: Diagnostico): string {
    switch (d.severidad) {
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
  getSeverityDescription(severidad: string): string {
    switch (severidad) {
      case 'leve': return 'Condición leve';
      case 'moderado': return 'Condición moderada';
      case 'severo': return 'Condición severa';
      case 'critico': return 'Condición crítica';
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

  private inicializarDatosDePrueba(): void {
    this.diagnosticos = [
      { id: '1', enfermedad: 'Hipertensión Arterial', severidad: 'moderado', fase: 'estable',
        fechaDiagnostico: '12 Marzo 2024', medico: 'Dr. Carlos Mendoza', expanded: false },
      { id: '2', enfermedad: 'Diabetes Mellitus Tipo 2', severidad: 'severo', fase: 'progreso',
        fechaDiagnostico: '08 Junio 2024', medico: 'Dra. Ana Vargas', expanded: false },
      { id: '3', enfermedad: 'Gastritis Crónica', severidad: 'leve', fase: 'remision',
        fechaDiagnostico: '25 Enero 2024', medico: 'Dr. Luis Prado', expanded: false },
      { id: '4', enfermedad: 'Arritmia Cardíaca', severidad: 'critico', fase: 'inicial',
        fechaDiagnostico: '30 Agosto 2025', medico: 'Dr. Pedro Ramírez', expanded: false }
    ];
  }
}
