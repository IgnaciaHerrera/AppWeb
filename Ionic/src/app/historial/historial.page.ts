import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonSelect, IonSelectOption, IonFab, IonFabButton,
  IonModal, IonButton, IonFooter, IonDatetime, IonPopover, IonInput,
  IonToggle, IonTextarea, ToastController
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
    IonBadge, IonSelect, IonSelectOption, IonFab, IonFabButton,
    IonModal, IonButton, IonFooter, IonDatetime, IonPopover, IonInput,
    IonToggle, IonTextarea
  ]
})
export class HistorialPage implements OnInit {
  consultas: Consulta[] = [];
  ordenSeleccionado: TipoOrden = 'recientes';
  
  // Modal
  modalAbierto = false;
  fechaFormateada = '';
  consultaFinalizada = false;
  
  nuevaConsulta: Partial<Consulta> = {
    tipoConsulta: '',
    medico: '',
    especialidad: '',
    fecha: '',
    diagnostico: '',
    tratamiento: ''
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
    this.nuevaConsulta = {
      tipoConsulta: '',
      medico: '',
      especialidad: '',
      fecha: '',
      diagnostico: '',
      tratamiento: ''
    };
    this.fechaFormateada = '';
    this.consultaFinalizada = false;
  }

  // --- Manejar cambio de fecha ---
  onFechaChange(event: any) {
    const fechaSeleccionada = event.detail.value;
    if (fechaSeleccionada) {
      this.nuevaConsulta.fecha = fechaSeleccionada;
      this.fechaFormateada = this.formatearFecha(fechaSeleccionada);
    }
  }

  // --- Manejar cambio de toggle ---
  onToggleChange() {
    // Si se desmarca el toggle, limpiar diagnóstico y tratamiento
    if (!this.consultaFinalizada) {
      this.nuevaConsulta.diagnostico = '';
      this.nuevaConsulta.tratamiento = '';
    }
  }

  // --- Validación del formulario ---
  esFormularioValido(): boolean {
    const camposBasicos = !!(
      this.nuevaConsulta.tipoConsulta?.trim() &&
      this.nuevaConsulta.medico?.trim() &&
      this.nuevaConsulta.fecha
    );

    // Si está finalizada, también validar diagnóstico
    if (this.consultaFinalizada) {
      return camposBasicos && !!this.nuevaConsulta.diagnostico?.trim();
    }

    return camposBasicos;
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
      });
    } catch {
      return fecha;
    }
  }

  // --- Guardar Consulta ---
  async guardarConsulta() {
    if (!this.esFormularioValido()) {
      this.mostrarToast('Completa todos los campos obligatorios', 'warning');
      return;
    }

    const nueva: Consulta = {
      id: Date.now().toString(),
      tipoConsulta: this.nuevaConsulta.tipoConsulta!.trim(),
      medico: this.nuevaConsulta.medico!.trim(),
      especialidad: this.nuevaConsulta.especialidad?.trim() || undefined,
      fecha: this.nuevaConsulta.fecha!,
      estado: this.consultaFinalizada ? 'Finalizada' : 'Programada',
      diagnostico: this.consultaFinalizada ? this.nuevaConsulta.diagnostico?.trim() : undefined,
      tratamiento: this.consultaFinalizada ? this.nuevaConsulta.tratamiento?.trim() : undefined,
      expanded: false
    };

    this.consultas.unshift(nueva);
    this.aplicarOrden();
    this.cerrarModal();
    this.mostrarToast('Consulta registrada correctamente', 'success');
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
  toggleConsulta(consulta: Consulta) {
    consulta.expanded = !consulta.expanded;
  }

  // --- Clases y colores ---
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
    return this.formatearFecha(fecha);
  }

  // --- Ordenamiento ---
  aplicarOrden(): void {
    switch (this.ordenSeleccionado) {
      case 'recientes':
        this.consultas.sort((a, b) =>
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        break;
      case 'antiguas':
        this.consultas.sort((a, b) =>
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
        break;
      case 'alfabetico-asc':
        this.consultas.sort((a, b) =>
          a.tipoConsulta.localeCompare(b.tipoConsulta, 'es', { sensitivity: 'base' })
        );
        break;
      case 'alfabetico-desc':
        this.consultas.sort((a, b) =>
          b.tipoConsulta.localeCompare(a.tipoConsulta, 'es', { sensitivity: 'base' })
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
    this.consultas = [
      {
        id: '1',
        tipoConsulta: 'Consulta Dermatológica',
        fecha: '2024-12-08',
        estado: 'Programada',
        medico: 'Dr. Roberto Silva',
        especialidad: 'Dermatología',
        expanded: false
      },
      {
        id: '2',
        tipoConsulta: 'Control Diabetológico',
        fecha: '2024-10-18',
        estado: 'Finalizada',
        medico: 'Dr. Miguel Torres',
        especialidad: 'Endocrinología',
        diagnostico: 'Diabetes tipo 2 compensada',
        tratamiento: 'Ajuste de dosis de insulina y dieta',
        expanded: false
      },
      {
        id: '3',
        tipoConsulta: 'Consulta Traumatológica',
        fecha: '2024-09-30',
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