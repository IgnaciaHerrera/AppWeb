import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonGrid, IonRow, IonCol, IonButton, IonIcon, IonList, IonItem, IonLabel, 
  IonFab, IonFabButton, IonFabList, IonModal, IonInfiniteScroll, 
  IonInfiniteScrollContent, IonInput, IonFooter, IonDatetime, IonPopover,
  ToastController
} from '@ionic/angular/standalone';
import { FilterBarComponent } from '../components/filter-bar/filter-bar.component';
import { ScrollToTopComponent } from '../components/scroll-to-top/scroll-to-top.component';
import { CounterCardComponent } from '../components/counter-card/counter-card.component';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import { DeleteConfirmModalComponent } from '../components/delete-confirm-modal/delete-confirm-modal.component';

interface ResultadoExamen {
  nombre: string;
  valor: string;
  unidad: string;
  rangoReferencia?: string;
  estado: 'normal' | 'alto' | 'bajo' | 'critico';
}

interface Examen {
  id: string;
  nombre: string;
  tipo: string;
  fecha: string; 
  resultados?: ResultadoExamen[];
  expanded: boolean;
}

interface Contadores {
  laboratorio: number;
  imagenologia: number;
}

type TipoOrden = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';
type TipoPeriodo = 'todos' | 'ultimo-mes' | 'ultimos-3-meses' | 'ultimos-6-meses' | 'este-anio';

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.page.html',
  styleUrls: ['./examenes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonGrid, IonRow, IonCol, IonButton, IonIcon, IonList, IonItem, IonLabel,
    IonFab, IonFabButton, IonFabList, IonModal, IonInfiniteScroll, 
    IonInfiniteScrollContent, IonInput, IonFooter, IonDatetime, IonPopover,
    FilterBarComponent, ScrollToTopComponent, CounterCardComponent,
    MenuItemComponent, DeleteConfirmModalComponent
  ]
})
export class ExamenesPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;

  // Scroll y Lazy Loading 
  showScrollButton = false;
  private scrollThreshold = 300;
  private itemsPorCarga = 10;
  private indiceActual = 0;
  private lastScrollTop = 0;
  private buffer = 200;

  // Datos y filtros 
  examenes: Examen[] = [];
  examenesFiltrados: Examen[] = [];
  examenesVisibles: Examen[] = [];
  ordenSeleccionado: TipoOrden = 'recientes';
  periodoSeleccionado: TipoPeriodo = 'todos';
  periodoSeleccionadoTexto = 'Todos';
  modalPeriodoAbierto = false;
  modalOrdenAbierto = false;

  // Contadores 
  contadores: Contadores = { laboratorio: 0, imagenologia: 0 };
  totalExamenesTexto: string = '';

  // Modal agregar manualmente 
  modalManualAbierto = false;
  modoEdicion = false;
  examenEditandoId: string | null = null;
  fechaFormateada = '';
  nuevoExamen: Partial<Examen> & { fechaISO?: string } = {
    nombre: '',
    tipo: '',
    fecha: '',
    fechaISO: '',
    resultados: []
  };

  // Modal subir archivo 
  modalSubirAbierto = false;
  selectedFile: File | null = null;

  //  Modal eliminar 
  modalEliminarAbierto = false;
  examenAEliminar: Examen | null = null;

  // FAB Menu 
  fabMenuActivado = false;

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    this.inicializarDatosDePrueba();
    this.aplicarFiltroPeriodo();
    this.calcularContadores();
    this.cargarPrimerosExamenes();
  }

  // Gestionar resultados del examen
  agregarResultado() {
    if (!this.nuevoExamen.resultados) {
      this.nuevoExamen.resultados = [];
    }
    
    this.nuevoExamen.resultados.push({
      nombre: '',
      valor: '',
      unidad: '',
      rangoReferencia: '',
      estado: 'normal'
    });
  }

  eliminarResultado(index: number) {
    if (this.nuevoExamen.resultados) {
      this.nuevoExamen.resultados.splice(index, 1);
    }
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      'normal': 'Normal',
      'alto': 'Alto',
      'bajo': 'Bajo',
      'critico': 'Crítico'
    };
    return labels[estado] || 'Seleccionar';
  }

  // Editar examen
  editarExamen(examen: Examen) {
    this.modoEdicion = true;
    this.examenEditandoId = examen.id;
    
    const fechaObj = new Date(examen.fecha);
    const fechaISO = fechaObj.toISOString();
    
    this.nuevoExamen = {
      nombre: examen.nombre,
      tipo: examen.tipo,
      fecha: examen.fecha,
      fechaISO: fechaISO,
      resultados: examen.resultados ? JSON.parse(JSON.stringify(examen.resultados)) : []
    };
    
    this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    this.modalManualAbierto = true;
  }

  // Confirmar eliminacion
  confirmarEliminar(examen: Examen) {
    this.examenAEliminar = examen;
    this.modalEliminarAbierto = true;
  }

  cerrarModalEliminar() {
    this.modalEliminarAbierto = false;
    this.examenAEliminar = null;
  }

  // Eliminar examen
  async eliminarExamen() {
    if (!this.examenAEliminar) return;

    const id = this.examenAEliminar.id;
    this.examenes = this.examenes.filter(e => e.id !== id);
    
    this.aplicarFiltroPeriodo();
    this.calcularContadores();
    this.cerrarModalEliminar();
    
    await this.mostrarToast('Examen eliminado exitosamente', 'success');
  }

  // Lazy Loading 
  cargarPrimerosExamenes() {
    this.indiceActual = 0;
    this.examenesVisibles = [];
    this.cargarMasExamenes();
  }

  cargarMasExamenes() {
    const inicio = this.indiceActual;
    const fin = Math.min(inicio + this.itemsPorCarga, this.examenesFiltrados.length);
    if (inicio >= fin) return;

    const nuevos = this.examenesFiltrados.slice(inicio, fin);
    this.examenesVisibles = [...this.examenesVisibles, ...nuevos];
    this.indiceActual = fin;
  }

  onIonInfinite(event: any) {
    setTimeout(() => {
      this.cargarMasExamenes();
      event.target.complete();
      if (this.indiceActual >= this.examenesFiltrados.length) {
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
      if (nearBottom && !this.infiniteScroll?.disabled && this.indiceActual < this.examenesFiltrados.length) {
        
      }
    } else if (nearTop && this.indiceActual > this.itemsPorCarga) {
      const nuevoInicio = Math.max(0, this.indiceActual - 2 * this.itemsPorCarga);
      this.examenesVisibles = this.examenesFiltrados.slice(nuevoInicio, nuevoInicio + this.itemsPorCarga);
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

  seleccionarOrden(orden: TipoOrden) {
    this.ordenSeleccionado = orden;
    this.aplicarOrden();
    this.cerrarSelectorOrden();
    this.cargarPrimerosExamenes();
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
      this.examenesFiltrados = [...this.examenes];
    } else {
      this.examenesFiltrados = this.examenes.filter(examen => {
        const fecha = this.parsearFecha(examen.fecha);
        return fecha >= fechaLimite!;
      });
    }

    this.aplicarOrden();
    this.actualizarTotalExamenesTexto();
    this.cargarPrimerosExamenes();
    this.resetInfiniteScroll();
  }

  getOrdenLabel(): string {
    const labels: Record<TipoOrden, string> = {
      'recientes': 'Más recientes',
      'antiguas': 'Más antiguos',
      'alfabetico-asc': 'A-Z',
      'alfabetico-desc': 'Z-A'
    };
    return labels[this.ordenSeleccionado];
  }

  aplicarOrden(): void {
    switch (this.ordenSeleccionado) {
      case 'recientes':
        this.examenesFiltrados.sort((a, b) => 
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        break;
      case 'antiguas':
        this.examenesFiltrados.sort((a, b) => 
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
        break;
      case 'alfabetico-asc':
        this.examenesFiltrados.sort(
          (a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        );
        break;
      case 'alfabetico-desc':
        this.examenesFiltrados.sort(
          (a, b) => b.nombre.localeCompare(a.nombre, 'es', { sensitivity: 'base' })
        );
        break;
    }
  }

  // Parsear fecha en formato YYYY-MM-DD 
  parsearFecha(fecha: string): Date {
    const [anio, mes, dia] = fecha.split('-').map(n => parseInt(n));
    return new Date(anio, mes - 1, dia);
  }

  calcularContadores(): void {
    this.contadores = {
      laboratorio: this.examenes.filter(e => this.esLaboratorio(e.tipo)).length,
      imagenologia: this.examenes.filter(e => this.esImagenologia(e.tipo)).length
    };
  }

  actualizarTotalExamenesTexto() {
    const cantidad = this.examenesFiltrados.length;
    this.totalExamenesTexto =
      cantidad === 0
        ? 'No hay exámenes para este período'
        : cantidad === 1
        ? '1 examen disponible'
        : `${cantidad} exámenes disponibles`;
  }

  // FAB Menu Control 
  onFabOpen() {
    this.fabMenuActivado = true;
  }

  onFabClose() {
    this.fabMenuActivado = false;
  }

  cerrarFabMenu() {
    this.fabMenuActivado = false;
    const fabElement = document.querySelector('ion-fab') as any;
    if (fabElement && fabElement.activated) {
      fabElement.close();
    }
  }

  // Modal agregar/editar 
  abrirModalManual() { 
    this.modoEdicion = false;
    this.examenEditandoId = null;
    this.modalManualAbierto = true;
    this.cerrarFabMenu();
  }
  
  cerrarModalManual() { 
    this.modalManualAbierto = false; 
    this.modoEdicion = false;
    this.examenEditandoId = null;
    this.limpiarFormulario();
    this.cerrarFabMenu(); // ⭐ LÍNEA AGREGADA
  }

  limpiarFormulario() {
    this.nuevoExamen = { 
      nombre: '', 
      tipo: '', 
      fecha: '',
      fechaISO: '',
      resultados: []
    };
    this.fechaFormateada = '';
  }

  seleccionarTipo(tipo: string) {
    this.nuevoExamen.tipo = tipo;
  }

  onFechaChange(event: any) {
    if (event?.detail?.value) {
      this.nuevoExamen.fechaISO = event.detail.value;
      this.nuevoExamen.fecha = event.detail.value;
      const fechaObj = new Date(event.detail.value);
      this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  }

  esFormularioValido(): boolean {
    return !!(this.nuevoExamen.nombre?.trim() && this.nuevoExamen.tipo?.trim() && this.nuevoExamen.fecha);
  }

  async guardarExamen() {
    if (!this.esFormularioValido()) {
      this.mostrarToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    // Filtrar resultados vacios
    const resultadosValidos = this.nuevoExamen.resultados?.filter(r => 
      r.nombre.trim() !== '' || r.valor.trim() !== ''
    ) || [];

    if (this.modoEdicion && this.examenEditandoId) {
      const index = this.examenes.findIndex(e => e.id === this.examenEditandoId);
      if (index !== -1) {
        this.examenes[index] = {
          ...this.examenes[index],
          nombre: this.nuevoExamen.nombre!.trim(),
          tipo: this.nuevoExamen.tipo!.trim(),
          fecha: this.nuevoExamen.fecha!.split('T')[0],
          resultados: resultadosValidos.length > 0 ? resultadosValidos : undefined
        };
        
        this.aplicarFiltroPeriodo();
        this.cerrarModalManual();
        await this.mostrarToast('Examen actualizado exitosamente', 'success');
      }
    } else {
      const nuevo: Examen = {
        id: Date.now().toString(),
        nombre: this.nuevoExamen.nombre!.trim(),
        tipo: this.nuevoExamen.tipo!.trim(),
        fecha: this.nuevoExamen.fecha!.split('T')[0],
        resultados: resultadosValidos.length > 0 ? resultadosValidos : undefined,
        expanded: false
      };

      this.examenes.unshift(nuevo);
      this.aplicarFiltroPeriodo();
      this.calcularContadores();
      this.cerrarModalManual();
      await this.mostrarToast('Examen registrado exitosamente', 'success');
    }
  }

  // Modal subir archivo
  abrirModalSubir() { 
    this.modalSubirAbierto = true;
    this.cerrarFabMenu(); 
  }

  cerrarModalSubir() {
    this.modalSubirAbierto = false;
    this.selectedFile = null;
    if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
    this.cerrarFabMenu(); // ⭐ LÍNEA AGREGADA
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeFile(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedFile = null;
    if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
  }

  validateFile(file: File): boolean {
    if (file.type !== 'application/pdf') return false;
    const maxSize = 10 * 1024 * 1024;
    return file.size <= maxSize;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.validateFile(file)) this.selectedFile = file;
      else input.value = '';
    }
  }

  async subirExamen() {
    if (this.selectedFile) {
      try {
        console.log('Subiendo examen:', this.selectedFile.name);
        await this.mostrarToast('Examen subido exitosamente', 'success');
        this.cerrarModalSubir();
      } catch (error) {
        console.error('Error al subir examen:', error);
        await this.mostrarToast('Error al subir el examen', 'danger');
      }
    }
  }

  // Helpers 
  toggleExamen(e: Examen) { e.expanded = !e.expanded; }
  getExamenTypeClass(examen: Examen): string { return `tipo-${this.getTipoClass(examen.tipo)}`; }

  getTipoClass(tipo: string): string {
    if (this.esLaboratorio(tipo)) return 'laboratorio';
    if (this.esImagenologia(tipo)) return 'imagen';
    return 'laboratorio';
  }

  getTipoIcon(tipo: string): string {
    if (this.esLaboratorio(tipo)) return 'flask-outline';
    if (this.esImagenologia(tipo)) return 'scan-outline';
    return 'document-text-outline';
  }

  esLaboratorio(tipo: string): boolean {
    return tipo.toLowerCase().includes('laboratorio') || tipo.toLowerCase().includes('sangre');
  }

  esImagenologia(tipo: string): boolean {
    return tipo.toLowerCase().includes('imagen') ||
           tipo.toLowerCase().includes('radiografía') ||
           tipo.toLowerCase().includes('ecografía') ||
           tipo.toLowerCase().includes('tomografía') ||
           tipo.toLowerCase().includes('resonancia');
  }

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
    this.examenes = [
      {
        id: '1',
        nombre: 'Hemograma Completo',
        tipo: 'Laboratorio',
        fecha: '2025-10-15',
        resultados: [
          { nombre: 'Hemoglobina', valor: '14.2', unidad: 'g/dL', rangoReferencia: '13.5 - 17.5', estado: 'normal' }
        ],
        expanded: false
      },
      {
        id: '2',
        nombre: 'Perfil Lipídico',
        tipo: 'Laboratorio',
        fecha: '2025-10-02',
        resultados: [
          { nombre: 'Colesterol Total', valor: '220', unidad: 'mg/dL', rangoReferencia: '< 200', estado: 'alto' },
          { nombre: 'HDL', valor: '45', unidad: 'mg/dL', rangoReferencia: '> 40', estado: 'normal' },
          { nombre: 'LDL', valor: '150', unidad: 'mg/dL', rangoReferencia: '< 130', estado: 'alto' },
          { nombre: 'Triglicéridos', valor: '180', unidad: 'mg/dL', rangoReferencia: '< 150', estado: 'alto' }
        ],
        expanded: false
      },
      {
        id: '3',
        nombre: 'Radiografía de Tórax',
        tipo: 'Imagenología',
        fecha: '2025-09-28',
        expanded: false
      },
      {
        id: '4',
        nombre: 'Glicemia en Ayunas',
        tipo: 'Laboratorio',
        fecha: '2025-09-20',
        resultados: [
          { nombre: 'Glucosa', valor: '105', unidad: 'mg/dL', rangoReferencia: '70 - 100', estado: 'alto' }
        ],
        expanded: false
      },
      {
        id: '5',
        nombre: 'Ecografía Abdominal',
        tipo: 'Imagenología',
        fecha: '2025-09-12',
        expanded: false
      },
      {
        id: '6',
        nombre: 'Perfil Tiroideo',
        tipo: 'Laboratorio',
        fecha: '2025-08-05',
        resultados: [
          { nombre: 'TSH', valor: '2.5', unidad: 'mU/L', rangoReferencia: '0.4 - 4.0', estado: 'normal' },
          { nombre: 'T4 Libre', valor: '1.2', unidad: 'ng/dL', rangoReferencia: '0.8 - 1.8', estado: 'normal' }
        ],
        expanded: false
      },
      {
        id: '7',
        nombre: 'Tomografía de Abdomen',
        tipo: 'Imagenología',
        fecha: '2025-07-22',
        expanded: false
      },
      {
        id: '8',
        nombre: 'Orina Completa',
        tipo: 'Laboratorio',
        fecha: '2025-07-10',
        resultados: [
          { nombre: 'pH', valor: '6.0', unidad: '', rangoReferencia: '5.0 - 7.0', estado: 'normal' },
          { nombre: 'Densidad', valor: '1.020', unidad: '', rangoReferencia: '1.010 - 1.025', estado: 'normal' }
        ],
        expanded: false
      },
      {
        id: '9',
        nombre: 'Resonancia Magnética de Rodilla',
        tipo: 'Imagenología',
        fecha: '2025-06-25',
        expanded: false
      },
      {
        id: '10',
        nombre: 'Pruebas Hepáticas',
        tipo: 'Laboratorio',
        fecha: '2025-06-15',
        resultados: [
          { nombre: 'ALT', valor: '25', unidad: 'U/L', rangoReferencia: '7 - 56', estado: 'normal' },
          { nombre: 'AST', valor: '22', unidad: 'U/L', rangoReferencia: '10 - 40', estado: 'normal' },
          { nombre: 'Bilirrubina Total', valor: '0.8', unidad: 'mg/dL', rangoReferencia: '0.3 - 1.2', estado: 'normal' }
        ],
        expanded: false
      },
      {
        id: '11',
        nombre: 'Electrocardiograma',
        tipo: 'Imagenología',
        fecha: '2025-05-08',
        expanded: false
      },
      {
        id: '12',
        nombre: 'Hemoglobina Glicosilada',
        tipo: 'Laboratorio',
        fecha: '2025-05-01',
        resultados: [
          { nombre: 'HbA1c', valor: '6.2', unidad: '%', rangoReferencia: '< 5.7', estado: 'alto' }
        ],
        expanded: false
      }
    ];
  }
}