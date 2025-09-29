import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonButton, IonFab, IonFabButton, IonModal, IonInput,
  IonFooter, IonTextarea, IonSelect, IonSelectOption, IonDatetime, IonPopover
} from '@ionic/angular/standalone';

interface Alergia {
  id: string;
  nombre: string;
  descripcion: string;
  grado: 'leve' | 'moderado' | 'severo';
  fechaRegistro: string; // Guardada en formato "5 de enero de 2024"
  expanded: boolean;
}

type TipoOrden = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';

@Component({
  selector: 'app-alergias',
  templateUrl: './alergias.page.html',
  styleUrls: ['./alergias.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonButton, IonFab, IonFabButton, IonModal, IonInput,
    IonFooter, IonTextarea, IonSelect, IonSelectOption, IonDatetime, IonPopover
  ]
})
export class AlergiasPage implements OnInit {
  
  alergias: Alergia[] = [];
  modalAbierto = false;

  fechaMaxima = new Date().toISOString();
  fechaFormateada = '';

  ordenSeleccionado: TipoOrden = 'recientes';

  nuevaAlergia: Alergia = {
    id: '',
    nombre: '',
    descripcion: '',
    grado: 'leve',
    fechaRegistro: new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    expanded: false
  };

  constructor() { 
    this.inicializarDatosDePrueba();
  }

  ngOnInit() {
    this.actualizarFechaFormateada();
    this.aplicarOrden();
  }

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  esFormularioValido(): boolean {
    return this.nuevaAlergia.nombre.trim().length > 0 &&
           this.nuevaAlergia.descripcion.trim().length > 0;
  }

  guardarAlergia() {
    if (!this.esFormularioValido()) return;

    const nueva = {
      ...this.nuevaAlergia,
      id: Date.now().toString(),
      fechaRegistro: this.fechaFormateada // fecha ya formateada
    };

    this.alergias.unshift(nueva);
    this.cerrarModal();

    this.nuevaAlergia = {
      id: '',
      nombre: '',
      descripcion: '',
      grado: 'leve',
      fechaRegistro: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      expanded: false
    };
    this.actualizarFechaFormateada();
    this.aplicarOrden();
  }

  onFechaChange() {
    this.actualizarFechaFormateada();
  }

  actualizarFechaFormateada() {
    const fecha = new Date(this.nuevaAlergia.fechaRegistro);
    this.fechaFormateada = fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  aplicarOrden(): void {
    switch (this.ordenSeleccionado) {
      case 'recientes':
        this.alergias.sort((a, b) => this.compararFechas(b.fechaRegistro, a.fechaRegistro));
        break;
      case 'antiguas':
        this.alergias.sort((a, b) => this.compararFechas(a.fechaRegistro, b.fechaRegistro));
        break;
      case 'alfabetico-asc':
        this.alergias.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
        break;
      case 'alfabetico-desc':
        this.alergias.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es', { sensitivity: 'base' }));
        break;
    }
  }

  compararFechas(fecha1: string, fecha2: string): number {
    // Fecha viene como "5 de enero de 2024"
    const parsear = (f: string): Date => {
      return new Date(f); // navegador entiende bien formato español
    };
    return parsear(fecha1).getTime() - parsear(fecha2).getTime();
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

  toggleAlergia(alergia: Alergia): void {
    alergia.expanded = !alergia.expanded;
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
        fechaRegistro: '15 de marzo de 2023',
        expanded: false
      },
      {
        id: '2',
        nombre: 'Frutos secos',
        descripcion: 'Nueces, almendras, avellanas',
        grado: 'moderado',
        fechaRegistro: '22 de junio de 2023',
        expanded: false
      },
      {
        id: '3',
        nombre: 'Polen de gramíneas',
        descripcion: 'Alergia estacional',
        grado: 'leve',
        fechaRegistro: '10 de septiembre de 2023',
        expanded: false
      },
      {
        id: '4',
        nombre: 'Látex',
        descripcion: 'Reacción al látex natural',
        grado: 'moderado',
        fechaRegistro: '5 de enero de 2024',
        expanded: false
      }
    ];
  }
}
