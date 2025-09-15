import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonGrid, IonRow, IonCol, IonButton, IonIcon,
  IonSearchbar, IonModal
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
}

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.page.html',
  styleUrls: ['./examenes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonGrid, IonRow, IonCol, IonButton, IonIcon,
    IonSearchbar, IonModal
  ]
})
export class ExamenesPage implements OnInit {
  terminoBusqueda: string = '';
  mostrarDetalleModal: boolean = false;
  examenSeleccionado: Examen | null = null;

  examenes: Examen[] = [
    {
      id: '2',
      nombre: 'Radiografía de Tórax',
      tipo: 'Imagen Médica',
      fecha: '10 Ago 2025',
      medico: 'Dr. Ana Vargas',
      descripcion: 'Evaluación pulmonar de rutina',
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
      id: '5',
      nombre: 'Glicemia',
      tipo: 'Examen de Laboratorio',
      fecha: '05 Ago 2025',
      medico: 'Dr. Luis Prado',
      descripcion: 'Control de glucosa en sangre',
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
      id: '6',
      nombre: 'Ecografía Abdominal',
      tipo: 'Imagen Médica',
      fecha: '28 Jul 2025',
      medico: 'Dr. Patricia Silva',
      descripcion: 'Evaluación de órganos abdominales',
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
      id: '7',
      nombre: 'Hemograma Completo',
      tipo: 'Examen de Sangre',
      fecha: '20 Jul 2025',
      medico: 'Dr. Carlos Mendoza',
      descripcion: 'Control rutinario solicitado por cardiología',
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
    }
  ];

  examenesFiltrados: Examen[] = [];

  constructor() { }

  ngOnInit() {
    this.examenesFiltrados = [...this.examenes];
  }

  buscarExamenes() {
    this.filtrarExamenes();
  }

  filtrarExamenes() {
    let examenesFiltrados = [...this.examenes];

    // Aplicar búsqueda por texto
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      examenesFiltrados = examenesFiltrados.filter(e =>
        e.nombre.toLowerCase().includes(termino) ||
        e.tipo.toLowerCase().includes(termino) ||
        (e.medico && e.medico.toLowerCase().includes(termino))
      );
    }

    this.examenesFiltrados = examenesFiltrados;
  }

  verDetalleExamen(examen: Examen) {
    this.examenSeleccionado = examen;
    this.mostrarDetalleModal = true;
  }

  cerrarDetalleModal() {
    this.mostrarDetalleModal = false;
    this.examenSeleccionado = null;
  }
}