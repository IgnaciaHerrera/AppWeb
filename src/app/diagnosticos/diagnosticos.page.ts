import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonFab, IonFabButton,
  IonModal, IonInput, IonFooter, IonDatetime, IonPopover, ToastController,
  IonButton, IonInfiniteScroll, IonInfiniteScrollContent, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { CounterCardComponent } from '../components/counter-card/counter-card.component';
import { FilterBarComponent } from '../components/filter-bar/filter-bar.component';
import { ScrollToTopComponent } from '../components/scroll-to-top/scroll-to-top.component';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import { DeleteConfirmModalComponent } from '../components/delete-confirm-modal/delete-confirm-modal.component';

interface Diagnostico {
  id: string;
  enfermedad: string;
  severidad: 'leve' | 'moderado' | 'severo' | 'critico';
  fase: 'inicial' | 'progreso' | 'estable' | 'remision';
  fechaDiagnostico: string;
  medico: string;
  expanded: boolean;
}

type OrdenDiagnostico = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';
type PeriodoDiagnostico = 'todos' | 'ultimo-mes' | 'ultimos-3-meses' | 'ultimos-6-meses' | 'este-anio';

@Component({
  selector: 'app-diagnosticos',
  templateUrl: './diagnosticos.page.html',
  styleUrls: ['./diagnosticos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonFab, IonFabButton, IonModal, IonInput, IonFooter, IonDatetime,
    IonPopover, IonButton, IonInfiniteScroll, IonInfiniteScrollContent,
    IonSelect, IonSelectOption,
    CounterCardComponent, FilterBarComponent, ScrollToTopComponent,
    MenuItemComponent, DeleteConfirmModalComponent
  ]
})
export class DiagnosticosPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;

  // Scroll y Lazy Loading 
  showScrollButton = false;
  private scrollThreshold = 300;
  private itemsPorCarga = 10;
  private indiceActual = 0;
  private lastScrollTop = 0;
  private buffer = 200;
  diagnosticosVisibles: Diagnostico[] = [];

  // Datos y filtros 
  diagnosticos: Diagnostico[] = [];
  diagnosticosFiltrados: Diagnostico[] = [];
  ordenSeleccionado: OrdenDiagnostico = 'recientes';
  periodoSeleccionado: PeriodoDiagnostico = 'todos';
  periodoSeleccionadoTexto = 'Todos';
  modalPeriodoAbierto = false;
  modalOrdenAbierto = false;

  // Contadores 
  contadores = {
    totalDiagnosticos: 0,
    diagnosticosCriticos: 0
  };

  // Modal agregar/editar 
  modalAbierto = false;
  modoEdicion = false;
  diagnosticoEditandoId: string | null = null;
  fechaFormateada = '';
  fechaMaxima = new Date().toISOString();
  nuevoDiag: Partial<Diagnostico> = {
    enfermedad: '',
    severidad: 'leve',
    fase: 'inicial',
    medico: '',
    fechaDiagnostico: ''
  };

  // Modal eliminar 
  modalEliminarAbierto = false;
  diagnosticoAEliminar: Diagnostico | null = null;

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    this.inicializarDatosDePrueba();
    this.aplicarFiltroPeriodo();
    this.actualizarContadores();
    this.cargarPrimerosDiagnosticos();
  }

  // Editar diagnostico
  editarDiagnostico(diagnostico: Diagnostico) {
    this.modoEdicion = true;
    this.diagnosticoEditandoId = diagnostico.id;
    this.nuevoDiag = {
      enfermedad: diagnostico.enfermedad,
      severidad: diagnostico.severidad,
      fase: diagnostico.fase,
      medico: diagnostico.medico,
      fechaDiagnostico: diagnostico.fechaDiagnostico
    };
    
    const fechaObj = new Date(diagnostico.fechaDiagnostico);
    this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    this.modalAbierto = true;
  }

  // Confirmar eliminacion
  confirmarEliminar(diagnostico: Diagnostico) {
    this.diagnosticoAEliminar = diagnostico;
    this.modalEliminarAbierto = true;
  }

  cerrarModalEliminar() {
    this.modalEliminarAbierto = false;
    this.diagnosticoAEliminar = null;
  }

  // Eliminar diagnostico
  async eliminarDiagnostico() {
    if (!this.diagnosticoAEliminar) return;

    const id = this.diagnosticoAEliminar.id;
    this.diagnosticos = this.diagnosticos.filter(d => d.id !== id);
    
    this.aplicarFiltroPeriodo();
    this.cerrarModalEliminar();
    
    await this.mostrarToast('Diagnóstico eliminado exitosamente', 'success');
  }

  // Lazy Loading 
  cargarPrimerosDiagnosticos() {
    this.indiceActual = 0;
    this.diagnosticosVisibles = [];
    this.cargarMasDiagnosticos();
  }

  cargarMasDiagnosticos() {
    const inicio = this.indiceActual;
    const fin = Math.min(inicio + this.itemsPorCarga, this.diagnosticosFiltrados.length);
    if (inicio >= fin) return;

    const nuevos = this.diagnosticosFiltrados.slice(inicio, fin);
    this.diagnosticosVisibles = [...this.diagnosticosVisibles, ...nuevos];
    this.indiceActual = fin;
  }

  onIonInfinite(event: any) {
    setTimeout(() => {
      this.cargarMasDiagnosticos();
      event.target.complete();
      if (this.indiceActual >= this.diagnosticosFiltrados.length) {
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
      if (nearBottom && !this.infiniteScroll?.disabled && this.indiceActual < this.diagnosticosFiltrados.length) {
        
      }
    } else if (nearTop && this.indiceActual > this.itemsPorCarga) {
      const nuevoInicio = Math.max(0, this.indiceActual - 2 * this.itemsPorCarga);
      this.diagnosticosVisibles = this.diagnosticosFiltrados.slice(nuevoInicio, nuevoInicio + this.itemsPorCarga);
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

  seleccionarPeriodo(periodo: PeriodoDiagnostico) {
    this.periodoSeleccionado = periodo;
    const textos: Record<PeriodoDiagnostico, string> = {
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

  seleccionarOrden(orden: OrdenDiagnostico) {
    this.ordenSeleccionado = orden;
    this.aplicarOrden();
    this.cerrarSelectorOrden();
    this.cargarPrimerosDiagnosticos();
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
      this.diagnosticosFiltrados = [...this.diagnosticos];
    } else {
      this.diagnosticosFiltrados = this.diagnosticos.filter(diagnostico => {
        const fecha = this.parsearFecha(diagnostico.fechaDiagnostico);
        return fecha >= fechaLimite!;
      });
    }

    this.aplicarOrden();
    this.actualizarContadores();
    this.cargarPrimerosDiagnosticos();
    this.resetInfiniteScroll();
  }

  getOrdenLabel(): string {
    const labels: Record<OrdenDiagnostico, string> = {
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
        this.diagnosticosFiltrados.sort((a, b) => 
          this.parsearFecha(b.fechaDiagnostico).getTime() - this.parsearFecha(a.fechaDiagnostico).getTime()
        );
        break;
      case 'antiguas':
        this.diagnosticosFiltrados.sort((a, b) => 
          this.parsearFecha(a.fechaDiagnostico).getTime() - this.parsearFecha(b.fechaDiagnostico).getTime()
        );
        break;
      case 'alfabetico-asc':
        this.diagnosticosFiltrados.sort(
          (a, b) => a.enfermedad.localeCompare(b.enfermedad, 'es', { sensitivity: 'base' })
        );
        break;
      case 'alfabetico-desc':
        this.diagnosticosFiltrados.sort(
          (a, b) => b.enfermedad.localeCompare(a.enfermedad, 'es', { sensitivity: 'base' })
        );
        break;
    }
  }

  parsearFecha(fecha: string): Date {
    // Si la fecha ya esta en formato ISO (YYYY-MM-DD)
    if (fecha.includes('-') && fecha.length === 10) {
      const [anio, mes, dia] = fecha.split('-').map(n => parseInt(n));
      return new Date(anio, mes - 1, dia);
    }
    
    // Si la fecha esta en formato texto (ej: "24 de enero de 2023")
    const meses: Record<string, number> = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
      'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
      'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    };
    
    const partes = fecha.toLowerCase().split(' ');
    if (partes.length >= 4) {
      const dia = parseInt(partes[0]);
      const mes = meses[partes[2]];
      const anio = parseInt(partes[4]);
      return new Date(anio, mes, dia);
    }
    
    return new Date(fecha);
  }

  actualizarContadores() {
    this.contadores.totalDiagnosticos = this.diagnosticos.length;
    this.contadores.diagnosticosCriticos = this.diagnosticos.filter(d => d.severidad === 'critico').length;
  }

  // Modal agregar/editar 
  abrirModal() { 
    this.modoEdicion = false;
    this.diagnosticoEditandoId = null;
    this.modalAbierto = true; 
  }
  
  cerrarModal() { 
    this.modalAbierto = false;
    this.modoEdicion = false;
    this.diagnosticoEditandoId = null;
    this.limpiarFormulario(); 
  }

  limpiarFormulario() {
    this.nuevoDiag = { 
      enfermedad: '', 
      severidad: 'leve', 
      fase: 'inicial', 
      medico: '', 
      fechaDiagnostico: '' 
    };
    this.fechaFormateada = '';
  }

  onFechaChange(event: any) {
    if (event?.detail?.value) {
      this.nuevoDiag.fechaDiagnostico = event.detail.value;
      const fechaObj = new Date(event.detail.value);
      this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  }

  esFormularioValido(): boolean {
    return !!(this.nuevoDiag.enfermedad?.trim() && this.nuevoDiag.severidad &&
      this.nuevoDiag.fase && this.nuevoDiag.medico?.trim() && this.nuevoDiag.fechaDiagnostico);
  }

  async guardarDiagnostico() {
    if (!this.esFormularioValido()) {
      this.mostrarToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    if (this.modoEdicion && this.diagnosticoEditandoId) {
      const index = this.diagnosticos.findIndex(d => d.id === this.diagnosticoEditandoId);
      if (index !== -1) {
        this.diagnosticos[index] = {
          ...this.diagnosticos[index],
          enfermedad: this.nuevoDiag.enfermedad!.trim(),
          severidad: this.nuevoDiag.severidad as Diagnostico['severidad'],
          fase: this.nuevoDiag.fase as Diagnostico['fase'],
          medico: this.nuevoDiag.medico!.trim(),
          fechaDiagnostico: this.nuevoDiag.fechaDiagnostico!.split('T')[0]
        };
        
        this.aplicarFiltroPeriodo();
        this.cerrarModal();
        await this.mostrarToast('Diagnóstico actualizado exitosamente', 'success');
      }
    } else {
      const nuevo: Diagnostico = {
        id: Date.now().toString(),
        enfermedad: this.nuevoDiag.enfermedad!.trim(),
        severidad: this.nuevoDiag.severidad as Diagnostico['severidad'],
        fase: this.nuevoDiag.fase as Diagnostico['fase'],
        medico: this.nuevoDiag.medico!.trim(),
        fechaDiagnostico: this.nuevoDiag.fechaDiagnostico!.split('T')[0],
        expanded: false
      };

      this.diagnosticos.unshift(nuevo);
      this.aplicarFiltroPeriodo();
      this.cerrarModal();
      await this.mostrarToast('Diagnóstico registrado exitosamente', 'success');
    }
  }

  // Helpers 
  toggleDiagnostico(d: Diagnostico) { d.expanded = !d.expanded; }
  
  getDiagnosticoSeverityClass(d: Diagnostico): string {
    return `severity-${d.severidad}`;
  }

  getBadgeClass(d: Diagnostico): string {
    return `badge-${d.severidad}`;
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

  formatFecha(f: string): string {
    // Si ya esta formateado (texto largo), devolverlo
    if (f.includes('de')) return f;
    
    // Si es formato ISO, convertirlo
    const fecha = this.parsearFecha(f);
    return fecha.toLocaleDateString('es-ES', { 
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
    this.diagnosticos = [
      { id: '1', enfermedad: 'Hipertensión Arterial', severidad: 'moderado', fase: 'estable', fechaDiagnostico: '2023-01-24', medico: 'Dr. Carlos Mendoza', expanded: false },
      { id: '2', enfermedad: 'Diabetes Tipo 2', severidad: 'severo', fase: 'progreso', fechaDiagnostico: '2022-03-15', medico: 'Dra. Ana Vargas', expanded: false },
      { id: '3', enfermedad: 'Gastritis Crónica', severidad: 'leve', fase: 'remision', fechaDiagnostico: '2024-11-10', medico: 'Dr. Luis Prado', expanded: false },
      { id: '4', enfermedad: 'Arritmia Cardíaca', severidad: 'critico', fase: 'inicial', fechaDiagnostico: '2021-02-05', medico: 'Dr. Pedro Ramírez', expanded: false },
      { id: '5', enfermedad: 'Asma Bronquial', severidad: 'moderado', fase: 'estable', fechaDiagnostico: '2024-05-18', medico: 'Dra. Sofia López', expanded: false },
      { id: '6', enfermedad: 'Insuficiencia Renal', severidad: 'critico', fase: 'progreso', fechaDiagnostico: '2023-09-22', medico: 'Dr. Miguel Torres', expanded: false },
      { id: '7', enfermedad: 'Migraña Crónica', severidad: 'leve', fase: 'remision', fechaDiagnostico: '2024-07-30', medico: 'Dra. Patricia Ruiz', expanded: false },
      { id: '8', enfermedad: 'Artritis Reumatoide', severidad: 'severo', fase: 'progreso', fechaDiagnostico: '2022-12-11', medico: 'Dr. Roberto Díaz', expanded: false },
      { id: '9', enfermedad: 'Hipotiroidismo', severidad: 'leve', fase: 'estable', fechaDiagnostico: '2024-03-25', medico: 'Dra. Carmen Vega', expanded: false },
      { id: '10', enfermedad: 'Fibromialgia', severidad: 'moderado', fase: 'inicial', fechaDiagnostico: '2024-09-14', medico: 'Dr. Alberto Sánchez', expanded: false }
    ];
  }
}