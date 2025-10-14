import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonGrid, IonRow, IonCol, IonButton, IonIcon, IonList, IonItem, IonLabel, 
  IonFab, IonFabButton, IonModal, IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular/standalone';
import { ExamenesService, Examen } from '../core/servicios/examen.service'; 

interface ResultadoExamen {
  nombre: string;
  valor: string;
  unidad: string;
  rangoReferencia?: string;
  estado: 'normal' | 'alto' | 'bajo' | 'critico';
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
    IonFab, IonFabButton, IonModal, IonInfiniteScroll, IonInfiniteScrollContent
  ]
})
export class ExamenesPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;

  // --- Modal de subir examen ---
  isModalOpen = false;
  selectedFile: File | null = null;

  // --- Filtros y ordenamiento ---
  ordenSeleccionado: TipoOrden = 'recientes';
  modalOrdenAbierto = false;

  // --- Filtro de periodo ---
  modalPeriodoAbierto = false;
  periodoSeleccionado: TipoPeriodo = 'todos';
  periodoSeleccionadoTexto = 'Todos';
  fechaMaxima: string = new Date().toISOString();

  // --- Contadores ---
  contadores: Contadores = { laboratorio: 0, imagenologia: 0 };

  // --- Scroll ---
  showScrollButton = false;
  private scrollThreshold = 300;

  // --- Variables para lazy loading ---
  private itemsPorCarga = 10; 
  private indiceActual = 0; 

  examenes: Examen[] = [];
  examenesFiltrados: Examen[] = [];
  examenesVisibles: Examen[] = []; 
  totalExamenesTexto: string = '';

  constructor(
    private toastController: ToastController,
    private examenesService: ExamenesService
  ) {}

  ngOnInit() {
    this.cargarExamenes();
  }

  cargarExamenes() {
    this.examenesService.listar().subscribe({
      next: (data) => {
        this.examenes = data;
        this.examenesFiltrados = [...this.examenes];
        this.calcularContadores();
        this.aplicarOrden();
        this.actualizarTotalExamenesTexto();
        this.cargarPrimerosExamenes(); 
      },
      error: (err) => {
        console.error('Error al cargar exámenes:', err);
      }
    });
  }

  cargarPrimerosExamenes() {
    this.indiceActual = 0;
    this.examenesVisibles = [];
    this.cargarMasExamenes();
  }

  cargarMasExamenes() {
    const inicio = this.indiceActual;
    const fin = Math.min(inicio + this.itemsPorCarga, this.examenesFiltrados.length);
    
    const nuevosExamenes = this.examenesFiltrados.slice(inicio, fin);
    this.examenesVisibles = [...this.examenesVisibles, ...nuevosExamenes];
    
    this.indiceActual = fin;
  }

  onIonInfinite(event: any) {
    setTimeout(() => {
      this.cargarMasExamenes();
      event.target.complete();
      
      if (this.indiceActual >= this.examenesFiltrados.length) {
        event.target.disabled = true;
      }
    }, 700); 
  }

  resetInfiniteScroll() {
    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }
  }

  // --- Scroll ---
  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    this.showScrollButton = scrollTop > this.scrollThreshold;
  }

  async scrollToTop() {
    await this.content.scrollToTop(500);
  }

  // --- Contadores ---
  calcularContadores(): void {
    this.contadores = {
      laboratorio: this.examenes.filter(e => this.esLaboratorio(e.tipo)).length,
      imagenologia: this.examenes.filter(e => this.esImagenologia(e.tipo)).length
    };
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

  // --- Filtro de periodo ---
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
  }

  aplicarFiltroPeriodo() {
    const ahora = new Date();

    if (this.periodoSeleccionado === 'todos') {
      this.examenesFiltrados = [...this.examenes];
    } else {
      let fechaLimite: Date;
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
          fechaLimite = new Date(0);
      }

      this.examenesFiltrados = this.examenes.filter(examen => {
        const fechaExamen = this.parsearFechaExamen(examen.fecha);
        return fechaExamen >= fechaLimite;
      });
    }

    this.aplicarOrden();
    this.cerrarSelectorPeriodo();
    this.actualizarTotalExamenesTexto();
    this.cargarPrimerosExamenes(); 
    this.resetInfiniteScroll(); 
  }

  parsearFechaExamen(fecha: string): Date {
    const meses: {[key: string]: number} = {
      'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3, 'Mayo': 4, 'Junio': 5,
      'Julio': 6, 'Agosto': 7, 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
    };
    const partes = fecha.split(' ');
    const dia = parseInt(partes[0]);
    const mes = meses[partes[1]];
    const anio = parseInt(partes[2]);
    return new Date(anio, mes, dia);
  }

  // --- Ordenamiento ---
  abrirSelectorOrden() { this.modalOrdenAbierto = true; }
  cerrarSelectorOrden() { this.modalOrdenAbierto = false; }

  seleccionarOrden(orden: TipoOrden) {
    this.ordenSeleccionado = orden;
    this.aplicarOrden();
    this.cerrarSelectorOrden();
    this.cargarPrimerosExamenes(); 
    this.resetInfiniteScroll(); 
  }

  aplicarOrden(): void {
    switch (this.ordenSeleccionado) {
      case 'recientes':
        this.examenesFiltrados.sort((a, b) => this.compararFechas(b.fecha, a.fecha));
        break;
      case 'antiguas':
        this.examenesFiltrados.sort((a, b) => this.compararFechas(a.fecha, b.fecha));
        break;
      case 'alfabetico-asc':
        this.examenesFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
        break;
      case 'alfabetico-desc':
        this.examenesFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es', { sensitivity: 'base' }));
        break;
    }
    this.actualizarTotalExamenesTexto();
  }

  compararFechas(fecha1: string, fecha2: string): number {
    const date1 = this.parsearFechaExamen(fecha1);
    const date2 = this.parsearFechaExamen(fecha2);
    return date1.getTime() - date2.getTime();
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

  actualizarTotalExamenesTexto() {
    const cantidad = this.examenesFiltrados.length;
    this.totalExamenesTexto =
      cantidad === 0
        ? 'No hay exámenes para este período'
        : cantidad === 1
        ? '1 examen disponible'
        : `${cantidad} exámenes disponibles`;
  }

  // --- Examenes ---
  toggleExamen(examen: Examen) { examen.expanded = !examen.expanded; }

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

  // --- Modal Subir Examen ---
  abrirModal() { this.isModalOpen = true; }

  cerrarModal() {
    this.isModalOpen = false;
    this.selectedFile = null;
    if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
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
        this.cerrarModal();
      } catch (error) {
        console.error('Error al subir examen:', error);
      }
    }
  }
}