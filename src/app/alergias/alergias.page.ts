import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonButton
} from '@ionic/angular/standalone';

interface Alergia {
  id: string;
  nombre: string;
  descripcion: string;
  grado: 'leve' | 'moderado' | 'severo';
  fechaRegistro: string;
  expanded: boolean;
}

@Component({
  selector: 'app-alergias',
  templateUrl: './alergias.page.html',
  styleUrls: ['./alergias.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonButton
  ]
})
export class AlergiasPage implements OnInit {
  
  alergias: Alergia[] = [];

  constructor() { 
    this.inicializarDatosDePrueba();
  }

  ngOnInit() {}

  toggleAlergia(alergia: Alergia): void {
    alergia.expanded = !alergia.expanded;
  }

  agregarAlergia(): void {
    console.log('Agregar nueva alergia');
  }

  getAlergiaGradeClass(alergia: Alergia): string {
    return `grade-${alergia.grado}`;
  }

  getBadgeColor(alergia: Alergia): string {
    switch (alergia.grado) {
      case 'leve': return 'success';
      case 'moderado': return 'warning';
      case 'severo': return 'danger';
      default: return 'medium';
    }
  }

  getGradeLabel(grado: string): string {
    switch (grado) {
      case 'leve': return 'Leve';
      case 'moderado': return 'Moderado';
      case 'severo': return 'Severo';
      default: return 'Sin clasificar';
    }
  }

  getSeverityDescription(grado: string): string {
    switch (grado) {
      case 'leve': return 'Reacción leve';
      case 'moderado': return 'Reacción moderada';
      case 'severo': return 'Reacción severa';
      default: return 'Sin clasificar';
    }
  }

  // Nuevo método para obtener el icono de severidad
  getSeverityIcon(grado: string): string {
    switch (grado) {
      case 'leve': return 'checkmark-circle-outline';
      case 'moderado': return 'warning-outline';
      case 'severo': return 'alert-circle-outline';
      default: return 'help-circle-outline';
    }
  }

  private inicializarDatosDePrueba(): void {
    this.alergias = [
      {
        id: '1',
        nombre: 'Penicilina',
        descripcion: 'Antibiótico betalactámico',
        grado: 'severo',
        fechaRegistro: '15 Marzo 2023',
        expanded: false
      },
      {
        id: '2',
        nombre: 'Frutos secos',
        descripcion: 'Nueces, almendras, avellanas',
        grado: 'moderado',
        fechaRegistro: '22 Junio 2023',
        expanded: false
      },
      {
        id: '3',
        nombre: 'Polen de gramíneas',
        descripcion: 'Alergia estacional',
        grado: 'leve',
        fechaRegistro: '10 Septiembre 2023',
        expanded: false
      },
      {
        id: '4',
        nombre: 'Látex',
        descripcion: 'Reacción al látex natural',
        grado: 'moderado',
        fechaRegistro: '05 Enero 2024',
        expanded: false
      }
    ];
  }
}