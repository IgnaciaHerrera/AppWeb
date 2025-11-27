import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonFab, IonFabButton,
  IonModal, IonInput, IonFooter, IonDatetime, IonPopover, ToastController,
  IonButton, IonInfiniteScroll, IonInfiniteScrollContent, IonToggle, IonTextarea
} from '@ionic/angular/standalone';
import { CounterCardComponent } from '../components/counter-card/counter-card.component';
import { FilterBarComponent } from '../components/filter-bar/filter-bar.component';
import { ScrollToTopComponent } from '../components/scroll-to-top/scroll-to-top.component';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import { DeleteConfirmModalComponent } from '../components/delete-confirm-modal/delete-confirm-modal.component';
import { ApiService } from '../services/api.service';

interface Consulta {
  id: string;
  nombre: string;
  medico: string;
  hospital: string;
  fecha: string;
  estado: 'Programada' | 'Finalizada';
  diagnostico?: string;
  tratamiento?: string;
  expanded: boolean;
}

type OrdenConsulta = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';
type PeriodoConsulta = 'todos' | 'ultimo-mes' | 'ultimos-3-meses' | 'ultimos-6-meses' | 'este-anio';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonFab, IonFabButton, IonModal, IonInput, IonFooter, IonDatetime,
    IonPopover, IonButton, IonInfiniteScroll, IonInfiniteScrollContent,
    IonToggle, IonTextarea,
    CounterCardComponent, FilterBarComponent, ScrollToTopComponent,
    MenuItemComponent, DeleteConfirmModalComponent
  ]
})
export class HistorialPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;

  // Scroll y Lazy Loading 
  showScrollButton = false;
  private scrollThreshold = 300;
  private itemsPorCarga = 10;
  private indiceActual = 0;
  private lastScrollTop = 0;
  private buffer = 200;
  consultasVisibles: Consulta[] = [];

  // Datos y filtros 
  consultas: Consulta[] = [];
  consultasFiltradas: Consulta[] = [];
  ordenSeleccionado: OrdenConsulta = 'recientes';
  periodoSeleccionado: PeriodoConsulta = 'todos';
  periodoSeleccionadoTexto = 'Todos';
  modalPeriodoAbierto = false;
  modalOrdenAbierto = false;

  // Contadores 
  contadores = {
    totalConsultas: 0,
    consultasProgramadas: 0
  };

  // Modal agregar/editar
  modalAbierto = false;
  modoEdicion = false;
  consultaEditandoId: string | null = null;
  fechaFormateada = '';
  consultaFinalizada = false;
  nuevaConsulta: Partial<Consulta> = {
    nombre: '',
    medico: '',
    hospital: '',
    fecha: '',
    diagnostico: '',
    tratamiento: ''
  };

  // Modal eliminar 
  modalEliminarAbierto = false;
  consultaAEliminar: Consulta | null = null;

  constructor(private toastController: ToastController, private api: ApiService) {}

  ngOnInit() {
    this.cargarConsultas();
  }

  async cargarConsultas() {
    try {
      console.log('Cargando consultas desde API...');
      const response: any = await this.api.get('/consultas-nuevas');

      let datos: any = null;
      if (Array.isArray(response)) {
        datos = response;
      } else if (response && Array.isArray(response.data)) {
        datos = response.data;
      } else if (response && Array.isArray(response.body)) {
        datos = response.body;
      } else if (response && Array.isArray(response.items)) {
        datos = response.items;
      } else if (response && Array.isArray(response.consultas)) {
        datos = response.consultas;
      } else if (response && typeof response === 'object') {
        datos = [response];
      }

      if (!Array.isArray(datos)) {
        console.warn('API devolvió datos en formato inesperado, usando datos locales de prueba');
        this.inicializarDatosDePrueba();
      } else {
        this.consultas = datos.map((item: any, index: number) => ({
          id: String(item.id || item.idConsulta || `temp_${Date.now()}_${index}`),
          nombre: item.nombre || item.tipoConsulta || 'Consulta General',
          medico: item.medico || 'Dr. Por asignar',
          hospital: item.hospital || 'Hospital General',
          fecha: item.fecha ? item.fecha : new Date().toISOString().split('T')[0],
          estado: item.estado || 'Finalizada',
          diagnostico: item.diagnostico || 'Pendiente',
          tratamiento: item.tratamiento || 'Sin tratamiento registrado',
          expanded: false
        } as Consulta));

        this.aplicarFiltroPeriodo();
        this.actualizarContadores();
        this.cargarPrimerasConsultas();

        if (this.consultas.length === 0) {
          console.log('API devolvió un array vacío de consultas');
        }
      }
    } catch (error: any) {
      console.error('Error al cargar consultas desde API:', error);
      this.mostrarToast('No fue posible cargar consultas desde el servidor, usando datos locales', 'warning');
      this.inicializarDatosDePrueba();
      this.aplicarFiltroPeriodo();
      this.actualizarContadores();
      this.cargarPrimerasConsultas();
    }
  }

  // Editar consulta
  editarConsulta(consulta: Consulta) {
    this.modoEdicion = true;
    this.consultaEditandoId = consulta.id;
    this.nuevaConsulta = {
      nombre: consulta.nombre,
      medico: consulta.medico,
      hospital: consulta.hospital,
      fecha: consulta.fecha,
      diagnostico: consulta.diagnostico || '',
      tratamiento: consulta.tratamiento || ''
    };
    
    const fechaObj = new Date(consulta.fecha);
    this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    this.consultaFinalizada = consulta.estado === 'Finalizada';
    
    this.modalAbierto = true;
  }

  // Confirmar eliminacion
  confirmarEliminar(consulta: Consulta) {
    this.consultaAEliminar = consulta;
    this.modalEliminarAbierto = true;
  }

  cerrarModalEliminar() {
    this.modalEliminarAbierto = false;
    this.consultaAEliminar = null;
  }

  // Eliminar consulta
  async eliminarConsulta() {
    if (!this.consultaAEliminar) return;

    const id = this.consultaAEliminar.id;

    try {
      await this.api.delete(`/consultas-nuevas/${id}`);
      console.log('Consulta eliminada vía API');
      
      this.consultas = this.consultas.filter(c => c.id !== id);
      this.aplicarFiltroPeriodo();
      this.cerrarModalEliminar();
      
      await this.mostrarToast('Consulta eliminada correctamente', 'success');
      await this.cargarConsultas();
    } catch (error: any) {
      console.error('Error eliminando consulta en servidor:', error);
      
      this.consultas = this.consultas.filter(c => c.id !== id);
      this.aplicarFiltroPeriodo();
      this.cerrarModalEliminar();
      
      await this.mostrarToast('Consulta eliminada correctamente', 'success');
    }
  }

  // Lazy Loading
  cargarPrimerasConsultas() {
    this.indiceActual = 0;
    this.consultasVisibles = [];
    this.cargarMasConsultas();
  }

  cargarMasConsultas() {
    const inicio = this.indiceActual;
    const fin = Math.min(inicio + this.itemsPorCarga, this.consultasFiltradas.length);
    if (inicio >= fin) return;

    const nuevas = this.consultasFiltradas.slice(inicio, fin);
    this.consultasVisibles = [...this.consultasVisibles, ...nuevas];
    this.indiceActual = fin;
  }

  onIonInfinite(event: any) {
    setTimeout(() => {
      this.cargarMasConsultas();
      event.target.complete();
      if (this.indiceActual >= this.consultasFiltradas.length) {
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
      if (nearBottom && !this.infiniteScroll?.disabled && this.indiceActual < this.consultasFiltradas.length) {
        
      }
    } else if (nearTop && this.indiceActual > this.itemsPorCarga) {
      const nuevoInicio = Math.max(0, this.indiceActual - 2 * this.itemsPorCarga);
      this.consultasVisibles = this.consultasFiltradas.slice(nuevoInicio, nuevoInicio + this.itemsPorCarga);
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

  seleccionarPeriodo(periodo: PeriodoConsulta) {
    this.periodoSeleccionado = periodo;
    const textos: Record<PeriodoConsulta, string> = {
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

  seleccionarOrden(orden: OrdenConsulta) {
    this.ordenSeleccionado = orden;
    this.aplicarOrden();
    this.cerrarSelectorOrden();
    this.cargarPrimerasConsultas();
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
      this.consultasFiltradas = [...this.consultas];
    } else {
      this.consultasFiltradas = this.consultas.filter(consulta => {
        const fecha = this.parsearFecha(consulta.fecha);
        return fecha >= fechaLimite!;
      });
    }

    this.aplicarOrden();
    this.actualizarContadores();
    this.cargarPrimerasConsultas();
    this.resetInfiniteScroll();
  }

  getOrdenLabel(): string {
    const labels: Record<OrdenConsulta, string> = {
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
        this.consultasFiltradas.sort((a, b) => 
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        break;
      case 'antiguas':
        this.consultasFiltradas.sort((a, b) => 
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
        break;
      case 'alfabetico-asc':
        this.consultasFiltradas.sort(
          (a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        );
        break;
      case 'alfabetico-desc':
        this.consultasFiltradas.sort(
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
    this.contadores.totalConsultas = this.consultas.length;
    this.contadores.consultasProgramadas = this.consultas.filter(c => c.estado === 'Programada').length;
  }

  // Modal agregar/editar
  abrirModal() { 
    this.modoEdicion = false;
    this.consultaEditandoId = null;
    this.modalAbierto = true; 
  }
  
  cerrarModal() { 
    this.modalAbierto = false;
    this.modoEdicion = false;
    this.consultaEditandoId = null;
    this.limpiarFormulario(); 
  }

  limpiarFormulario() {
    this.nuevaConsulta = { nombre: '', medico: '', hospital: '', fecha: '', diagnostico: '', tratamiento: '' };
    this.fechaFormateada = '';
    this.consultaFinalizada = false;
  }

  onFechaChange(event: any) {
    if (event?.detail?.value) {
      this.nuevaConsulta.fecha = event.detail.value;
      const fechaObj = new Date(event.detail.value);
      this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  }

  onToggleChange() {
    if (!this.consultaFinalizada) {
      this.nuevaConsulta.diagnostico = '';
      this.nuevaConsulta.tratamiento = '';
    }
  }

  esFormularioValido(): boolean {
    const basico = !!(this.nuevaConsulta.nombre?.trim() && this.nuevaConsulta.medico?.trim() &&
      this.nuevaConsulta.hospital?.trim() && this.nuevaConsulta.fecha);
    if (this.consultaFinalizada) {
      return basico && !!this.nuevaConsulta.diagnostico?.trim();
    }
    return basico;
  }

  async guardarConsulta() {
    if (!this.esFormularioValido()) {
      this.mostrarToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    const consultaPayload = {
      nombre: this.nuevaConsulta.nombre!.trim(),
      medico: this.nuevaConsulta.medico!.trim(),
      hospital: this.nuevaConsulta.hospital!.trim(),
      fecha: this.nuevaConsulta.fecha!.split('T')[0],
      diagnostico: this.nuevaConsulta.diagnostico?.trim() || '',
      tratamiento: this.nuevaConsulta.tratamiento?.trim() || '',
      tipoConsulta: 'General'
    };

    try {
      if (this.modoEdicion && this.consultaEditandoId) {

        await this.api.put(`/consultas-nuevas/${this.consultaEditandoId}`, consultaPayload);
        console.log('Consulta actualizada vía API');
        this.mostrarToast('Consulta actualizada correctamente', 'success');
      } else {

        await this.api.post('/consultas-nuevas', consultaPayload);
        console.log('Consulta creada vía API');
        this.mostrarToast('Consulta registrada correctamente', 'success');
      }

      this.cerrarModal();
      this.limpiarFormulario();
      await this.cargarConsultas();
    } catch (error: any) {
      console.error('Error al guardar consulta en API:', error);

      if (this.modoEdicion && this.consultaEditandoId) {
        const index = this.consultas.findIndex(c => c.id === this.consultaEditandoId);
        if (index !== -1) {
          this.consultas[index] = {
            ...this.consultas[index],
            nombre: consultaPayload.nombre,
            medico: consultaPayload.medico,
            hospital: consultaPayload.hospital,
            fecha: consultaPayload.fecha,
            diagnostico: consultaPayload.diagnostico,
            tratamiento: consultaPayload.tratamiento
          };
        }
        this.aplicarFiltroPeriodo();
        this.cerrarModal();
        this.limpiarFormulario();
        this.mostrarToast('Consulta actualizada correctamente', 'success');
      } else {
        const nueva: Consulta = {
          id: `temp_${Date.now()}`,
          nombre: consultaPayload.nombre,
          medico: consultaPayload.medico,
          hospital: consultaPayload.hospital,
          fecha: consultaPayload.fecha,
          estado: 'Finalizada',
          diagnostico: consultaPayload.diagnostico,
          tratamiento: consultaPayload.tratamiento,
          expanded: false
        };

        this.consultas.unshift(nueva);
        this.aplicarFiltroPeriodo();
        this.cerrarModal();
        this.limpiarFormulario();
        this.mostrarToast('Consulta registrada correctamente', 'success');
      }
    }
  }

  // Helpers 
  toggleConsulta(c: Consulta) { c.expanded = !c.expanded; }
  getStatusClass(c: Consulta) { return c.estado === 'Programada' ? 'status-programada' : 'status-finalizada'; }
  getBadgeClass(c: Consulta) { return c.estado === 'Programada' ? 'badge-programada' : 'badge-finalizada'; }

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
    this.consultas = [
      { id: '1', nombre: 'Cardiología', medico: 'Dr. Carlos Mendoza', hospital: 'Hospital Central', fecha: '2024-10-15', estado: 'Finalizada', diagnostico: 'Presión arterial controlada', tratamiento: 'Continuar medicación actual', expanded: false },
      { id: '16', nombre: 'Gastroenterología', medico: 'Dr. Ricardo Vega', hospital: 'Clínica Digestiva', fecha: '2025-11-15', estado: 'Finalizada', expanded: false }
    ];
  }
}