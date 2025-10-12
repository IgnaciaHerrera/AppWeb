import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonSelect, IonSelectOption, IonFab, IonFabButton,
  IonModal, IonButton, IonFooter, IonDatetime, IonPopover, IonInput,
  ToastController
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

type TipoOrden = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';

@Component({
  selector: 'app-diagnosticos',
  templateUrl: './diagnosticos.page.html',
  styleUrls: ['./diagnosticos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonSelect, IonSelectOption, IonFab, IonFabButton,
    IonModal, IonButton, IonFooter, IonDatetime, IonPopover, IonInput
  ]
})
export class DiagnosticosPage implements OnInit {

  diagnosticos: Diagnostico[] = [];
  ordenSeleccionado: TipoOrden = 'recientes';

  // Modal
  modalAbierto = false;
  fechaFormateada = '';
  fechaMaxima = new Date().toISOString();

  nuevoDiag: Partial<Diagnostico> = {
    enfermedad: '',
    severidad: 'leve',
    fase: 'inicial',
    medico: '',
    fechaDiagnostico: ''
  };

  constructor(private toastController: ToastController) {
    this.inicializarDatosDePrueba();
  }

  ngOnInit() {
    this.aplicarOrden();
  }

  // --- Abrir / Cerrar Modal ---
  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.limpiarFormulario();
  }

  private limpiarFormulario() {
    this.nuevoDiag = {
      enfermedad: '',
      severidad: 'leve',
      fase: 'inicial',
      medico: '',
      fechaDiagnostico: ''
    };
    this.fechaFormateada = '';
  }

  // --- Validación del formulario ---
  esFormularioValido(): boolean {
    return !!(
      this.nuevoDiag.enfermedad?.trim() &&
      this.nuevoDiag.severidad &&
      this.nuevoDiag.fase &&
      this.nuevoDiag.medico?.trim() &&
      this.nuevoDiag.fechaDiagnostico
    );
  }

  // --- Formatear Fecha ---
  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) return fecha;
      return fechaObj.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).replace(/(^|\s)\p{L}/gu, (l) => l.toLocaleLowerCase());
    } catch {
      return fecha;
    }
  }

  // --- Manejar cambio de fecha ---
  onFechaChange(event: any) {
    const fechaSeleccionada = event.detail.value;
    if (fechaSeleccionada) {
      this.nuevoDiag.fechaDiagnostico = fechaSeleccionada;
      this.fechaFormateada = this.formatearFecha(fechaSeleccionada);
    }
  }


  // --- Guardar Diagnóstico ---
  async guardarDiagnostico() {
    if (!this.esFormularioValido()) {
      this.mostrarToast('Completa todos los campos obligatorios', 'warning');
      return;
    }

    const nuevo: Diagnostico = {
      id: Date.now().toString(),
      enfermedad: this.nuevoDiag.enfermedad!.trim(),
      severidad: this.nuevoDiag.severidad as Diagnostico['severidad'],
      fase: this.nuevoDiag.fase as Diagnostico['fase'],
      medico: this.nuevoDiag.medico!.trim(),
      fechaDiagnostico: this.nuevoDiag.fechaDiagnostico!,
      expanded: false
    };

    this.diagnosticos.unshift(nuevo);
    this.aplicarOrden();
    this.cerrarModal();
    this.mostrarToast('Diagnóstico registrado correctamente', 'success');
  }

  // --- Toast ---
  async mostrarToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'top',
      color
    });
    await toast.present();
  }

  // --- Expandir Detalle ---
  toggleDiagnostico(d: Diagnostico) {
    d.expanded = !d.expanded;
  }

  // --- Clases y colores ---
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

  // --- Ordenamiento ---
  aplicarOrden(): void {
    switch (this.ordenSeleccionado) {
      case 'recientes':
        this.diagnosticos.sort((a, b) =>
          new Date(b.fechaDiagnostico).getTime() - new Date(a.fechaDiagnostico).getTime()
        );
        break;
      case 'antiguas':
        this.diagnosticos.sort((a, b) =>
          new Date(a.fechaDiagnostico).getTime() - new Date(b.fechaDiagnostico).getTime()
        );
        break;
      case 'alfabetico-asc':
        this.diagnosticos.sort((a, b) =>
          a.enfermedad.localeCompare(b.enfermedad, 'es', { sensitivity: 'base' })
        );
        break;
      case 'alfabetico-desc':
        this.diagnosticos.sort((a, b) =>
          b.enfermedad.localeCompare(a.enfermedad, 'es', { sensitivity: 'base' })
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

  // --- Datos de prueba ---
  private inicializarDatosDePrueba(): void {
    this.diagnosticos = [
      {
        id: '1',
        enfermedad: 'Hipertensión Arterial',
        severidad: 'moderado',
        fase: 'estable',
        fechaDiagnostico: '24 de enero de 2023',
        medico: 'Dr. Carlos Mendoza',
        expanded: false
      },
      {
        id: '2',
        enfermedad: 'Diabetes Tipo 2',
        severidad: 'severo',
        fase: 'progreso',
        fechaDiagnostico: '15 de marzo de 2022',
        medico: 'Dra. Ana Vargas',
        expanded: false
      },
      {
        id: '3',
        enfermedad: 'Gastritis Crónica',
        severidad: 'leve',
        fase: 'remision',
        fechaDiagnostico: '10 de noviembre de 2024',
        medico: 'Dr. Luis Prado',
        expanded: false
      },
      {
        id: '4',
        enfermedad: 'Arritmia Cardíaca',
        severidad: 'critico',
        fase: 'inicial',
        fechaDiagnostico: '5 de febrero de 2021',
        medico: 'Dr. Pedro Ramírez',
        expanded: false
      }
    ];
  }
}
