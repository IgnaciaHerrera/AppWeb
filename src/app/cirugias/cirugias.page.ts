import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonSelect, IonSelectOption, IonFab, IonFabButton 
} from '@ionic/angular/standalone';

interface Cirugia {
  id: string;
  nombre: string;
  fecha: string;
  estado: 'Programada' | 'Finalizada';
  medico: string;
  hospital: string;
  expanded: boolean;
}

type OrdenCirugia = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';

@Component({
  selector: 'app-cirugias',
  templateUrl: './cirugias.page.html',
  styleUrls: ['./cirugias.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonSelect, IonSelectOption, IonFab, IonFabButton 
  ]
})
export class CirugiasPage implements OnInit {

  cirugias: Cirugia[] = [];
  filtroOrden: OrdenCirugia = 'recientes';

  constructor() {
    this.inicializarDatosDePrueba();
  }

  ngOnInit() {
    this.ordenarCirugias();
  }

  toggleCirugia(cirugia: Cirugia): void {
    cirugia.expanded = !cirugia.expanded;
  }

  getStatusClass(cirugia: Cirugia): string {
    return cirugia.estado === 'Programada' ? 'status-programada' : 'status-finalizada';
  }

  getBadgeClass(cirugia: Cirugia): string {
    return cirugia.estado === 'Programada' ? 'badge-programada' : 'badge-finalizada';
  }

  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  ordenarCirugias(): void {
    switch (this.filtroOrden) {
      case 'recientes':
        this.cirugias.sort((a, b) =>
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        break;
      case 'antiguas':
        this.cirugias.sort((a, b) =>
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
        break;
      case 'alfabetico-asc':
        this.cirugias.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
        break;
      case 'alfabetico-desc':
        this.cirugias.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es'));
        break;
    }
  }

  private inicializarDatosDePrueba(): void {
    this.cirugias = [
      {
        id: '1',
        nombre: 'Apendicectomía',
        fecha: '2025-03-05',
        estado: 'Finalizada',
        medico: 'Dr. Juan Herrera',
        hospital: 'Clínica Central',
        expanded: false
      },
      {
        id: '2',
        nombre: 'Bypass gástrico',
        fecha: '2025-07-20',
        estado: 'Programada',
        medico: 'Dra. Ana Vargas',
        hospital: 'Hospital Universitario',
        expanded: false
      },
      {
        id: '3',
        nombre: 'Reemplazo de rodilla',
        fecha: '2025-10-15',
        estado: 'Programada',
        medico: 'Dr. Roberto Silva',
        hospital: 'Hospital Traumatológico',
        expanded: false
      },
      {
        id: '4',
        nombre: 'Cirugía de cataratas',
        fecha: '2024-12-08',
        estado: 'Finalizada',
        medico: 'Dra. Carmen Ruiz',
        hospital: 'Clínica Oftalmológica',
        expanded: false
      }
    ];
  }
}
