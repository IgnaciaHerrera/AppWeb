import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonFab, IonFabButton, IonModal, IonInput, IonFooter,
  IonDatetime, IonPopover, IonSelect, IonSelectOption,
  ToastController, IonButton, IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { CounterCardComponent } from '../components/counter-card/counter-card.component';
import { FilterBarComponent } from '../components/filter-bar/filter-bar.component';
import { ScrollToTopComponent } from '../components/scroll-to-top/scroll-to-top.component';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import { DeleteConfirmModalComponent } from '../components/delete-confirm-modal/delete-confirm-modal.component';

interface Medicamento {
  id: string;
  nombre: string;
  dosis: string;
  presentacion: string;
  horario: string;
  tipo: 'cronico' | 'corta-duracion';
  estado: 'Activo' | 'Finalizado';
  fechaInicio: string;
  fechaFin?: string;
  expanded: boolean;
}

type OrdenMedicamento = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';
type PeriodoMedicamento = 'todos' | 'ultimo-mes' | 'ultimos-3-meses' | 'ultimos-6-meses' | 'este-anio';

@Component({
  selector: 'app-recetas-medicamentos',
  templateUrl: './recetas-medicamentos.page.html',
  styleUrls: ['./recetas-medicamentos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonFab, IonFabButton, IonModal, IonInput, IonFooter,
    IonDatetime, IonPopover, IonSelect, IonSelectOption,
    IonButton, IonInfiniteScroll, IonInfiniteScrollContent,
    CounterCardComponent, FilterBarComponent, ScrollToTopComponent,
    MenuItemComponent, DeleteConfirmModalComponent
  ]
})
export class RecetasMedicamentosPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;

  // Scroll y Lazy Loading 
  showScrollButton = false;
  private scrollThreshold = 300;
  private itemsPorCarga = 10;
  private indiceActual = 0;
  private lastScrollTop = 0;
  private buffer = 200;
  medicamentosVisibles: Medicamento[] = [];

  // Datos y filtros 
  medicamentos: Medicamento[] = [];
  medicamentosFiltrados: Medicamento[] = [];
  ordenSeleccionado: OrdenMedicamento = 'recientes';
  periodoSeleccionado: PeriodoMedicamento = 'todos';
  periodoSeleccionadoTexto = 'Todos';
  modalPeriodoAbierto = false;
  modalOrdenAbierto = false;

  // Contadores 
  contadores = {
    totalMedicamentos: 0,
    medicamentosActivos: 0
  };

  // Modal agregar/editar 
  modalAbierto = false;
  modoEdicion = false;
  medicamentoEditandoId: string | null = null;
  fechaInicioFormateada = '';
  fechaFinFormateada = '';
  tipoTratamiento: 'cronico' | 'corta-duracion' | null = null;
  nuevoMedicamento: Partial<Medicamento> = {
    nombre: '',
    dosis: '',
    presentacion: '',
    horario: '',
    fechaInicio: '',
    fechaFin: ''
  };

  // Modal eliminar
  modalEliminarAbierto = false;
  medicamentoAEliminar: Medicamento | null = null;

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    this.inicializarDatosDePrueba();
    this.aplicarFiltroPeriodo();
    this.actualizarContadores();
    this.cargarPrimerosMedicamentos();
  }

  // Editar medicamento
  editarMedicamento(medicamento: Medicamento) {
    this.modoEdicion = true;
    this.medicamentoEditandoId = medicamento.id;
    this.tipoTratamiento = medicamento.tipo;
    this.nuevoMedicamento = {
      nombre: medicamento.nombre,
      dosis: medicamento.dosis,
      presentacion: medicamento.presentacion,
      horario: medicamento.horario,
      fechaInicio: medicamento.fechaInicio,
      fechaFin: medicamento.fechaFin
    };
    
    const fechaInicioObj = new Date(medicamento.fechaInicio);
    this.fechaInicioFormateada = fechaInicioObj.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });

    if (medicamento.fechaFin) {
      const fechaFinObj = new Date(medicamento.fechaFin);
      this.fechaFinFormateada = fechaFinObj.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
    
    this.modalAbierto = true;
  }

  // Confirmar eliminacion
  confirmarEliminar(medicamento: Medicamento) {
    this.medicamentoAEliminar = medicamento;
    this.modalEliminarAbierto = true;
  }

  cerrarModalEliminar() {
    this.modalEliminarAbierto = false;
    this.medicamentoAEliminar = null;
  }

  // Eliminar medicamento
  async eliminarMedicamento() {
    if (!this.medicamentoAEliminar) return;

    const id = this.medicamentoAEliminar.id;
    this.medicamentos = this.medicamentos.filter(m => m.id !== id);
    
    this.aplicarFiltroPeriodo();
    this.cerrarModalEliminar();
    
    await this.mostrarToast('Medicamento eliminado exitosamente', 'success');
  }

  // Lazy Loading 
  cargarPrimerosMedicamentos() {
    this.indiceActual = 0;
    this.medicamentosVisibles = [];
    this.cargarMasMedicamentos();
  }

  cargarMasMedicamentos() {
    const inicio = this.indiceActual;
    const fin = Math.min(inicio + this.itemsPorCarga, this.medicamentosFiltrados.length);
    if (inicio >= fin) return;

    const nuevos = this.medicamentosFiltrados.slice(inicio, fin);
    this.medicamentosVisibles = [...this.medicamentosVisibles, ...nuevos];
    this.indiceActual = fin;
  }

  onIonInfinite(event: any) {
    setTimeout(() => {
      this.cargarMasMedicamentos();
      event.target.complete();
      if (this.indiceActual >= this.medicamentosFiltrados.length) {
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
      if (nearBottom && !this.infiniteScroll?.disabled && this.indiceActual < this.medicamentosFiltrados.length) {
        
      }
    } else if (nearTop && this.indiceActual > this.itemsPorCarga) {
      const nuevoInicio = Math.max(0, this.indiceActual - 2 * this.itemsPorCarga);
      this.medicamentosVisibles = this.medicamentosFiltrados.slice(nuevoInicio, nuevoInicio + this.itemsPorCarga);
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

  seleccionarPeriodo(periodo: PeriodoMedicamento) {
    this.periodoSeleccionado = periodo;
    const textos: Record<PeriodoMedicamento, string> = {
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

  seleccionarOrden(orden: OrdenMedicamento) {
    this.ordenSeleccionado = orden;
    this.aplicarOrden();
    this.cerrarSelectorOrden();
    this.cargarPrimerosMedicamentos();
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
      this.medicamentosFiltrados = [...this.medicamentos];
    } else {
      this.medicamentosFiltrados = this.medicamentos.filter(med => {
        const fecha = this.parsearFecha(med.fechaInicio);
        return fecha >= fechaLimite!;
      });
    }

    this.aplicarOrden();
    this.actualizarContadores();
    this.cargarPrimerosMedicamentos();
    this.resetInfiniteScroll();
  }

  getOrdenLabel(): string {
    const labels: Record<OrdenMedicamento, string> = {
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
        this.medicamentosFiltrados.sort((a, b) => 
          new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
        );
        break;
      case 'antiguas':
        this.medicamentosFiltrados.sort((a, b) => 
          new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
        );
        break;
      case 'alfabetico-asc':
        this.medicamentosFiltrados.sort(
          (a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        );
        break;
      case 'alfabetico-desc':
        this.medicamentosFiltrados.sort(
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
    this.contadores.totalMedicamentos = this.medicamentos.length;
    this.contadores.medicamentosActivos = this.medicamentos.filter(m => m.estado === 'Activo').length;
  }

  // Separar por estado 
  get medicamentosActivos(): Medicamento[] {
    return this.medicamentosVisibles.filter(m => m.estado === 'Activo');
  }

  get medicamentosFinalizados(): Medicamento[] {
    return this.medicamentosVisibles.filter(m => m.estado === 'Finalizado');
  }

  // Modal agregar/editar 
  abrirModal() { 
    this.modoEdicion = false;
    this.medicamentoEditandoId = null;
    this.modalAbierto = true; 
  }
  
  cerrarModal() { 
    this.modalAbierto = false; 
    this.modoEdicion = false;
    this.medicamentoEditandoId = null;
    this.limpiarFormulario(); 
  }

  limpiarFormulario() {
    this.nuevoMedicamento = { nombre: '', dosis: '', presentacion: '', horario: '', fechaInicio: '', fechaFin: '' };
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
      const fechaObj = new Date(event.detail.value);
      this.fechaInicioFormateada = fechaObj.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  }

  onFechaFinChange(event: any) {
    if (event?.detail?.value) {
      this.nuevoMedicamento.fechaFin = event.detail.value;
      const fechaObj = new Date(event.detail.value);
      this.fechaFinFormateada = fechaObj.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  }

  esFormularioValido(): boolean {
    const basico = !!(this.nuevoMedicamento.nombre?.trim() && this.nuevoMedicamento.dosis?.trim() &&
      this.nuevoMedicamento.presentacion && this.nuevoMedicamento.horario?.trim() &&
      this.nuevoMedicamento.fechaInicio && this.tipoTratamiento);
    
    if (this.tipoTratamiento === 'corta-duracion') {
      return basico && !!this.nuevoMedicamento.fechaFin;
    }
    return basico;
  }

  async guardarMedicamento() {
    if (!this.esFormularioValido()) {
      this.mostrarToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    const hoy = new Date(); 
    hoy.setHours(0, 0, 0, 0);
    const fechaFin = this.tipoTratamiento === 'corta-duracion' && this.nuevoMedicamento.fechaFin ? 
                     new Date(this.nuevoMedicamento.fechaFin) : null;

    if (this.modoEdicion && this.medicamentoEditandoId) {
      const index = this.medicamentos.findIndex(m => m.id === this.medicamentoEditandoId);
      if (index !== -1) {
        this.medicamentos[index] = {
          ...this.medicamentos[index],
          nombre: this.nuevoMedicamento.nombre!.trim(),
          dosis: this.nuevoMedicamento.dosis!.trim(),
          presentacion: this.nuevoMedicamento.presentacion!,
          horario: this.nuevoMedicamento.horario!.trim(),
          tipo: this.tipoTratamiento!,
          fechaInicio: this.nuevoMedicamento.fechaInicio!.split('T')[0],
          fechaFin: fechaFin ? this.nuevoMedicamento.fechaFin!.split('T')[0] : undefined,
          estado: (fechaFin && fechaFin < hoy) ? 'Finalizado' : 'Activo'
        };
        
        this.aplicarFiltroPeriodo();
        this.cerrarModal();
        await this.mostrarToast('Medicamento actualizado exitosamente', 'success');
      }
    } else {
      const nuevo: Medicamento = {
        id: Date.now().toString(),
        nombre: this.nuevoMedicamento.nombre!.trim(),
        dosis: this.nuevoMedicamento.dosis!.trim(),
        presentacion: this.nuevoMedicamento.presentacion!,
        horario: this.nuevoMedicamento.horario!.trim(),
        tipo: this.tipoTratamiento!,
        fechaInicio: this.nuevoMedicamento.fechaInicio!.split('T')[0],
        fechaFin: fechaFin ? this.nuevoMedicamento.fechaFin!.split('T')[0] : undefined,
        estado: (fechaFin && fechaFin < hoy) ? 'Finalizado' : 'Activo',
        expanded: false
      };

      this.medicamentos.unshift(nuevo);
      this.aplicarFiltroPeriodo();
      this.cerrarModal();
      await this.mostrarToast('Medicamento registrado exitosamente', 'success');
    }
  }

  // Helpers 
  toggleMedicamento(m: Medicamento) { m.expanded = !m.expanded; }
  getStatusClass(m: Medicamento) { return m.estado === 'Activo' ? `status-${m.tipo}` : 'status-finalizado'; }
  getBadgeClass(m: Medicamento) { 
    if (m.estado === 'Finalizado') return 'badge-finalizado';
    return m.tipo === 'cronico' ? 'badge-cronico' : 'badge-corta-duracion';
  }

  formatFecha(f: string): string {
    const [y, m, d] = f.split('-').map(n => parseInt(n));
    return new Date(y, m - 1, d).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  getTipoIcon(tipo: string): string {
    return tipo === 'cronico' ? 'infinite-outline' : 'timer-outline';
  }

  getTipoDescription(tipo: string): string {
    return tipo === 'cronico' ? 'Tratamiento crónico' : 'Tratamiento temporal';
  }

  calcularDiasLabel(inicio: string, fin: string): string {
    const i = this.parsearFecha(inicio);
    const f = this.parsearFecha(fin);
    const dias = Math.ceil((f.getTime() - i.getTime()) / (1000 * 60 * 60 * 24));
    return `${dias} días`;
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
    this.medicamentos = [
      { id: '1', nombre: 'Losartán', dosis: '50 mg', presentacion: 'Comprimidos', horario: 'Cada 12 horas', tipo: 'cronico', fechaInicio: '2024-06-15', estado: 'Activo', expanded: false },
      { id: '2', nombre: 'Amoxicilina', dosis: '500 mg', presentacion: 'Cápsulas', horario: 'Cada 8 horas', tipo: 'corta-duracion', fechaInicio: '2025-10-18', fechaFin: '2025-11-25', estado: 'Activo', expanded: false },
      { id: '3', nombre: 'Omeprazol', dosis: '20 mg', presentacion: 'Cápsulas', horario: 'Cada 24 horas', tipo: 'corta-duracion', fechaInicio: '2024-07-10', fechaFin: '2024-08-10', estado: 'Finalizado', expanded: false },
      { id: '4', nombre: 'Metformina', dosis: '850 mg', presentacion: 'Comprimidos', horario: 'Cada 12 horas', tipo: 'cronico', fechaInicio: '2024-03-20', estado: 'Activo', expanded: false },
      { id: '5', nombre: 'Ibuprofeno', dosis: '400 mg', presentacion: 'Comprimidos', horario: 'Cada 8 horas', tipo: 'corta-duracion', fechaInicio: '2024-09-05', fechaFin: '2024-09-12', estado: 'Finalizado', expanded: false },
      { id: '6', nombre: 'Atorvastatina', dosis: '20 mg', presentacion: 'Comprimidos', horario: 'Cada 24 horas', tipo: 'cronico', fechaInicio: '2024-05-10', estado: 'Activo', expanded: false },
      { id: '7', nombre: 'Claritromicina', dosis: '500 mg', presentacion: 'Cápsulas', horario: 'Cada 12 horas', tipo: 'corta-duracion', fechaInicio: '2024-11-01', fechaFin: '2024-11-14', estado: 'Finalizado', expanded: false },
      { id: '8', nombre: 'Amlodipino', dosis: '5 mg', presentacion: 'Comprimidos', horario: 'Cada 24 horas', tipo: 'cronico', fechaInicio: '2024-02-28', estado: 'Activo', expanded: false },
      { id: '9', nombre: 'Ciprofloxacino', dosis: '250 mg', presentacion: 'Cápsulas', horario: 'Cada 12 horas', tipo: 'corta-duracion', fechaInicio: '2024-08-15', fechaFin: '2024-08-22', estado: 'Finalizado', expanded: false },
      { id: '10', nombre: 'Levotiroxina', dosis: '75 mg', presentacion: 'Comprimidos', horario: 'Cada 24 horas', tipo: 'cronico', fechaInicio: '2024-04-12', estado: 'Activo', expanded: false },
      { id: '11', nombre: 'Prednisona', dosis: '10 mg', presentacion: 'Cápsulas', horario: 'Cada 24 horas', tipo: 'corta-duracion', fechaInicio: '2024-12-01', fechaFin: '2024-12-10', estado: 'Finalizado', expanded: false }
    ];
  }
}