import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonSelect, IonSelectOption, IonFab, IonFabButton 
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

type TipoOrden = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';

@Component({
  selector: 'app-hospitalizaciones',
  templateUrl: './hospitalizaciones.page.html',
  styleUrls: ['./hospitalizaciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonSelect, IonSelectOption, IonFab, IonFabButton 
  ]
})
export class HospitalizacionesPage implements OnInit {

  hospitalizaciones: Hospitalizacion[] = [];
  ordenSeleccionado: TipoOrden = 'recientes';

  constructor() {
    this.inicializarDatosDePrueba();
  }

  ngOnInit() {
    this.aplicarOrden();
  }

  toggleHospitalizacion(hosp: Hospitalizacion): void {
    hosp.expanded = !hosp.expanded;
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
    // Formato: "5 de enero de 2024"
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  aplicarOrden(): void {
    switch (this.ordenSeleccionado) {
      case 'recientes':
        this.hospitalizaciones.sort(
          (a, b) => new Date(b.fechaIngreso).getTime() - new Date(a.fechaIngreso).getTime()
        );
        break;
      case 'antiguas':
        this.hospitalizaciones.sort(
          (a, b) => new Date(a.fechaIngreso).getTime() - new Date(b.fechaIngreso).getTime()
        );
        break;
      case 'alfabetico-asc':
        this.hospitalizaciones.sort(
          (a, b) => a.motivo.localeCompare(b.motivo, 'es', { sensitivity: 'base' })
        );
        break;
      case 'alfabetico-desc':
        this.hospitalizaciones.sort(
          (a, b) => b.motivo.localeCompare(a.motivo, 'es', { sensitivity: 'base' })
        );
        break;
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
