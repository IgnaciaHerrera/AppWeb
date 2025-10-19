import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonFab, IonFabButton,
  IonModal, IonButton, IonFooter, IonDatetime, IonPopover,
  IonInput, IonToggle, IonInfiniteScroll, IonInfiniteScrollContent,
  ToastController
} from '@ionic/angular/standalone';
import { FilterBarComponent } from '../components/filter-bar/filter-bar.component';
import { ScrollToTopComponent } from '../components/scroll-to-top/scroll-to-top.component';
import { CounterCardComponent } from '../components/counter-card/counter-card.component';

interface Hospitalizacion {
  id: string;
  motivo: string;
  fechaIngreso: string;   
  fechaAlta?: string;
  medico: string;
  hospital?: string;
  expanded: boolean;
}

type TipoOrden = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';
type TipoPeriodo = 'todos' | 'ultimo-mes' | 'ultimos-3-meses' | 'ultimos-6-meses' | 'este-anio';

@Component({
  selector: 'app-hospitalizaciones',
  templateUrl: './hospitalizaciones.page.html',
  styleUrls: ['./hospitalizaciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonFab, IonFabButton, IonModal, IonButton, IonFooter, IonDatetime, 
    IonPopover, IonInput, IonToggle, IonInfiniteScroll, IonInfiniteScrollContent,
    FilterBarComponent, ScrollToTopComponent, CounterCardComponent
  ]
})
export class HospitalizacionesPage implements OnInit {
  // --- Referencia al contenido y scroll ---
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;
  
  showScrollButton = false;
  private scrollThreshold = 300;

  // --- Listas ---
  hospitalizaciones: Hospitalizacion[] = [];
  hospitalizacionesFiltradas: Hospitalizacion[] = [];
  hospitalizacionesVisibles: Hospitalizacion[] = []; 

  // --- Texto contador ---
  totalHospitalizacionesTexto: string = '';

  // --- Lazy loading bidireccional ---
  private itemsPorCarga = 10;
  private indiceActual = 0;
  private lastScrollTop = 0;
  private buffer = 200;

  // --- Contadores ---
  contadores = {
    totalHospitalizaciones: 0,
    totalDias: 0
  };

  // --- Orden y filtros ---
  ordenSeleccionado: TipoOrden = 'recientes';
  modalOrdenAbierto = false;
  periodoSeleccionado: TipoPeriodo = 'todos';
  periodoSeleccionadoTexto = 'Todos';
  modalPeriodoAbierto = false;

  // --- Modal agregar ---
  modalAbierto = false;
  fechaIngresoFormateada = '';
  fechaAltaFormateada = '';
  finalizada = false;
  
  nuevaHosp: Partial<Hospitalizacion> = {
    motivo: '',
    medico: '',
    hospital: '',
    fechaIngreso: '',
    fechaAlta: ''
  };

  constructor(private toastController: ToastController) {
    this.inicializarDatosDePrueba();
  }

  ngOnInit() {
    this.aplicarOrden();
    this.aplicarFiltroPeriodo();
    this.actualizarContadores();
    this.cargarPrimerasHospitalizaciones(); 
  }

  // --- Lazy loading ---  
  cargarPrimerasHospitalizaciones() {
    this.indiceActual = 0;
    this.hospitalizacionesVisibles = [];
    this.cargarMasHospitalizaciones();
  }

  cargarMasHospitalizaciones() {
    const inicio = this.indiceActual;
    const fin = Math.min(inicio + this.itemsPorCarga, this.hospitalizacionesFiltradas.length);
    
    if (inicio >= fin) return;

    const nuevasHospitalizaciones = this.hospitalizacionesFiltradas.slice(inicio, fin);
    this.hospitalizacionesVisibles = [...this.hospitalizacionesVisibles, ...nuevasHospitalizaciones];
    this.indiceActual = fin;
  }

  onIonInfinite(event: any) {
    setTimeout(() => {
      this.cargarMasHospitalizaciones();
      event.target.complete();
      
      if (this.indiceActual >= this.hospitalizacionesFiltradas.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  resetInfiniteScroll() {
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }
  }

  // --- Scroll bidireccional ---  
  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;

    const nearBottom = scrollTop + clientHeight + this.buffer >= scrollHeight;
    const nearTop = scrollTop <= this.buffer;

    this.showScrollButton = scrollTop > this.scrollThreshold;

    if (scrollTop > this.lastScrollTop) {
      if (nearBottom && !this.infiniteScroll?.disabled && this.indiceActual < this.hospitalizacionesFiltradas.length) {
      }
    } else {
      if (nearTop) {
        if (this.indiceActual > this.itemsPorCarga) {
          const nuevoInicio = Math.max(0, this.indiceActual - 2 * this.itemsPorCarga);
          this.hospitalizacionesVisibles = this.hospitalizacionesFiltradas.slice(
            nuevoInicio,
            nuevoInicio + this.itemsPorCarga
          );
          this.indiceActual = nuevoInicio + this.itemsPorCarga;

          if (this.infiniteScroll?.disabled) {
            this.infiniteScroll.disabled = false;
          }
        }
      }
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  async scrollToTop() {
    await this.content.scrollToTop(500);
  }

  // --- Filtros y orden  ---  
  abrirSelectorPeriodo() { this.modalPeriodoAbierto = true; }
  cerrarSelectorPeriodo() { this.modalPeriodoAbierto = false; }

  seleccionarPeriodo(periodo: TipoPeriodo) {
    this.periodoSeleccionado = periodo;
    const textos: Record<TipoPeriodo, string> = {
      'todos': 'Todos',
      'ultimo-mes': 'Último mes',
      'ultimos-3-meses': 'Últimos 3 meses',
      'ultimos-6-meses': 'Últimos 6 meses',
      'este-anio': 'Este año'
    };
    this.periodoSeleccionadoTexto = textos[periodo];
    this.aplicarFiltroPeriodo();
    this.cerrarSelectorPeriodo();
  }

  aplicarFiltroPeriodo() {
    const ahora = new Date();
    let fechaLimite: Date | null = null;

    switch (this.periodoSeleccionado) {
      case 'ultimo-mes':
        fechaLimite = new Date(ahora.getFullYear(), ahora.getMonth() - 1, ahora.getDate());
        break;
      case 'ultimos-3-meses':
        fechaLimite = new Date(ahora.getFullYear(), ahora.getMonth() - 3, ahora.getDate());
        break;
      case 'ultimos-6-meses':
        fechaLimite = new Date(ahora.getFullYear(), ahora.getMonth() - 6, ahora.getDate());
        break;
      case 'este-anio':
        fechaLimite = new Date(ahora.getFullYear(), 0, 1);
        break;
      default:
        fechaLimite = null;
    }

    if (!fechaLimite) {
      this.hospitalizacionesFiltradas = [...this.hospitalizaciones];
    } else {
      this.hospitalizacionesFiltradas = this.hospitalizaciones.filter(hosp => {
        const fecha = this.parsearFecha(hosp.fechaIngreso);
        return fecha >= fechaLimite!;
      });
    }

    this.aplicarOrden();
    this.actualizarContadores();
    this.cargarPrimerasHospitalizaciones(); 
    this.resetInfiniteScroll(); 
  }

  abrirSelectorOrden() { this.modalOrdenAbierto = true; }
  cerrarSelectorOrden() { this.modalOrdenAbierto = false; }

  seleccionarOrden(orden: TipoOrden) {
    this.ordenSeleccionado = orden;
    this.aplicarOrden();
    this.cerrarSelectorOrden();
    this.cargarPrimerasHospitalizaciones(); 
    this.resetInfiniteScroll(); 
  }

  aplicarOrden(): void {
    switch (this.ordenSeleccionado) {
      case 'recientes':
        this.hospitalizacionesFiltradas.sort((a, b) => 
          this.parsearFecha(b.fechaIngreso).getTime() - this.parsearFecha(a.fechaIngreso).getTime()
        );
        break;
      case 'antiguas':
        this.hospitalizacionesFiltradas.sort((a, b) => 
          this.parsearFecha(a.fechaIngreso).getTime() - this.parsearFecha(b.fechaIngreso).getTime()
        );
        break;
      case 'alfabetico-asc':
        this.hospitalizacionesFiltradas.sort(
          (a, b) => a.motivo.localeCompare(b.motivo, 'es', { sensitivity: 'base' })
        );
        break;
      case 'alfabetico-desc':
        this.hospitalizacionesFiltradas.sort(
          (a, b) => b.motivo.localeCompare(a.motivo, 'es', { sensitivity: 'base' })
        );
        break;
    }
  }

  getOrdenLabel(): string {
    const labels: Record<TipoOrden, string> = {
      'recientes': 'Más recientes',
      'antiguas': 'Más antiguas',
      'alfabetico-asc': 'A-Z',
      'alfabetico-desc': 'Z-A'
    };
    return labels[this.ordenSeleccionado];
  }

  parsearFecha(fecha: string): Date {
    const [anio, mes, dia] = fecha.split('-').map(n => parseInt(n));
    return new Date(anio, mes - 1, dia);
  }

  // --- Modal agregar --- 
  abrirModal() { this.modalAbierto = true; }
  
  cerrarModal() {
    this.modalAbierto = false;
    this.nuevaHosp = { motivo: '', medico: '', hospital: '', fechaIngreso: '', fechaAlta: '' };
    this.fechaIngresoFormateada = '';
    this.fechaAltaFormateada = '';
    this.finalizada = false;
  }

  esFormularioValido(): boolean {
    return !!(
      this.nuevaHosp.motivo?.trim() &&
      this.nuevaHosp.medico?.trim() &&
      this.nuevaHosp.hospital?.trim() &&
      this.nuevaHosp.fechaIngreso
    );
  }

  onFechaIngresoChange(event: any) {
    if (event?.detail?.value) {
      this.nuevaHosp.fechaIngreso = event.detail.value;
      const fechaObj = new Date(event.detail.value);
      this.fechaIngresoFormateada = fechaObj.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  }

  onFechaAltaChange(event: any) {
    if (event?.detail?.value) {
      this.nuevaHosp.fechaAlta = event.detail.value;
      const fechaObj = new Date(event.detail.value);
      this.fechaAltaFormateada = fechaObj.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  }

  async guardarHospitalizacion() {
    if (!this.esFormularioValido()) {
      this.mostrarToast('Completa los campos requeridos', 'warning');
      return;
    }

    const nueva: Hospitalizacion = {
      id: Date.now().toString(),
      motivo: this.nuevaHosp.motivo!.trim(),
      medico: this.nuevaHosp.medico!.trim(),
      hospital: this.nuevaHosp.hospital!.trim(),
      fechaIngreso: this.nuevaHosp.fechaIngreso!.split('T')[0],
      fechaAlta: this.finalizada && this.nuevaHosp.fechaAlta 
        ? this.nuevaHosp.fechaAlta.split('T')[0] 
        : undefined,
      expanded: false
    };

    this.hospitalizaciones.unshift(nueva);
    this.aplicarFiltroPeriodo(); 
    this.cerrarModal();
    this.mostrarToast('Hospitalización registrada correctamente', 'success');
    this.actualizarContadores();
  }

  // --- Contadores y detalles ---  
  actualizarContadores(): void {
    const total = this.hospitalizaciones.length;
    let totalDias = 0;

    this.hospitalizaciones.forEach(h => {
      if (h.fechaAlta) {
        const ingreso = this.parsearFecha(h.fechaIngreso);
        const alta = this.parsearFecha(h.fechaAlta);
        const diffMs = alta.getTime() - ingreso.getTime();
        const dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (dias > 0) totalDias += dias;
      }
    });

    this.contadores.totalHospitalizaciones = total;
    this.contadores.totalDias = totalDias;
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const [anio, mes, dia] = fecha.split('-').map(n => parseInt(n));
    const date = new Date(anio, mes - 1, dia);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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

  async mostrarToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'top',
      color
    });
    await toast.present();
  }

  private inicializarDatosDePrueba(): void {
    this.hospitalizaciones = [
      {
        id: '1',
        motivo: 'Evaluación postoperatoria',
        fechaIngreso: '2025-10-19',
        medico: 'Dr. Roberto Silva',
        hospital: 'Hospital Universitario',
        expanded: false
      },
      {
        id: '2',
        motivo: 'Control diabético',
        fechaIngreso: '2024-07-10',
        fechaAlta: '2024-07-18',
        medico: 'Dr. Carlos Mendoza',
        hospital: 'Hospital Central',
        expanded: false
      },
      {
        id: '3',
        motivo: 'Chequeo cardiológico',
        fechaIngreso: '2024-08-03',
        fechaAlta: '2024-08-05',
        medico: 'Dra. Valentina Torres',
        hospital: 'Clínica Los Andes',
        expanded: false
      },
      {
        id: '4',
        motivo: 'Tratamiento de hipertensión',
        fechaIngreso: '2024-09-01',
        fechaAlta: '2024-09-09',
        medico: 'Dr. Andrés Muñoz',
        hospital: 'Hospital Regional',
        expanded: false
      },
      {
        id: '5',
        motivo: 'Cirugía de apendicitis',
        fechaIngreso: '2024-10-12',
        fechaAlta: '2024-10-20',
        medico: 'Dr. Roberto Silva',
        hospital: 'Hospital Universitario',
        expanded: false
      },
      {
        id: '6',
        motivo: 'Revisión traumatológica',
        fechaIngreso: '2024-11-02',
        fechaAlta: '2024-11-07',
        medico: 'Dra. Fernanda López',
        hospital: 'Clínica Santa María',
        expanded: false
      },
      {
        id: '7',
        motivo: 'Evaluación neurológica',
        fechaIngreso: '2024-11-18',
        fechaAlta: '2024-11-22',
        medico: 'Dr. Gabriel Soto',
        hospital: 'Hospital del Sur',
        expanded: false
      },
      {
        id: '8',
        motivo: 'Consulta por migrañas',
        fechaIngreso: '2024-12-05',
        fechaAlta: '2024-12-06',
        medico: 'Dra. Paula Reyes',
        hospital: 'Clínica Los Andes',
        expanded: false
      },
      {
        id: '9',
        motivo: 'Revisión oftalmológica',
        fechaIngreso: '2024-12-20',
        fechaAlta: '2024-12-21',
        medico: 'Dr. Martín Guzmán',
        hospital: 'Centro de la Visión',
        expanded: false
      },
      {
        id: '10',
        motivo: 'Evaluación dermatológica',
        fechaIngreso: '2025-01-07',
        fechaAlta: '2025-01-10',
        medico: 'Dra. Laura Pineda',
        hospital: 'Clínica Dermosalud',
        expanded: false
      },
      {
        id: '11',
        motivo: 'Control postvacuna',
        fechaIngreso: '2025-01-22',
        fechaAlta: '2025-01-22',
        medico: 'Dr. Carlos Mendoza',
        hospital: 'Hospital Central',
        expanded: false
      },
      {
        id: '12',
        motivo: 'Chequeo general anual',
        fechaIngreso: '2025-02-01',
        fechaAlta: '2025-02-02',
        medico: 'Dra. Valentina Torres',
        hospital: 'Clínica Los Andes',
        expanded: false
      },
      {
        id: '13',
        motivo: 'Evaluación nutricional',
        fechaIngreso: '2025-02-15',
        fechaAlta: '2025-02-15',
        medico: 'Dra. María Espinoza',
        hospital: 'Clínica Vida Saludable',
        expanded: false
      },
      {
        id: '14',
        motivo: 'Tratamiento de bronquitis',
        fechaIngreso: '2025-03-03',
        fechaAlta: '2025-03-07',
        medico: 'Dr. Andrés Muñoz',
        hospital: 'Hospital Regional',
        expanded: false
      },
      {
        id: '15',
        motivo: 'Cirugía menor en mano',
        fechaIngreso: '2025-03-20',
        fechaAlta: '2025-03-25',
        medico: 'Dr. Ricardo Vargas',
        hospital: 'Clínica Santa María',
        expanded: false
      },
      {
        id: '16',
        motivo: 'Consulta por alergias',
        fechaIngreso: '2025-04-04',
        fechaAlta: '2025-04-05',
        medico: 'Dra. Paula Reyes',
        hospital: 'Clínica Los Andes',
        expanded: false
      },
      {
        id: '17',
        motivo: 'Control pediátrico',
        fechaIngreso: '2025-04-18',
        fechaAlta: '2025-04-18',
        medico: 'Dr. Martín Guzmán',
        hospital: 'Hospital Infantil',
        expanded: false
      },
      {
        id: '18',
        motivo: 'Chequeo preoperatorio',
        fechaIngreso: '2025-05-02',
        fechaAlta: '2025-05-04',
        medico: 'Dr. Roberto Silva',
        hospital: 'Hospital Universitario',
        expanded: false
      },
      {
        id: '19',
        motivo: 'Evaluación reumatológica',
        fechaIngreso: '2025-05-20',
        fechaAlta: '2025-05-24',
        medico: 'Dra. Fernanda López',
        hospital: 'Clínica Santa María',
        expanded: false
      },
      {
        id: '20',
        motivo: 'Control postparto',
        fechaIngreso: '2025-06-01',
        fechaAlta: '2025-06-03',
        medico: 'Dra. Valentina Torres',
        hospital: 'Clínica Los Andes',
        expanded: false
      },
      {
        id: '21',
        motivo: 'Revisión odontológica',
        fechaIngreso: '2025-06-14',
        fechaAlta: '2025-06-14',
        medico: 'Dr. Sebastián Rojas',
        hospital: 'Centro Dental Integral',
        expanded: false
      },
      {
        id: '22',
        motivo: 'Tratamiento fisioterapéutico',
        fechaIngreso: '2025-07-02',
        fechaAlta: '2025-07-09',
        medico: 'Dr. Gabriel Soto',
        hospital: 'Clínica Movimiento',
        expanded: false
      },
      {
        id: '23',
        motivo: 'Control de colesterol',
        fechaIngreso: '2025-07-20',
        fechaAlta: '2025-07-22',
        medico: 'Dr. Carlos Mendoza',
        hospital: 'Hospital Central',
        expanded: false
      },
      {
        id: '24',
        motivo: 'Evaluación otorrinolaringológica',
        fechaIngreso: '2025-08-05',
        fechaAlta: '2025-08-07',
        medico: 'Dr. Ricardo Vargas',
        hospital: 'Clínica Santa María',
        expanded: false
      },
      {
        id: '25',
        motivo: 'Chequeo ginecológico',
        fechaIngreso: '2025-09-15',
        fechaAlta: '2025-09-16',
        medico: 'Dra. Laura Pineda',
        hospital: 'Clínica Vida Mujer',
        expanded: false
      }

    ];
    this.hospitalizacionesFiltradas = [...this.hospitalizaciones];
  }
}