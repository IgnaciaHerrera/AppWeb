import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController } from '@ionic/angular/standalone';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonGrid, IonRow, IonCol, IonButton, IonIcon, IonList, IonItem, IonLabel, 
  IonFab, IonFabButton, IonModal, IonSelect, IonSelectOption
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

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.page.html',
  styleUrls: ['./examenes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonGrid, IonRow, IonCol, IonButton, IonIcon, IonList, IonItem, IonLabel,
    IonFab, IonFabButton, IonModal, IonSelect, IonSelectOption
  ]
})
export class ExamenesPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  isModalOpen = false;
  selectedFile: File | null = null;
  ordenSeleccionado: TipoOrden = 'recientes';
  contadores: Contadores = { laboratorio: 0, imagenologia: 0 };
  
  examenes: Examen[] = [
    {
      id: '1',
      nombre: 'Hemograma Completo',
      tipo: 'Examen de Laboratorio',
      fecha: '20 Jul 2025',
      medico: 'Dr. Carlos Mendoza',
      expanded: false,
      resultados: [
        {
          nombre: 'Hemoglobina',
          valor: '14.2',
          unidad: 'g/dL',
          rangoReferencia: '12.0-15.5 g/dL',
          estado: 'normal'
        },
        {
          nombre: 'Glóbulos Blancos',
          valor: '7,200',
          unidad: '/μL',
          rangoReferencia: '4,000-11,000 /μL',
          estado: 'normal'
        },
        {
          nombre: 'Plaquetas',
          valor: '250,000',
          unidad: '/μL',
          rangoReferencia: '150,000-450,000 /μL',
          estado: 'normal'
        },
        {
          nombre: 'Hematocrito',
          valor: '42.5',
          unidad: '%',
          rangoReferencia: '36.0-46.0 %',
          estado: 'normal'
        }
      ]
    },
    {
      id: '2',
      nombre: 'Radiografía de Tórax',
      tipo: 'Imagenología',
      fecha: '10 Ago 2025',
      medico: 'Dr. Ana Vargas',
      expanded: false,
      resultados: [
        {
          nombre: 'Campos Pulmonares',
          valor: 'Normal',
          unidad: '',
          estado: 'normal',
          observaciones: 'Sin alteraciones patológicas evidentes'
        },
        {
          nombre: 'Silueta Cardíaca',
          valor: 'Normal',
          unidad: '',
          estado: 'normal'
        }
      ]
    },
    {
      id: '3',
      nombre: 'Glicemia',
      tipo: 'Examen de Laboratorio',
      fecha: '05 Ago 2025',
      medico: 'Dr. Luis Prado',
      expanded: false,
      resultados: [
        {
          nombre: 'Glucosa en Ayunas',
          valor: '95',
          unidad: 'mg/dL',
          rangoReferencia: '70-100 mg/dL',
          estado: 'normal'
        }
      ]
    },
    {
      id: '4',
      nombre: 'Ecografía Abdominal',
      tipo: 'Imagenología',
      fecha: '28 Jul 2025',
      medico: 'Dr. Patricia Silva',
      expanded: false,
      resultados: [
        {
          nombre: 'Hígado',
          valor: 'Normal',
          unidad: '',
          estado: 'normal',
          observaciones: 'Tamaño y ecogenicidad normales'
        },
        {
          nombre: 'Vesícula Biliar',
          valor: 'Normal',
          unidad: '',
          estado: 'normal'
        },
        {
          nombre: 'Riñones',
          valor: 'Normal',
          unidad: '',
          estado: 'normal'
        }
      ]
    },
    {
      id: '5',
      nombre: 'Perfil Lipídico',
      tipo: 'Examen de Laboratorio',
      fecha: '15 Jun 2025',
      medico: 'Dr. María González',
      expanded: false,
      resultados: [
        {
          nombre: 'Colesterol Total',
          valor: '180',
          unidad: 'mg/dL',
          rangoReferencia: '<200 mg/dL',
          estado: 'normal'
        },
        {
          nombre: 'HDL',
          valor: '55',
          unidad: 'mg/dL',
          rangoReferencia: '>40 mg/dL',
          estado: 'normal'
        }
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
        {
          nombre: 'Estructuras Cerebrales',
          valor: 'Normal',
          unidad: '',
          estado: 'normal',
          observaciones: 'Sin evidencia de lesiones'
        }
      ]
    }
  ];

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    this.calcularContadores();
    this.aplicarOrden();
  }

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

  aplicarOrden(): void {
    switch (this.ordenSeleccionado) {
      case 'recientes':
        this.examenes.sort((a, b) => this.compararFechas(b.fecha, a.fecha));
        break;
      case 'antiguas':
        this.examenes.sort((a, b) => this.compararFechas(a.fecha, b.fecha));
        break;
      case 'alfabetico-asc':
        this.examenes.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
        break;
      case 'alfabetico-desc':
        this.examenes.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es', { sensitivity: 'base' }));
        break;
      default:
        this.examenes.sort((a, b) => this.compararFechas(b.fecha, a.fecha));
    }
  }

  compararFechas(fecha1: string, fecha2: string): number {
    // Convertir fechas en formato "DD MMM YYYY" a Date
    const meses: {[key: string]: number} = {
      'Ene': 0, 'Feb': 1, 'Mar': 2, 'Abr': 3, 'Mayo': 4, 'Jun': 5,
      'Jul': 6, 'Ago': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dic': 11
    };
    
    const parsearFecha = (fecha: string): Date => {
      const partes = fecha.split(' ');
      const dia = parseInt(partes[0]);
      const mes = meses[partes[1]];
      const año = parseInt(partes[2]);
      return new Date(año, mes, dia);
    };

    const date1 = parsearFecha(fecha1);
    const date2 = parsearFecha(fecha2);
    
    return date1.getTime() - date2.getTime();
  }

  getOrdenLabel(): string {
    const labels: Record<TipoOrden, string> = {
      'recientes': 'Más recientes',
      'antiguas': 'Más antiguas',
      'alfabetico-asc': 'Alfabético (A-Z)',
      'alfabetico-desc': 'Alfabético (Z-A)'
    };
    
    return labels[this.ordenSeleccionado];
  }

  toggleExamen(examen: Examen): void {
    examen.expanded = !examen.expanded;
  }

  getExamenTypeClass(examen: Examen): string {
    return `tipo-${this.getTipoClass(examen.tipo)}`;
  }

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

  abrirModal(): void {
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.selectedFile = null;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedFile = null;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  validateFile(file: File): boolean {
    if (file.type !== 'application/pdf') {
      this.showToast('Solo se permiten archivos PDF', 'warning');
      return false;
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      this.showToast('El archivo es demasiado grande. Máximo 10MB', 'warning');
      return false;
    }
    
    return true;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.validateFile(file)) {
        this.selectedFile = file;
      } else {
        input.value = '';
      }
    }
  }

  async showToast(message: string, color: string = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  async subirExamen(): Promise<void> {
    if (this.selectedFile) {
      try {
        console.log('Subiendo examen:', this.selectedFile.name);
        await this.showToast('Examen subido exitosamente', 'success');
        this.cerrarModal();
      } catch (error) {
        console.error('Error al subir el examen:', error);
        await this.showToast('Error al subir el examen. Inténtalo de nuevo', 'danger');
      }
    }
  }
}