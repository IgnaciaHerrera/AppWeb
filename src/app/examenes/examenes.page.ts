import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular/standalone';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonGrid, IonRow, IonCol, IonButton, IonIcon, IonList, IonItem, IonLabel, 
  IonFab, IonFabButton, IonModal
} from '@ionic/angular/standalone';

interface ResultadoExamen {
  nombre: string;
  valor: string;
  unidad: string;
  rangoReferencia?: string;
  estado: 'normal' | 'alto' | 'bajo' | 'critico';
  observaciones?: string;
}

interface Examen {
  id: string;
  nombre: string;
  tipo: string;
  fecha: string;
  medico?: string;
  descripcion?: string;
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
    IonFab, IonFabButton, IonModal
  ]
})
export class ExamenesPage implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild(IonContent, { static: false }) content!: IonContent;

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

  // --- Examenes ---
  examenes: Examen[] = [
    {
      id: '1',
      nombre: 'Hemograma Completo',
      tipo: 'Examen de Laboratorio',
      fecha: '20 Julio 2025',
      medico: 'Dr. Carlos Mendoza',
      expanded: false,
      resultados: [
        { nombre: 'Hemoglobina', valor: '14.2', unidad: 'g/dL', rangoReferencia: '12.0-15.5 g/dL', estado: 'normal' },
        { nombre: 'Glóbulos Blancos', valor: '7,200', unidad: '/μL', rangoReferencia: '4,000-11,000 /μL', estado: 'normal' },
        { nombre: 'Hematocrito', valor: '42.5', unidad: '%', rangoReferencia: '36.0-46.0 %', estado: 'normal' }
      ]
    },
    {
      id: '2',
      nombre: 'Radiografía de Tórax',
      tipo: 'Imagenología',
      fecha: '10 Agosto 2025',
      medico: 'Dr. Ana Vargas',
      expanded: false,
      resultados: [
        { nombre: 'Campos Pulmonares', valor: 'Normal', unidad: '', estado: 'normal' },
        { nombre: 'Silueta Cardíaca', valor: 'Normal', unidad: '', estado: 'normal' }
      ]
    },
    {
      id: '3',
      nombre: 'Glicemia',
      tipo: 'Examen de Laboratorio',
      fecha: '05 Agosto 2025',
      medico: 'Dr. Luis Prado',
      expanded: false,
      resultados: [
        { nombre: 'Glucosa en Ayunas', valor: '95', unidad: 'mg/dL', rangoReferencia: '70-100 mg/dL', estado: 'normal' }
      ]
    },
    {
      id: '4',
      nombre: 'Ecografía Abdominal',
      tipo: 'Imagenología',
      fecha: '28 Julio 2025',
      medico: 'Dr. Patricia Silva',
      expanded: false,
      resultados: [
        { nombre: 'Hígado', valor: 'Normal', unidad: '', estado: 'normal' },
        { nombre: 'Vesícula Biliar', valor: 'Normal', unidad: '', estado: 'normal' },
        { nombre: 'Riñones', valor: 'Normal', unidad: '', estado: 'normal' }
      ]
    },
    {
      id: '5',
      nombre: 'Perfil Lipídico',
      tipo: 'Examen de Laboratorio',
      fecha: '15 Junio 2025',
      medico: 'Dr. María González',
      expanded: false,
      resultados: [
        { nombre: 'Colesterol Total', valor: '180', unidad: 'mg/dL', rangoReferencia: '<200 mg/dL', estado: 'normal' },
        { nombre: 'HDL', valor: '55', unidad: 'mg/dL', rangoReferencia: '>40 mg/dL', estado: 'normal' }
      ]
    },
    {
      id: '6',
      nombre: 'Tomografía Cerebral',
      tipo: 'Imagenología',
      fecha: '02 Mayo 2025',
      medico: 'Dr. Roberto Chen',
      expanded: false,
      resultados: [
        { nombre: 'Estructuras Cerebrales', valor: 'Normal', unidad: '', estado: 'normal' }
      ]
    },
    {
    id: '7',
    nombre: 'Examen de Orina Completo',
    tipo: 'Examen de Laboratorio',
    fecha: '18 Diciembre 2024',
    medico: 'Dra. Andrea Pizarro',
    expanded: false,
    resultados: [
      { nombre: 'Proteínas', valor: 'Negativo', unidad: '', estado: 'normal'},
      { nombre: 'Glucosa', valor: 'Negativo', unidad: '', estado: 'normal'},
      { nombre: 'Densidad', valor: '1.020', unidad: '', rangoReferencia: '1.005 - 1.030', estado: 'normal'}
    ]
  },
  {
    id: '8',
    nombre: 'Test de TSH',
    tipo: 'Examen de Laboratorio',
    fecha: '25 Octubre 2024',
    medico: 'Dra. Constanza Ramírez',
    expanded: false,
    resultados: [
      {nombre: 'TSH', valor: '2.1', unidad: 'μUI/mL', rangoReferencia: '0.4 - 4.0 μUI/mL', estado: 'normal'}
    ]
  },
  {
    id: '9',
    nombre: 'Electrocardiograma',
    tipo: 'Imagenología',
    fecha: '08 Septiembre 2024',
    medico: 'Dr. Rodrigo Cifuentes',
    expanded: false,
    resultados: [
      {nombre: 'Ritmo sinusal', valor: 'Normal', unidad: '',estado: 'normal', observaciones: 'Frecuencia cardíaca dentro de rango normal.'}
    ]
  },
  {
    id: '10',
    nombre: 'Ecografía Hepática',
    tipo: 'Imagenología',
    fecha: '04 Julio 2024',
    medico: 'Dr. Pablo Henríquez',
    expanded: false,
    resultados: [
      { nombre: 'Hígado', valor: 'Normal', unidad: '', estado: 'normal', observaciones: 'No se observan alteraciones morfológicas.'}
    ]
  }
  ];

  examenesFiltrados: Examen[] = [];
  totalExamenesTexto: string = '';

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    this.calcularContadores();
    this.examenesFiltrados = [...this.examenes];
    this.aplicarOrden();
    this.actualizarTotalExamenesTexto();
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
