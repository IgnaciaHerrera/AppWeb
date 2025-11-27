import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonFab, IonFabButton,
  IonModal, IonInput, IonFooter, IonDatetime, IonPopover, ToastController,
  IonButton, IonInfiniteScroll, IonInfiniteScrollContent, IonTextarea,
  IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { CounterCardComponent } from '../components/counter-card/counter-card.component';
import { FilterBarComponent } from '../components/filter-bar/filter-bar.component';
import { ScrollToTopComponent } from '../components/scroll-to-top/scroll-to-top.component';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import { DeleteConfirmModalComponent } from '../components/delete-confirm-modal/delete-confirm-modal.component';
import { ApiService } from '../services/api.service';
import { environment } from 'src/environments/environment';

interface Alergia {
  id: string;
  nombre: string;
  descripcion: string;
  grado: 'leve' | 'moderado' | 'severo';
  fechaRegistro: string;
  expanded: boolean;
}

type OrdenAlergia = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';
type PeriodoAlergia = 'todos' | 'ultimo-mes' | 'ultimos-3-meses' | 'ultimos-6-meses' | 'este-anio';

@Component({
  selector: 'app-alergias',
  templateUrl: './alergias.page.html',
  styleUrls: ['./alergias.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonFab, IonFabButton, IonModal, IonInput, IonFooter, IonDatetime,
    IonPopover, IonButton, IonInfiniteScroll, IonInfiniteScrollContent,
    IonTextarea, IonSelect, IonSelectOption,
    CounterCardComponent, FilterBarComponent, ScrollToTopComponent,
    MenuItemComponent, DeleteConfirmModalComponent
  ]
})
export class AlergiasPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;

  // Scroll y Lazy Loading 
  showScrollButton = false;
  private scrollThreshold = 300;
  private itemsPorCarga = 10;
  private indiceActual = 0;
  private lastScrollTop = 0;
  private buffer = 200;
  alergiasVisibles: Alergia[] = [];

  // Datos y filtros 
  alergias: Alergia[] = [];
  alergiasFiltradas: Alergia[] = [];
  ordenSeleccionado: OrdenAlergia = 'recientes';
  periodoSeleccionado: PeriodoAlergia = 'todos';
  periodoSeleccionadoTexto = 'Todos';
  modalPeriodoAbierto = false;
  modalOrdenAbierto = false;

  //  Contadores 
  contadores = {
    totalAlergias: 0,
    alergiasSeveras: 0
  };

  modalAbierto = false;
  modoEdicion = false;
  alergiaEditandoId: string | null = null;
  fechaFormateada = '';
  nuevaAlergia: Partial<Alergia> = {
    nombre: '',
    descripcion: '',
    grado: 'leve',
    fechaRegistro: ''
  };

  modalEliminarAbierto = false;
  alergiaAEliminar: Alergia | null = null;

  constructor(private toastController: ToastController, private api: ApiService) {}

  ngOnInit() {

    this.cargarAlergias();
  }

  async cargarAlergias() {
    try {
      console.log('Cargando alergias desde API...');
      const response: any = await this.api.get('/alergias');

      let datos: any = null;
      if (Array.isArray(response)) {
        datos = response;
      } else if (response && Array.isArray(response.data)) {
        datos = response.data;
      } else if (response && Array.isArray(response.body)) {
        datos = response.body;
      } else if (response && Array.isArray(response.items)) {
        datos = response.items;
      } else if (response && Array.isArray(response.alergias)) {
        datos = response.alergias;
      } else if (response && typeof response === 'object') {
        datos = [response];
      }

      if (!Array.isArray(datos)) {
        console.warn('API devolvió datos en formato inesperado, usando datos locales de prueba');
        this.inicializarDatosDePrueba();
      } else {
        this.alergias = datos.map((item: any, index: number) => ({
          id: String(item.idAlergia || item.id || item._id || `temp_${Date.now()}_${index}`),
          nombre: item.nombre || item.name || 'Sin nombre',
          descripcion: item.descripcion || item.description || 'Sin descripción',
          grado: (item.grado || item.grade || 'leve') as 'leve' | 'moderado' | 'severo',
          fechaRegistro: item.fechaRegistro || item.fecha_registro || item.date || new Date().toISOString().split('T')[0],
          expanded: false
        } as Alergia));

        this.aplicarFiltroPeriodo();
        this.actualizarContadores();
        this.cargarPrimerasAlergias();

        if (this.alergias.length === 0) {
          console.log('API devolvió un array vacío de alergias');
        }
      }
    } catch (error: any) {
      console.error('Error al cargar alergias desde API:', error);
      this.mostrarToast('No fue posible cargar alergias desde el servidor, usando datos locales', 'warning');
      this.inicializarDatosDePrueba();
      this.aplicarFiltroPeriodo();
      this.actualizarContadores();
      this.cargarPrimerasAlergias();
    }
  }


  editarAlergia(alergia: Alergia) {
    this.modoEdicion = true;
    this.alergiaEditandoId = alergia.id;
    this.nuevaAlergia = {
      nombre: alergia.nombre,
      descripcion: alergia.descripcion,
      grado: alergia.grado,
      fechaRegistro: alergia.fechaRegistro
    };
    
    const fechaObj = new Date(alergia.fechaRegistro);
    this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    this.modalAbierto = true;
  }

  confirmarEliminar(alergia: Alergia) {
    this.alergiaAEliminar = alergia;
    this.modalEliminarAbierto = true;
  }

  cerrarModalEliminar() {
    this.modalEliminarAbierto = false;
    this.alergiaAEliminar = null;
  }

  async eliminarAlergia() {
    if (!this.alergiaAEliminar) return;

    const id = this.alergiaAEliminar.id;
    try {

      const resultado: any = await this.api.delete(`/alergias/${id}`);
      console.log('DELETE response:', resultado);

      await this.cargarAlergias();
      this.cerrarModalEliminar();
      await this.mostrarToast('Alergia eliminada en servidor', 'success');
    } catch (err: any) {
      console.error('Error eliminando alergia en servidor:', err);

      const status = err?.status ?? 'unknown';
      const body = err?.error ?? err?.message ?? JSON.stringify(err);
      console.error('DELETE error status:', status);
      console.error('DELETE error body:', body);

      this.alergias = this.alergias.filter(a => a.id !== id);
      this.aplicarFiltroPeriodo();
      this.cerrarModalEliminar();
      await this.mostrarToast(`Alergia eliminada localmente (server ${status}): ${typeof body === 'string' ? body : JSON.stringify(body)}`, 'warning');
    }
  }

  async eliminarAlergiaDirecta(alergia: Alergia) {
    this.alergiaAEliminar = alergia;

    await this.eliminarAlergia();
  }

  // Lazy Loading 
  cargarPrimerasAlergias() {
    this.indiceActual = 0;
    this.alergiasVisibles = [];
    this.cargarMasAlergias();
  }

  cargarMasAlergias() {
    const inicio = this.indiceActual;
    const fin = Math.min(inicio + this.itemsPorCarga, this.alergiasFiltradas.length);
    if (inicio >= fin) return;

    const nuevas = this.alergiasFiltradas.slice(inicio, fin);
    this.alergiasVisibles = [...this.alergiasVisibles, ...nuevas];
    this.indiceActual = fin;
  }

  onIonInfinite(event: any) {
    setTimeout(() => {
      this.cargarMasAlergias();
      event.target.complete();
      if (this.indiceActual >= this.alergiasFiltradas.length) {
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
      if (nearBottom && !this.infiniteScroll?.disabled && this.indiceActual < this.alergiasFiltradas.length) {
        
      }
    } else if (nearTop && this.indiceActual > this.itemsPorCarga) {
      const nuevoInicio = Math.max(0, this.indiceActual - 2 * this.itemsPorCarga);
      this.alergiasVisibles = this.alergiasFiltradas.slice(nuevoInicio, nuevoInicio + this.itemsPorCarga);
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

  seleccionarPeriodo(periodo: PeriodoAlergia) {
    this.periodoSeleccionado = periodo;
    const textos: Record<PeriodoAlergia, string> = {
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

  seleccionarOrden(orden: OrdenAlergia) {
    this.ordenSeleccionado = orden;
    this.aplicarOrden();
    this.cerrarSelectorOrden();
    this.cargarPrimerasAlergias();
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
      this.alergiasFiltradas = [...this.alergias];
    } else {
      this.alergiasFiltradas = this.alergias.filter(alergia => {
        const fecha = this.parsearFecha(alergia.fechaRegistro);
        return fecha >= fechaLimite!;
      });
    }

    this.aplicarOrden();
    this.actualizarContadores();
    this.cargarPrimerasAlergias();
    this.resetInfiniteScroll();
  }

  getOrdenLabel(): string {
    const labels: Record<OrdenAlergia, string> = {
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
        this.alergiasFiltradas.sort((a, b) => 
          new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
        );
        break;
      case 'antiguas':
        this.alergiasFiltradas.sort((a, b) => 
          new Date(a.fechaRegistro).getTime() - new Date(b.fechaRegistro).getTime()
        );
        break;
      case 'alfabetico-asc':
        this.alergiasFiltradas.sort(
          (a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        );
        break;
      case 'alfabetico-desc':
        this.alergiasFiltradas.sort(
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
    this.contadores.totalAlergias = this.alergias.length;
    this.contadores.alergiasSeveras = this.alergias.filter(a => a.grado === 'severo').length;
  }

  // Modal agregar/editar 
  abrirModal() { 
    this.modoEdicion = false;
    this.alergiaEditandoId = null;
    this.modalAbierto = true; 
  }
  
  cerrarModal() { 
    this.modalAbierto = false;
    this.modoEdicion = false;
    this.alergiaEditandoId = null;
    this.limpiarFormulario(); 
  }

  limpiarFormulario() {
    this.nuevaAlergia = { nombre: '', descripcion: '', grado: 'leve', fechaRegistro: '' };
    this.fechaFormateada = '';
  }

  onFechaChange(event: any) {
    if (event?.detail?.value) {
      this.nuevaAlergia.fechaRegistro = event.detail.value;
      const fechaObj = new Date(event.detail.value);
      this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  }

  esFormularioValido(): boolean {
    return !!(this.nuevaAlergia.nombre?.trim() && this.nuevaAlergia.descripcion?.trim() &&
      this.nuevaAlergia.grado && this.nuevaAlergia.fechaRegistro);
  }

  async guardarAlergia() {
    if (!this.esFormularioValido()) {
      this.mostrarToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    const payload: any = {
      nombre: this.nuevaAlergia.nombre!.trim(),
      descripcion: this.nuevaAlergia.descripcion!.trim(),
      grado: this.nuevaAlergia.grado!,
      fechaRegistro: this.nuevaAlergia.fechaRegistro!.split('T')[0]
    };

    try {
      const idFicha = await this.obtenerIdFichaMedica();
      if (idFicha) payload.idFichaMedica = idFicha;
    } catch (e) {
      console.warn('No se pudo obtener idFichaMedica', e);
    }

  const idUsuario = this.obtenerIdDesdeLocalStorage('idUsuario') || this.obtenerIdDesdeLocalStorage('usuarioId') || environment.userId;
  if (idUsuario) payload.idUsuario = idUsuario;

    const idPaciente = this.obtenerIdDesdeLocalStorage('idPaciente') || this.obtenerIdDesdeLocalStorage('pacienteId');
    if (idPaciente) payload.idPaciente = idPaciente;

    try {
      const apiPayload: any = {
        nombre: payload.nombre,
        descripcion: payload.descripcion
      };
      console.log('POSTing to API payload:', apiPayload);

      if (this.modoEdicion && this.alergiaEditandoId) {
        const url = `/alergias/${this.alergiaEditandoId}`;
        const putPayload: any = {
          idAlergia: parseInt(String(this.alergiaEditandoId), 10),
          nombre: apiPayload.nombre,
          descripcion: apiPayload.descripcion
        };
        console.log('PUTing to API payload:', putPayload);
        await this.api.put(url, putPayload);
        this.mostrarToast('Alergia actualizada en servidor', 'success');
      } else {
        await this.api.post('/alergias', apiPayload);
        this.mostrarToast('Alergia creada en servidor', 'success');
      }

      this.cerrarModal();
      this.limpiarFormulario();
      await this.cargarAlergias();
    } catch (error: any) {
      console.error('Error al guardar alergia en API:', error);
      if (this.modoEdicion && this.alergiaEditandoId) {
        const index = this.alergias.findIndex(a => a.id === this.alergiaEditandoId);
        if (index !== -1) {
          this.alergias[index] = {
            ...this.alergias[index],
            nombre: payload.nombre,
            descripcion: payload.descripcion,
            grado: payload.grado,
            fechaRegistro: payload.fechaRegistro
          };
        }
        this.aplicarFiltroPeriodo();
        this.cerrarModal();
        await this.mostrarToast('Alergia actualizada localmente (servidor no disponible)', 'warning');
      } else {
        const nueva: Alergia = {
          id: Date.now().toString(),
          nombre: payload.nombre,
          descripcion: payload.descripcion,
          grado: payload.grado,
          fechaRegistro: payload.fechaRegistro,
          expanded: false
        };
        this.alergias.unshift(nueva);
        this.aplicarFiltroPeriodo();
        this.cerrarModal();
        await this.mostrarToast('Alergia registrada localmente (servidor no disponible)', 'warning');
      }
    }
  }

  // Helpers 
  toggleAlergia(a: Alergia) { a.expanded = !a.expanded; }
  
  getAlergiaGradeClass(a: Alergia) { 
    return `grade-${a.grado}`; 
  }
  
  getBadgeClass(a: Alergia) { 
    return `badge-${a.grado}`; 
  }

  formatFecha(f: string): string {
    const [y, m, d] = f.split('-').map(n => parseInt(n));
    return new Date(y, m - 1, d).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
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
    this.alergias = [
      { id: '1', nombre: 'Polen', descripcion: 'Polen de gramíneas y malezas', grado: 'moderado', fechaRegistro: '2024-05-22', expanded: false },
      { id: '2', nombre: 'Mariscos', descripcion: 'Camarones y langostinos', grado: 'severo', fechaRegistro: '2024-07-10', expanded: false },
      { id: '3', nombre: 'Ácaros del polvo', descripcion: 'Dermatophagoides pteronyssinus', grado: 'leve', fechaRegistro: '2024-08-05', expanded: false },
    ];
  }

  private async obtenerIdFichaMedica(): Promise<number | null> {
    try {
      const claves = ['idFichaMedica', 'fichaId', 'idFicha', 'idPaciente', 'pacienteId'];
      for (const k of claves) {
        const v = localStorage.getItem(k);
        if (v) {
          const n = parseInt(v, 10);
          if (!isNaN(n) && n > 0) return n;
        }
      }
      return null;
    } catch (err) {
      console.warn('Error leyendo idFichaMedica desde localStorage', err);
      return null;
    }
  }

  private obtenerIdDesdeLocalStorage(key: string): number | null {
    try {
      const v = localStorage.getItem(key);
      if (!v) return null;
      const n = parseInt(v, 10);
      return isNaN(n) ? null : n;
    } catch (err) {
      console.warn(`Error leyendo ${key} desde localStorage`, err);
      return null;
    }
  }
}