import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonFab, IonFabButton,
  IonModal, IonInput, IonFooter, IonDatetime, IonPopover, ToastController,
  IonButton, IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { CounterCardComponent } from '../components/counter-card/counter-card.component';
import { FilterBarComponent } from '../components/filter-bar/filter-bar.component';
import { ScrollToTopComponent } from '../components/scroll-to-top/scroll-to-top.component';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import { DeleteConfirmModalComponent } from '../components/delete-confirm-modal/delete-confirm-modal.component';

interface Cirugia {
  id: string;
  nombre: string;
  medico: string;
  hospital: string;
  fecha: string;
  estado: 'Programada' | 'Finalizada';
  expanded: boolean;
}

type OrdenCirugia = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';
type PeriodoCirugia = 'todos' | 'ultimo-mes' | 'ultimos-3-meses' | 'ultimos-6-meses' | 'este-anio';

@Component({
  selector: 'app-cirugias',
  templateUrl: './cirugias.page.html',
  styleUrls: ['./cirugias.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonFab, IonFabButton, IonModal, IonInput, IonFooter, IonDatetime,
    IonPopover, IonButton, IonInfiniteScroll, IonInfiniteScrollContent,
    CounterCardComponent, FilterBarComponent, ScrollToTopComponent,
    MenuItemComponent, DeleteConfirmModalComponent
  ]
})
export class CirugiasPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;

  // Scroll y Lazy Loading 
  showScrollButton = false;
  private scrollThreshold = 300;
  private itemsPorCarga = 10;
  private indiceActual = 0;
  private lastScrollTop = 0;
  private buffer = 200;
  cirugiasVisibles: Cirugia[] = [];

  // Datos y filtros 
  cirugias: Cirugia[] = [];
  cirugiasFiltradas: Cirugia[] = [];
  ordenSeleccionado: OrdenCirugia = 'recientes';
  periodoSeleccionado: PeriodoCirugia = 'todos';
  periodoSeleccionadoTexto = 'Todos';
  modalPeriodoAbierto = false;
  modalOrdenAbierto = false;

  // Contadores 
  contadores = {
    totalCirugias: 0,
    cirugiasProgramadas: 0
  };

  // Modal agregar/editar 
  modalAbierto = false;
  modoEdicion = false;
  cirugiaEditandoId: string | null = null;
  fechaFormateada = '';
  nuevaCirugia: Partial<Cirugia> = {
    nombre: '',
    medico: '',
    hospital: '',
    fecha: ''
  };

  //  Modal eliminar
  modalEliminarAbierto = false;
  cirugiaAEliminar: Cirugia | null = null;

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    this.inicializarDatosDePrueba();
    this.aplicarFiltroPeriodo();
    this.actualizarContadores();
    this.cargarPrimerasCirugias();
  }

  // Editar cirugia 
  editarCirugia(cirugia: Cirugia) {
    this.modoEdicion = true;
    this.cirugiaEditandoId = cirugia.id;
    this.nuevaCirugia = {
      nombre: cirugia.nombre,
      medico: cirugia.medico,
      hospital: cirugia.hospital,
      fecha: cirugia.fecha
    };
    
    const fechaObj = new Date(cirugia.fecha);
    this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    this.modalAbierto = true;
  }

  // Confirmar eliminar 
  confirmarEliminar(cirugia: Cirugia) {
    this.cirugiaAEliminar = cirugia;
    this.modalEliminarAbierto = true;
  }

  cerrarModalEliminar() {
    this.modalEliminarAbierto = false;
    this.cirugiaAEliminar = null;
  }

  // Eliminar cirugia 
  async eliminarCirugia() {
    if (!this.cirugiaAEliminar) return;

    const id = this.cirugiaAEliminar.id;
    this.cirugias = this.cirugias.filter(c => c.id !== id);
    
    this.aplicarFiltroPeriodo();
    this.cerrarModalEliminar();
    
    await this.mostrarToast('Cirugía eliminada exitosamente', 'success');
  }

  // Lazy Loading 
  cargarPrimerasCirugias() {
    this.indiceActual = 0;
    this.cirugiasVisibles = [];
    this.cargarMasCirugias();
  }

  cargarMasCirugias() {
    const inicio = this.indiceActual;
    const fin = Math.min(inicio + this.itemsPorCarga, this.cirugiasFiltradas.length);
    if (inicio >= fin) return;

    const nuevas = this.cirugiasFiltradas.slice(inicio, fin);
    this.cirugiasVisibles = [...this.cirugiasVisibles, ...nuevas];
    this.indiceActual = fin;
  }

  onIonInfinite(event: any) {
    setTimeout(() => {
      this.cargarMasCirugias();
      event.target.complete();
      if (this.indiceActual >= this.cirugiasFiltradas.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  resetInfiniteScroll() {
    if (this.infiniteScroll) this.infiniteScroll.disabled = false;
  }

  // Scroll to Top 
  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;
    const nearBottom = scrollTop + clientHeight + this.buffer >= scrollHeight;
    const nearTop = scrollTop <= this.buffer;
    this.showScrollButton = scrollTop > this.scrollThreshold;

    if (scrollTop > this.lastScrollTop) {
      if (nearBottom && !this.infiniteScroll?.disabled && this.indiceActual < this.cirugiasFiltradas.length) {        
      }
    } else if (nearTop && this.indiceActual > this.itemsPorCarga) {
      const nuevoInicio = Math.max(0, this.indiceActual - 2 * this.itemsPorCarga);
      this.cirugiasVisibles = this.cirugiasFiltradas.slice(nuevoInicio, nuevoInicio + this.itemsPorCarga);
      this.indiceActual = nuevoInicio + this.itemsPorCarga;
      if (this.infiniteScroll?.disabled) this.infiniteScroll.disabled = false;
    }

    this.lastScrollTop = Math.max(scrollTop, 0);
  }

  async scrollToTop() {
    await this.content.scrollToTop(500);
  }

  // Filtros y orden 
  abrirSelectorPeriodo() { this.modalPeriodoAbierto = true; }
  cerrarSelectorPeriodo() { this.modalPeriodoAbierto = false; }
  abrirSelectorOrden() { this.modalOrdenAbierto = true; }
  cerrarSelectorOrden() { this.modalOrdenAbierto = false; }

  seleccionarPeriodo(periodo: PeriodoCirugia) {
    this.periodoSeleccionado = periodo;
    const textos: Record<PeriodoCirugia, string> = {
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

  seleccionarOrden(orden: OrdenCirugia) {
    this.ordenSeleccionado = orden;
    this.aplicarOrden();
    this.cerrarSelectorOrden();
    this.cargarPrimerasCirugias();
    this.resetInfiniteScroll();
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
      this.cirugiasFiltradas = [...this.cirugias];
    } else {
      this.cirugiasFiltradas = this.cirugias.filter(cirugia => {
        const fecha = this.parsearFecha(cirugia.fecha);
        return fecha >= fechaLimite!;
      });
    }

    this.aplicarOrden();
    this.actualizarContadores();
    this.cargarPrimerasCirugias();
    this.resetInfiniteScroll();
  }

  getOrdenLabel(): string {
    const labels: Record<OrdenCirugia, string> = {
      'recientes': 'Más recientes',
      'antiguas': 'Más antiguas',
      'alfabetico-asc': 'A-Z',
      'alfabetico-desc': 'Z-A'
    };
    return labels[this.ordenSeleccionado];
  }

  aplicarOrden(): void {
    switch (this.ordenSeleccionado) {
      case 'recientes':
        this.cirugiasFiltradas.sort((a, b) => 
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        break;
      case 'antiguas':
        this.cirugiasFiltradas.sort((a, b) => 
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
        break;
      case 'alfabetico-asc':
        this.cirugiasFiltradas.sort(
          (a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        );
        break;
      case 'alfabetico-desc':
        this.cirugiasFiltradas.sort(
          (a, b) => b.nombre.localeCompare(a.nombre, 'es', { sensitivity: 'base' })
        );
        break;
    }
  }

  parsearFecha(fecha: string): Date {
    const [anio, mes, dia] = fecha.split('-').map(n => parseInt(n));
    return new Date(anio, mes - 1, dia);
  }

  actualizarContadores() {
    this.contadores.totalCirugias = this.cirugias.length;
    this.contadores.cirugiasProgramadas = this.cirugias.filter(c => c.estado === 'Programada').length;
  }

  // Modal agregar/editar 
  abrirModal() { 
    this.modoEdicion = false;
    this.cirugiaEditandoId = null;
    this.modalAbierto = true; 
  }
  
  cerrarModal() { 
    this.modalAbierto = false; 
    this.modoEdicion = false;
    this.cirugiaEditandoId = null;
    this.limpiarFormulario(); 
  }

  limpiarFormulario() {
    this.nuevaCirugia = { nombre: '', medico: '', hospital: '', fecha: '' };
    this.fechaFormateada = '';
  }

  onFechaChange(event: any) {
    if (event?.detail?.value) {
      this.nuevaCirugia.fecha = event.detail.value;
      const fechaObj = new Date(event.detail.value);
      this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  }

  esFormularioValido(): boolean {
    return !!(this.nuevaCirugia.nombre?.trim() && this.nuevaCirugia.medico?.trim() &&
      this.nuevaCirugia.hospital?.trim() && this.nuevaCirugia.fecha);
  }

  async guardarCirugia() {
    if (!this.esFormularioValido()) {
      this.mostrarToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    const fechaCirugia = new Date(this.nuevaCirugia.fecha!);
    const hoy = new Date(); 
    hoy.setHours(0, 0, 0, 0);

    if (this.modoEdicion && this.cirugiaEditandoId) {
      const index = this.cirugias.findIndex(c => c.id === this.cirugiaEditandoId);
      if (index !== -1) {
        this.cirugias[index] = {
          ...this.cirugias[index],
          nombre: this.nuevaCirugia.nombre!.trim(),
          medico: this.nuevaCirugia.medico!.trim(),
          hospital: this.nuevaCirugia.hospital!.trim(),
          fecha: this.nuevaCirugia.fecha!.split('T')[0],
          estado: fechaCirugia > hoy ? 'Programada' : 'Finalizada'
        };
        
        this.aplicarFiltroPeriodo();
        this.cerrarModal();
        await this.mostrarToast('Cirugía actualizada exitosamente', 'success');
      }
    } else {
      const nueva: Cirugia = {
        id: Date.now().toString(),
        nombre: this.nuevaCirugia.nombre!.trim(),
        medico: this.nuevaCirugia.medico!.trim(),
        hospital: this.nuevaCirugia.hospital!.trim(),
        fecha: this.nuevaCirugia.fecha!.split('T')[0],
        estado: fechaCirugia > hoy ? 'Programada' : 'Finalizada',
        expanded: false
      };

      this.cirugias.unshift(nueva);
      this.aplicarFiltroPeriodo();
      this.cerrarModal();
      await this.mostrarToast('Cirugía registrada exitosamente', 'success');
    }
  }

  // Helpers 
  toggleCirugia(c: Cirugia) { c.expanded = !c.expanded; }
  getStatusClass(c: Cirugia) { return c.estado === 'Programada' ? 'status-programada' : 'status-finalizada'; }
  getBadgeClass(c: Cirugia) { return c.estado === 'Programada' ? 'badge-programada' : 'badge-finalizada'; }

  formatFecha(f: string): string {
    const [y, m, d] = f.split('-').map(n => parseInt(n));
    return new Date(y, m - 1, d).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
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

  inicializarDatosDePrueba() {
    this.cirugias = [
      { id: '1', nombre: 'Apendicectomía', medico: 'Dr. Juan Herrera', hospital: 'Clínica Central', fecha: '2024-06-24', estado: 'Finalizada', expanded: false },
      { id: '2', nombre: 'Bypass gástrico', medico: 'Dra. Ana Vargas', hospital: 'Hospital Universitario', fecha: '2024-08-15', estado: 'Finalizada', expanded: false },
      { id: '3', nombre: 'Colecistectomía laparoscópica', medico: 'Dr. Pablo Medina', hospital: 'Clínica Los Andes', fecha: '2025-10-30', estado: 'Programada', expanded: false },
      { id: '4', nombre: 'Reparación de hernia inguinal', medico: 'Dr. Carlos Pérez', hospital: 'Hospital del Sur', fecha: '2024-11-03', estado: 'Finalizada', expanded: false },
      { id: '5', nombre: 'Artroscopía de rodilla', medico: 'Dra. María Torres', hospital: 'Clínica Santa Isabel', fecha: '2025-01-09', estado: 'Finalizada', expanded: false },
      { id: '6', nombre: 'Resección de tumor mamario', medico: 'Dr. Luis Ortega', hospital: 'Hospital Regional', fecha: '2024-09-21', estado: 'Finalizada', expanded: false },
      { id: '7', nombre: 'Cesárea programada', medico: 'Dra. Sofía Álvarez', hospital: 'Clínica Mater Dei', fecha: '2025-10-30', estado: 'Programada', expanded: false },
      { id: '8', nombre: 'Cirugía de tiroides', medico: 'Dr. Ricardo Núñez', hospital: 'Hospital Metropolitano', fecha: '2024-12-05', estado: 'Finalizada', expanded: false },
      { id: '9', nombre: 'Reconstrucción de ligamento cruzado', medico: 'Dr. José Fuentes', hospital: 'Clínica del Sol', fecha: '2025-04-11', estado: 'Finalizada', expanded: false },
      { id: '10', nombre: 'Cirugía de cataratas', medico: 'Dra. Carolina Bravo', hospital: 'Clínica Oftalmológica VisionCare', fecha: '2024-10-02', estado: 'Finalizada', expanded: false },
      { id: '11', nombre: 'Mastectomía parcial', medico: 'Dr. Andrés Valdivia', hospital: 'Hospital San Rafael', fecha: '2024-07-29', estado: 'Finalizada', expanded: false },
      { id: '12', nombre: 'Cirugía bariátrica revisional', medico: 'Dra. Paula Navarro', hospital: 'Clínica Vida Salud', fecha: '2025-10-31', estado: 'Programada', expanded: false },
      { id: '13', nombre: 'Implante de prótesis de cadera', medico: 'Dr. Matías Rojas', hospital: 'Hospital del Norte', fecha: '2025-01-23', estado: 'Finalizada', expanded: false },
      { id: '14', nombre: 'Amigdalectomía', medico: 'Dr. Sergio Contreras', hospital: 'Clínica Santa María', fecha: '2024-09-04', estado: 'Finalizada', expanded: false },
      { id: '15', nombre: 'Resección intestinal', medico: 'Dra. Daniela Vega', hospital: 'Hospital Universitario', fecha: '2025-02-28', estado: 'Finalizada', expanded: false },
      { id: '16', nombre: 'Cirugía laparoscópica de apéndice', medico: 'Dr. Ignacio Flores', hospital: 'Clínica Central', fecha: '2024-12-19', estado: 'Finalizada', expanded: false }
    ];
  }
}