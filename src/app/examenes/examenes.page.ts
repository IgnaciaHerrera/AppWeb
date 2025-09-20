import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonGrid, IonRow, IonCol, IonButton, IonIcon, IonList, IonItem, IonLabel
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

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.page.html',
  styleUrls: ['./examenes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonGrid, IonRow, IonCol, IonButton, IonIcon, IonList, IonItem, IonLabel
  ]
})
export class ExamenesPage implements OnInit {
  examenes: Examen[] = [
    {
      id: '1',
      nombre: 'Hemograma Completo',
      tipo: 'Examen de Sangre',
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
      tipo: 'Imagen Médica',
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
      tipo: 'Imagen Médica',
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
    }
  ];

  constructor() { }

  ngOnInit() {
    // Conexión con servicios reales
  }

  // Toggle para expandir/contraer exámenes
  toggleExamen(examen: Examen): void {
    examen.expanded = !examen.expanded;
  }

  // Obtener clase CSS según tipo
  getExamenTypeClass(examen: Examen): string {
    return `tipo-${this.getTipoClass(examen.tipo)}`;
  }

  // Clasificar tipo de examen
  getTipoClass(tipo: string): string {
    if (tipo.toLowerCase().includes('laboratorio')) return 'laboratorio';
    if (tipo.toLowerCase().includes('imagen')) return 'imagen';
    if (tipo.toLowerCase().includes('sangre')) return 'sangre';
    return 'laboratorio';
  }

  // Obtener icono según tipo
  getTipoIcon(tipo: string): string {
    if (tipo.toLowerCase().includes('laboratorio')) return 'flask-outline';
    if (tipo.toLowerCase().includes('imagen')) return 'scan-outline';
    if (tipo.toLowerCase().includes('sangre')) return 'water-outline';
    return 'document-text-outline';
  }
}