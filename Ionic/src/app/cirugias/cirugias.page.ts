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
import { ApiService } from '../services/api.service';

interface Cirugia {
  id: string;
  descripcion: string;
  cirujano: string;
  hospital: string;
  fechaCirugia: string;
  medico?: string;
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

  // --- Referencia al contenido y scroll ---
  showScrollButton = false;
  private scrollThreshold = 300;

  // --- Listas ---
  cirugias: Cirugia[] = [];
  cirugiasFiltradas: Cirugia[] = [];
  cirugiasVisibles: Cirugia[] = [];

  // --- Lazy loading bidireccional ---
  private itemsPorCarga = 10;
  private indiceActual = 0;
  private lastScrollTop = 0;
  private buffer = 200;

  // --- Contadores ---
  contadores = {
    totalCirugias: 0,
    cirugiasProgamadas: 0
  };

  // --- Orden y filtros ---
  ordenSeleccionado: OrdenCirugia = 'recientes';
  modalOrdenAbierto = false;
  periodoSeleccionado: PeriodoCirugia = 'todos';
  periodoSeleccionadoTexto = 'Todos';
  modalPeriodoAbierto = false;

  // --- Modal agregar/editar ---
  modalAbierto = false;
  modoEdicion = false;
  cirugiaEditandoId: string | null = null;
  fechaFormateada = '';
  
  nuevaCirugia: Partial<Cirugia> = {
    descripcion: '',
    cirujano: '',
    hospital: '',
    fechaCirugia: ''
  };

  // --- Modal eliminar ---
  modalEliminarAbierto = false;
  cirugiaAEliminar: Cirugia | null = null;

  constructor(private toastController: ToastController, private api: ApiService) {}

  ngOnInit() {
    this.cargarCirugiasDesdeApi();
  }

  async cargarCirugiasDesdeApi() {
    try {
      console.log('Cargando cirugías desde API...');
      const response: any = await this.api.get('/cirugias-nuevas');
      console.log('=== RESPONSE FROM API ===');
      console.log('Response completa:', response);
      console.log('Tipo de response:', typeof response);
      console.log('¿Es array?:', Array.isArray(response));
      console.log('Claves del objeto:', response ? Object.keys(response) : 'null/undefined');

      let datos: any = null;
      if (Array.isArray(response)) {
        console.log('→ Detectado: Response es array directo');
        datos = response;
      } else if (response && Array.isArray(response.data)) {
        console.log('→ Detectado: Response.data es array');
        datos = response.data;
      } else if (response && Array.isArray(response.body)) {
        console.log('→ Detectado: Response.body es array');
        datos = response.body;
      } else if (response && Array.isArray(response.items)) {
        console.log('→ Detectado: Response.items es array');
        datos = response.items;
      } else if (response && Array.isArray(response.cirugias)) {
        console.log('→ Detectado: Response.cirugias es array');
        datos = response.cirugias;
      } else if (response && typeof response === 'object') {
        console.log('→ Detectado: Response es objeto simple, convirtiéndolo a array');
        datos = [response];
      }

      console.log('Datos procesados:', datos);
      console.log('¿Datos es array?:', Array.isArray(datos));
      console.log('Longitud de datos:', datos ? datos.length : 'null');

      if (!Array.isArray(datos) || datos.length === 0) {
        this.cirugias = [];
      } else {
        this.cirugias = datos.map((item: any, index: number) => ({
          id: (item.idCirugia || item.id || item._id) ? String(item.idCirugia || item.id || item._id) : `temp_${Date.now()}_${index}`,
          descripcion: item.descripcion || item.description || item.nombre || 'Sin descripción',
          cirujano: item.cirujano || item.surgeon || item.doctor || item.medico || 'N/D',
          hospital: item.hospital || item.institucion || 'N/D',
          fechaCirugia: item.fechaCirugia || item.fecha_cirugia || item.fecha || new Date().toISOString().split('T')[0],
          expanded: false
        } as Cirugia));

        console.log('Cirugías mapeadas:', this.cirugias);
        this.aplicarFiltroPeriodo();
        this.actualizarContadores();
        this.cargarPrimerasCirugias();
      }
    } catch (err: any) {
      console.error('Error cargando cirugías desde API:', err);
      this.inicializarDatosDePrueba();
      this.aplicarFiltroPeriodo();
      this.actualizarContadores();
      this.cargarPrimerasCirugias();
    }
  }

  // === EDITAR CIRUGIA ===
  editarCirugia(cirugia: Cirugia) {
    this.modoEdicion = true;
    this.cirugiaEditandoId = cirugia.id;
    this.nuevaCirugia = {
      descripcion: cirugia.descripcion,
      cirujano: cirugia.cirujano,
      hospital: cirugia.hospital,
      fechaCirugia: cirugia.fechaCirugia
    };
    
    const fechaObj = new Date(cirugia.fechaCirugia);
    this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    this.modalAbierto = true;
  }

  // === CONFIRMAR ELIMINAR ===
  confirmarEliminar(cirugia: Cirugia) {
    this.cirugiaAEliminar = cirugia;
    this.modalEliminarAbierto = true;
  }

  cerrarModalEliminar() {
    this.modalEliminarAbierto = false;
    this.cirugiaAEliminar = null;
  }

  // === ELIMINAR CIRUGÍA ===
  async eliminarCirugia() {
    if (!this.cirugiaAEliminar) return;

    const id = this.cirugiaAEliminar.id;
    try {
      const resultado: any = await this.api.delete(`/cirugias-nuevas/${id}`);
      console.log('DELETE response:', resultado);

      await this.cargarCirugiasDesdeApi();
      this.cerrarModalEliminar();
      await this.mostrarToast('Cirugía eliminada correctamente', 'success');
    } catch (err: any) {
      console.error('Error eliminando cirugía en servidor:', err);

      const status = err?.status ?? 'unknown';
      const body = err?.error ?? err?.message ?? JSON.stringify(err);
      console.error('DELETE error status:', status);
      console.error('DELETE error body:', body);


      this.cirugias = this.cirugias.filter(c => c.id !== id);
      this.aplicarFiltroPeriodo();
      this.cerrarModalEliminar();
      await this.mostrarToast('Cirugía eliminada correctamente', 'success');
    }
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
        const fecha = this.parsearFecha(cirugia.fechaCirugia);
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
          new Date(b.fechaCirugia).getTime() - new Date(a.fechaCirugia).getTime()
        );
        break;
      case 'antiguas':
        this.cirugiasFiltradas.sort((a, b) => 
          new Date(a.fechaCirugia).getTime() - new Date(b.fechaCirugia).getTime()
        );
        break;
      case 'alfabetico-asc':
        this.cirugiasFiltradas.sort(
          (a, b) => a.descripcion.localeCompare(b.descripcion, 'es', { sensitivity: 'base' })
        );
        break;
      case 'alfabetico-desc':
        this.cirugiasFiltradas.sort(
          (a, b) => b.descripcion.localeCompare(a.descripcion, 'es', { sensitivity: 'base' })
        );
        break;
    }
  }

  parsearFecha(fecha: string): Date {
    const [anio, mes, dia] = fecha.split('-').map((n: string) => parseInt(n));
    return new Date(anio, mes - 1, dia);
  }

  actualizarContadores(): void {
    this.contadores.totalCirugias = this.cirugias.length;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    this.contadores.cirugiasProgamadas = this.cirugias.filter(c => {
      const fechaCirugia = this.parsearFecha(c.fechaCirugia);
      fechaCirugia.setHours(0, 0, 0, 0);
      return fechaCirugia > hoy;
    }).length;
  }

  // === Modal agregar/editar === 
  abrirModal() { 
    this.modoEdicion = false;
    this.cirugiaEditandoId = null;
    this.modalAbierto = true; 
  }
  
  cerrarModal() {
    this.modalAbierto = false;
    this.modoEdicion = false;
    this.cirugiaEditandoId = null;
    this.nuevaCirugia = { descripcion: '', cirujano: '', hospital: '', fechaCirugia: '' };
    this.fechaFormateada = '';
  }

  esFormularioValido(): boolean {
    return !!(
      this.nuevaCirugia.descripcion?.trim() &&
      this.nuevaCirugia.cirujano?.trim() &&
      this.nuevaCirugia.hospital?.trim() &&
      this.nuevaCirugia.fechaCirugia
    );
  }

  onFechaCirugiaChange(event: any) {
    if (event?.detail?.value) {
      this.nuevaCirugia.fechaCirugia = event.detail.value;
      const fechaObj = new Date(event.detail.value);
      this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  }

  async guardarCirugia() {
    if (!this.esFormularioValido()) {
      this.mostrarToast('Completa los campos requeridos', 'warning');
      return;
    }

    // Construir payload
    const payload: any = {
      descripcion: this.nuevaCirugia.descripcion!.trim(),
      cirujano: this.nuevaCirugia.cirujano!.trim(),
      hospital: this.nuevaCirugia.hospital!.trim(),
      fechaCirugia: this.nuevaCirugia.fechaCirugia!.split('T')[0]
    };

    try {
      if (this.modoEdicion && this.cirugiaEditandoId) {

        console.log('PUTing to API at /cirugias-nuevas/' + this.cirugiaEditandoId + ':', payload);
        await this.api.put(`/cirugias-nuevas/${this.cirugiaEditandoId}`, payload);
        this.mostrarToast('Cirugía actualizada correctamente', 'success');
      } else {

        console.log('POSTing to API:', payload);
        const response: any = await this.api.post('/cirugias-nuevas', payload);
        console.log('POST response:', response);

        const nuevoId = response?.id;
        console.log('Nuevo ID de cirugía creada:', nuevoId);
        this.mostrarToast('Cirugía registrada correctamente', 'success');
      }

      this.cerrarModal();

      await this.cargarCirugiasDesdeApi();
    } catch (error: any) {
      console.error('Error al guardar cirugía en API:', error);

      if (this.modoEdicion && this.cirugiaEditandoId) {
        const index = this.cirugias.findIndex(c => c.id === this.cirugiaEditandoId);
        if (index !== -1) {
          this.cirugias[index] = {
            ...this.cirugias[index],
            ...payload
          };
          this.aplicarFiltroPeriodo();
        }
      } else {
        const nueva: Cirugia = {
          id: Date.now().toString(),
          ...payload,
          expanded: false
        };
        this.cirugias.unshift(nueva);
        this.aplicarFiltroPeriodo();
      }
      
      this.cerrarModal();
      if (this.modoEdicion && this.cirugiaEditandoId) {
        await this.mostrarToast('Cirugía actualizada correctamente', 'success');
      } else {
        await this.mostrarToast('Cirugía registrada correctamente', 'success');
      }
    }
    this.actualizarContadores();
  }

  // --- Contadores y detalles ---  
  formatFecha(fecha: string): string {
    if (!fecha) return '';
    const [anio, mes, dia] = fecha.split('-').map((n: string) => parseInt(n));
    const date = new Date(anio, mes - 1, dia);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  toggleCirugia(cirugia: Cirugia): void { 
    cirugia.expanded = !cirugia.expanded; 
  }

  getStatusClass(cirugia: Cirugia): string { 
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaCirugia = this.parsearFecha(cirugia.fechaCirugia);
    fechaCirugia.setHours(0, 0, 0, 0);
    return fechaCirugia <= hoy ? 'status-finalizada' : 'status-programada';
  }

  getBadgeClass(cirugia: Cirugia): string { 
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaCirugia = this.parsearFecha(cirugia.fechaCirugia);
    fechaCirugia.setHours(0, 0, 0, 0);
    return fechaCirugia <= hoy ? 'badge-finalizada' : 'badge-programada';
  }

  getStatusLabel(cirugia: Cirugia): string { 
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaCirugia = this.parsearFecha(cirugia.fechaCirugia);
    fechaCirugia.setHours(0, 0, 0, 0);
    return fechaCirugia <= hoy ? 'Finalizada' : 'Programada';
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
      { id: '1', descripcion: 'Apendicectomía', cirujano: 'Dr. Juan Herrera', hospital: 'Clínica Central', fechaCirugia: '2024-11-02', expanded: false },
      { id: '2', descripcion: 'Bypass gástrico', cirujano: 'Dra. Ana Vargas', hospital: 'Hospital Universitario', fechaCirugia: '2024-08-15', expanded: false },
      { id: '3', descripcion: 'Colecistectomía laparoscópica', cirujano: 'Dr. Pablo Medina', hospital: 'Clínica Los Andes', fechaCirugia: '2024-10-30', expanded: false },
      { id: '4', descripcion: 'Reparación de hernia inguinal', cirujano: 'Dr. Carlos Pérez', hospital: 'Hospital del Sur', fechaCirugia: '2024-11-03', expanded: false },
      { id: '5', descripcion: 'Artroscopía de rodilla', cirujano: 'Dra. María Torres', hospital: 'Clínica Santa Isabel', fechaCirugia: '2025-01-09', expanded: false },
      { id: '6', descripcion: 'Resección de tumor mamario', cirujano: 'Dr. Luis Ortega', hospital: 'Hospital Regional', fechaCirugia: '2024-09-21', expanded: false },
      { id: '7', descripcion: 'Cesárea programada', cirujano: 'Dra. Sofía Álvarez', hospital: 'Clínica Mater Dei', fechaCirugia: '2025-10-30', expanded: false },
      { id: '8', descripcion: 'Cirugía de tiroides', cirujano: 'Dr. Ricardo Núñez', hospital: 'Hospital Metropolitano', fechaCirugia: '2024-12-05', expanded: false },
      { id: '9', descripcion: 'Reconstrucción de ligamento cruzado', cirujano: 'Dr. José Fuentes', hospital: 'Clínica del Sol', fechaCirugia: '2025-04-11', expanded: false },
      { id: '10', descripcion: 'Cirugía de cataratas', cirujano: 'Dra. Carolina Bravo', hospital: 'Clínica Oftalmológica VisionCare', fechaCirugia: '2024-10-02', expanded: false }
    ];
  }
}