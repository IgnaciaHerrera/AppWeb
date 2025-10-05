import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonSegment, IonSegmentButton, IonBadge, IonChip, IonButton,
  IonProgressBar, IonModal, IonFab, IonFabButton,
  IonInput, IonSelect, IonSelectOption, IonDatetime, IonPopover, IonFooter,
  ToastController
} from '@ionic/angular/standalone';

interface Medicamento {
  id: string;
  nombre: string;
  dosis: string;
  presentacion: string;
  horario: string;
  tipo: 'cronico' | 'corta-duracion' | 'finalizado';
  medico: string;
  fechaInicio: string;
  fechaFin?: string;
  fechaRenovacion?: string;
  duracion?: string;
  expanded: boolean;
  progreso?: {
    porcentaje: number;
    diasTomados: string;
    diasRestantes: string;
  };
}

interface Receta {
  id: string;
  numero: string;
  titulo: string;
  fecha: string;
  estado: 'vigente' | 'renovable' | 'vencida';
  validez: string;
  instrucciones?: string;
  doctor: {
    nombre: string;
    especialidad: string;
    rut: string;
    registro: string;
    centro: string;
  };
  paciente: {
    nombre: string;
    rut: string;
  };
  medicamentos: {
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
    cantidad: string;
    via: string;
  }[];
}

@Component({
  selector: 'app-recetas-medicamentos',
  templateUrl: './recetas-medicamentos.page.html',
  styleUrls: ['./recetas-medicamentos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonSegment, IonSegmentButton, IonBadge, IonChip, IonButton,
    IonProgressBar, IonModal, IonFab, IonFabButton,
    IonInput, IonSelect, IonSelectOption, IonDatetime, IonPopover, IonFooter
  ]
})
export class RecetasMedicamentosPage implements OnInit {
  selectedTab: string = 'medicamentos';
  mostrarRecetaModal: boolean = false;
  recetaSeleccionada: Receta | null = null;
  
  modalAbierto = false;
  fechaInicioFormateada = '';
  fechaFinFormateada = '';
  tipoTratamiento: 'cronico' | 'corta-duracion' | null = null;
  
  nuevoMedicamento: Partial<Medicamento> = {
    nombre: '',
    dosis: '',
    presentacion: '',
    horario: '',
    medico: '',
    fechaInicio: '',
    fechaFin: ''
  };
  
  medicamentosActivos: Medicamento[] = [];
  medicamentosFinalizados: Medicamento[] = [];
  recetas: Receta[] = [];

  constructor(private toastController: ToastController) { 
    this.inicializarDatosDePrueba();
  }

  ngOnInit() {}

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.limpiarFormulario();
  }

  private limpiarFormulario() {
    this.nuevoMedicamento = {
      nombre: '',
      dosis: '',
      presentacion: '',
      horario: '',
      medico: '',
      fechaInicio: '',
      fechaFin: ''
    };
    this.fechaInicioFormateada = '';
    this.fechaFinFormateada = '';
    this.tipoTratamiento = null;
  }

  onTipoTratamientoChange() {
    if (this.tipoTratamiento === 'cronico') {
      this.nuevoMedicamento.fechaFin = '';
      this.fechaFinFormateada = '';
    }
  }

  onFechaInicioChange(event: any) {
    if (event?.detail?.value) {
      this.nuevoMedicamento.fechaInicio = event.detail.value;
      
      const fechaParts = event.detail.value.split('T')[0].split('-');
      const año = parseInt(fechaParts[0]);
      const mes = parseInt(fechaParts[1]) - 1;
      const dia = parseInt(fechaParts[2]);
      
      const fechaObj = new Date(año, mes, dia);
      
      this.fechaInicioFormateada = fechaObj.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      if (this.nuevoMedicamento.fechaFin) {
        const fechaFinParts = this.nuevoMedicamento.fechaFin.split('T')[0].split('-');
        const fechaFin = new Date(
          parseInt(fechaFinParts[0]), 
          parseInt(fechaFinParts[1]) - 1, 
          parseInt(fechaFinParts[2])
        );

        if (fechaFin < fechaObj) {
          this.nuevoMedicamento.fechaFin = '';
          this.fechaFinFormateada = '';
          this.mostrarToast('La fecha de finalización no puede ser anterior a la de inicio', 'warning');
        }
      }
    }
  }

  onFechaFinChange(event: any) {
      if (event?.detail?.value) {
        this.nuevoMedicamento.fechaFin = event.detail.value;
        
        const fechaParts = event.detail.value.split('T')[0].split('-');
        const año = parseInt(fechaParts[0]);
        const mes = parseInt(fechaParts[1]) - 1;
        const dia = parseInt(fechaParts[2]);
        
        const fechaObj = new Date(año, mes, dia);

        if (this.nuevoMedicamento.fechaInicio) {
          const fechaInicioParts = this.nuevoMedicamento.fechaInicio.split('T')[0].split('-');
          const fechaInicio = new Date(
            parseInt(fechaInicioParts[0]), 
            parseInt(fechaInicioParts[1]) - 1, 
            parseInt(fechaInicioParts[2])
          );

          if (fechaObj < fechaInicio) {
            this.nuevoMedicamento.fechaFin = '';
            this.fechaFinFormateada = '';
            this.mostrarToast('La fecha de finalización no puede ser anterior a la de inicio', 'warning');
            return;
          }
        }
        
        this.fechaFinFormateada = fechaObj.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    }

    esFormularioValido(): boolean {
      const camposBasicos = !!(
        this.nuevoMedicamento.nombre?.trim() &&
        this.nuevoMedicamento.dosis?.trim() &&
        this.nuevoMedicamento.presentacion &&
        this.nuevoMedicamento.horario?.trim() &&
        this.nuevoMedicamento.medico?.trim() &&
        this.nuevoMedicamento.fechaInicio &&
        this.tipoTratamiento
      );

      if (this.tipoTratamiento === 'corta-duracion') {
        return camposBasicos && !!this.nuevoMedicamento.fechaFin;
      }

      return camposBasicos;
    }

    async guardarMedicamento() {
      if (!this.esFormularioValido()) {
        this.mostrarToast('Completa todos los campos requeridos', 'warning');
        return;
      }

      const nuevo: Medicamento = {
        id: Date.now().toString(),
        nombre: this.nuevoMedicamento.nombre!.trim(),
        dosis: this.nuevoMedicamento.dosis!.trim(),
        presentacion: this.nuevoMedicamento.presentacion!,
        horario: this.nuevoMedicamento.horario!.trim(),
        tipo: this.tipoTratamiento as 'cronico' | 'corta-duracion',
        medico: this.nuevoMedicamento.medico!.trim(),
        fechaInicio: this.nuevoMedicamento.fechaInicio!.split('T')[0],
        fechaFin: this.tipoTratamiento === 'corta-duracion' && this.nuevoMedicamento.fechaFin ? 
                  this.nuevoMedicamento.fechaFin.split('T')[0] : undefined,
        expanded: false
      };

      // Calcular progreso si es corta duración
      if (nuevo.tipo === 'corta-duracion' && nuevo.fechaFin) {
        nuevo.progreso = this.calcularProgreso(nuevo.fechaInicio, nuevo.fechaFin);
      }

      this.medicamentosActivos.unshift(nuevo);
      this.cerrarModal();
      this.mostrarToast('Medicamento registrado correctamente', 'success');
    }

    async mostrarToast(message: string, color: string = 'primary') {
      const toast = await this.toastController.create({
        message,
        duration: 2500,
        position: 'top',
        color
      });
      await toast.present();
    }

    // --- Métodos de formateo y cálculo ---
    formatearFecha(fecha: string): string {
      if (!fecha) return '';
      
      const fechaParts = fecha.split('-');
      const año = parseInt(fechaParts[0]);
      const mes = parseInt(fechaParts[1]) - 1;
      const dia = parseInt(fechaParts[2]);
      
      const date = new Date(año, mes, dia);
      
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }

    calcularProgreso(fechaInicio: string, fechaFin: string): { porcentaje: number; diasTomados: string; diasRestantes: string } | undefined {
      if (!fechaInicio || !fechaFin) return undefined;

      const inicio = this.parsearFecha(fechaInicio);
      const fin = this.parsearFecha(fechaFin);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const totalDias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      const diasTranscurridos = Math.ceil((hoy.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      const diasRestantes = totalDias - diasTranscurridos;

      if (diasRestantes <= 0 || diasTranscurridos < 0) return undefined;

      const porcentaje = Math.min(diasTranscurridos / totalDias, 1);

      return {
        porcentaje,
        diasTomados: `${diasTranscurridos} de ${totalDias} días`,
        diasRestantes: `${diasRestantes} días restantes`
      };
    }

    private parsearFecha(fecha: string): Date {
      const fechaParts = fecha.split('-');
      return new Date(parseInt(fechaParts[0]), parseInt(fechaParts[1]) - 1, parseInt(fechaParts[2]));
    }

    calcularDiasLabel(fechaInicio: string, fechaFin: string): string {
      if (!fechaInicio || !fechaFin) return '';
      
      const inicio = this.parsearFecha(fechaInicio);
      const fin = this.parsearFecha(fechaFin);
      
      const totalDias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      
      return `${totalDias} días`;
    }

    // --- Métodos existentes ---
    onTabChange(event: any): void {
      this.selectedTab = event.detail.value;
    }

    toggleMedicamento(medicamento: Medicamento): void {
      medicamento.expanded = !medicamento.expanded;
    }

    verRecetaCompleta(receta: Receta): void {
      this.recetaSeleccionada = receta;
      this.mostrarRecetaModal = true;
    }

    cerrarRecetaModal(): void {
      this.mostrarRecetaModal = false;
      this.recetaSeleccionada = null;
    }

    descargarReceta(receta: Receta): void {
      console.log('Descargar receta:', receta.numero);
    }

    getMedicamentoTypeClass(medicamento: Medicamento): string {
      return medicamento.tipo;
    }

    getBadgeColor(medicamento: Medicamento): string {
      switch (medicamento.tipo) {
        case 'cronico': return 'success';
        case 'corta-duracion': return 'warning';
        case 'finalizado': return 'medium';
        default: return 'medium';
      }
    }

    getBadgeLabel(medicamento: Medicamento): string {
      switch (medicamento.tipo) {
        case 'cronico': return 'Crónico';
        case 'corta-duracion': return '7 días';
        case 'finalizado': return 'Completado';
        default: return '';
      }
    }

    getTipoIcon(tipo: string): string {
      switch (tipo) {
        case 'cronico': return 'infinite-outline';
        case 'corta-duracion': return 'timer-outline';
        case 'finalizado': return 'checkmark-done-outline';
        default: return 'help-circle-outline';
      }
    }

    getTipoDescription(tipo: string): string {
      switch (tipo) {
        case 'cronico': return 'Tratamiento crónico';
        case 'corta-duracion': return 'Tratamiento temporal';
        case 'finalizado': return 'Tratamiento completado';
        default: return 'Sin clasificar';
      }
    }

    private inicializarDatosDePrueba(): void {
      this.medicamentosActivos = [
        {
          id: '1',
          nombre: 'Losartán',
          dosis: '50 mg',
          presentacion: 'Comprimidos',
          horario: 'Cada 12 horas',
          tipo: 'cronico',
          medico: 'Dr. Carlos Mendoza',
          fechaInicio: '2025-06-15',
          fechaRenovacion: '15 Sep 2025',
          expanded: false
        },
        {
          id: '2',
          nombre: 'Amoxicilina',
          dosis: '500 mg',
          presentacion: 'Cápsulas',
          horario: 'Cada 8 horas por 7 días',
          tipo: 'corta-duracion',
          medico: 'Dr. Ana Vargas',
          fechaInicio: '2025-08-18',
          fechaFin: '2025-08-25',
          expanded: false,
          progreso: {
            porcentaje: 0.43,
            diasTomados: '3 de 7 días',
            diasRestantes: '4 días restantes'
          }
        }
      ];

      this.medicamentosFinalizados = [
        {
          id: '3',
          nombre: 'Omeprazol',
          dosis: '20 mg',
          presentacion: 'Cápsulas',
          horario: 'Finalizado el 10 Ago 2025',
          tipo: 'finalizado',
          medico: 'Dr. Luis Prado',
          fechaInicio: '2025-07-10',
          fechaFin: '2025-08-10',
          duracion: '30 días',
          expanded: false
        }
      ];

      this.recetas = [
        {
          id: '1',
          numero: '#2025-0145',
          titulo: 'Receta #2025-0145',
          fecha: '21 Agosto 2025',
          estado: 'vigente',
          validez: '30 días',
          doctor: {
            nombre: 'Dr. Juan C. Herrera',
            especialidad: 'Medicina General',
            rut: '12.345.678-9',
            registro: '12345',
            centro: 'Centro Médico San Juan'
          },
          paciente: {
            nombre: 'Rosa Pino',
            rut: '98.765.432-1'
          },
          medicamentos: [
            {
              nombre: 'Amoxar 150mg',
              dosis: '1 cápsula',
              frecuencia: 'Cada 8 horas',
              duracion: '7 días',
              cantidad: '21 cápsulas',
              via: 'Oral'
            },
            {
              nombre: 'Ketazol 200mg',
              dosis: '2 comprimidos',
              frecuencia: 'Al día',
              duracion: '6 días',
              cantidad: '12 comprimidos',
              via: 'Oral'
            }
          ]
        }
      ];
    }
  }