import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge
} from '@ionic/angular/standalone';

interface Hospitalizacion {
  id: string;
  motivo: string;
  fechaIngreso: string;
  fechaAlta?: string;
  medico: string;
  hospital?: string;
  descripcion?: string;
  expanded: boolean;
}

@Component({
  selector: 'app-hospitalizaciones',
  templateUrl: './hospitalizaciones.page.html',
  styleUrls: ['./hospitalizaciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge
  ]
})
export class HospitalizacionesPage implements OnInit {

  hospitalizaciones: Hospitalizacion[] = [];

  constructor() {
    this.inicializarDatosDePrueba();
  }

  ngOnInit() {}

  toggleHospitalizacion(hosp: Hospitalizacion): void {
    hosp.expanded = !hosp.expanded;
  }

  agregarHospitalizacion(): void {
    console.log('Agregar nueva hospitalización');
  }

  getStatusClass(hosp: Hospitalizacion): string {
    return hosp.fechaAlta ? 'status-finalizada' : 'status-activa';
  }

  getBadgeClass(hosp: Hospitalizacion): string {
    return hosp.fechaAlta ? 'badge-finalizada' : 'badge-en-curso';
  }

  getStatusLabel(hosp: Hospitalizacion): string {
    return hosp.fechaAlta ? 'Finalizada' : 'En curso';
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
    this.hospitalizaciones = [
      {
        id: '1',
        motivo: 'Neumonía aguda',
        fechaIngreso: '2024-07-10',
        fechaAlta: '2024-07-18',
        medico: 'Dr. Carlos Mendoza',
        hospital: 'Hospital Central',
        descripcion: 'Hospitalización por complicación respiratoria con tratamiento antibiótico intensivo',
        expanded: false
      },
      {
        id: '2',
        motivo: 'Observación postquirúrgica',
        fechaIngreso: '2024-08-22',
        fechaAlta: '2024-08-25',
        medico: 'Dra. Ana Vargas',
        hospital: 'Clínica San Rafael',
        descripcion: 'Recuperación después de cirugía laparoscópica, evolución favorable',
        expanded: false
      },
      {
        id: '3',
        motivo: 'Control diabético',
        fechaIngreso: '2024-09-15',
        medico: 'Dr. Roberto Silva',
        hospital: 'Hospital Universitario',
        descripcion: 'Ajuste de tratamiento y monitoreo glucémico intensivo',
        expanded: false
      },
      {
        id: '4',
        motivo: 'Fractura de cadera',
        fechaIngreso: '2023-12-03',
        fechaAlta: '2023-12-15',
        medico: 'Dr. Patricia López',
        hospital: 'Hospital Traumatológico',
        descripcion: 'Cirugía reconstructiva y rehabilitación inicial',
        expanded: false
      }
    ];
  }
}