import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonButton, IonSearchbar, IonSelect, IonSelectOption,
  IonChip, IonSpinner, IonDatetime
} from '@ionic/angular/standalone';

interface EventoHistorial {
  id: string;
  tipo: 'consulta' | 'examen' | 'hospitalizacion' | 'cirugia' | 'receta';
  titulo: string;
  descripcion: string;
  fecha: string;
  fechaTimestamp: Date;
  medico?: string;
  especialidad?: string;
  centro?: string;
  duracion?: string;
  detalles?: string;
  resultados?: string[];
  expanded: boolean;
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonButton, IonSearchbar, IonSelect, IonSelectOption,
    IonChip, IonSpinner, IonDatetime
  ]
})
export class HistorialPage implements OnInit {
  showFilters = false;
  isLoading = false;

  searchTerm = '';
  selectedType = '';
  selectedDate = '';

  historialCompleto: EventoHistorial[] = [];
  historialFiltrado: EventoHistorial[] = [];

  constructor() { 
    this.inicializarDatosDePrueba();
    this.applyFilters();
  }

  ngOnInit() {}

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleEvento(evento: EventoHistorial): void {
    evento.expanded = !evento.expanded;
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.detail.value;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.historialCompleto];

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(evento => 
        evento.titulo.toLowerCase().includes(term) ||
        evento.descripcion.toLowerCase().includes(term) ||
        evento.medico?.toLowerCase().includes(term) ||
        evento.especialidad?.toLowerCase().includes(term)
      );
    }

    if (this.selectedType !== '') {
      filtered = filtered.filter(evento => evento.tipo === this.selectedType);
    }

    if (this.selectedDate !== '') {
      const selectedDate = new Date(this.selectedDate);
      filtered = filtered.filter(evento => 
        evento.fechaTimestamp.getMonth() === selectedDate.getMonth() &&
        evento.fechaTimestamp.getFullYear() === selectedDate.getFullYear()
      );
    }

    filtered.sort((a, b) => b.fechaTimestamp.getTime() - a.fechaTimestamp.getTime());
    this.historialFiltrado = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.selectedDate = '';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return this.searchTerm !== '' || this.selectedType !== '' || this.selectedDate !== '';
  }

  getEventCount(tipo: string): number {
    return this.historialFiltrado.filter(evento => evento.tipo === tipo).length;
  }

  getEventTypeClass(evento: EventoHistorial): string {
    return `event-${evento.tipo}`;
  }

  getEventBadgeColor(tipo: string): string {
    switch (tipo) {
      case 'consulta': return 'primary';
      case 'examen': return 'secondary';
      case 'hospitalizacion': return 'warning';
      case 'cirugia': return 'danger';
      case 'receta': return 'success';
      default: return 'medium';
    }
  }

  getEventTypeLabel(tipo: string): string {
    switch (tipo) {
      case 'consulta': return 'Consulta';
      case 'examen': return 'Examen';
      case 'hospitalizacion': return 'Ingreso';
      case 'cirugia': return 'Cirugía';
      case 'receta': return 'Receta';
      default: return 'Evento';
    }
  }

  getDetailsTitle(tipo: string): string {
    switch (tipo) {
      case 'consulta': return 'Motivo de Consulta';
      case 'examen': return 'Procedimiento Realizado';
      case 'hospitalizacion': return 'Motivo de Ingreso';
      case 'cirugia': return 'Procedimiento Quirúrgico';
      case 'receta': return 'Medicamentos Prescritos';
      default: return 'Detalles';
    }
  }

  getEmptyStateTitle(): string {
    return this.hasActiveFilters() ? 'No se encontraron resultados' : 'No hay eventos en el historial';
  }

  getEmptyStateMessage(): string {
    return this.hasActiveFilters() 
      ? 'Intenta ajustar los filtros o términos de búsqueda' 
      : 'Tu historial médico aparecerá aquí a medida que tengas consultas y procedimientos';
  }

  verDocumento(documento: string): void {
    console.log('Ver documento:', documento);
  }

  private inicializarDatosDePrueba(): void {
    this.historialCompleto = [
      {
        id: '1',
        tipo: 'consulta',
        titulo: 'Consulta de Cardiología',
        descripcion: 'Control rutinario por hipertensión arterial',
        fecha: '15 Sep 2025',
        fechaTimestamp: new Date('2025-09-15'),
        medico: 'Dr. Carlos Mendoza',
        especialidad: 'Cardiología',
        centro: 'Hospital Cardiovascular',
        duracion: '45 minutos',
        detalles: 'Presión arterial estable con Losartán. ECG sin arritmias agudas.',
        resultados: ['Electrocardiograma', 'Tensión arterial'],
        expanded: false
      },
      {
        id: '2',
        tipo: 'examen',
        titulo: 'Glicemia',
        descripcion: 'Control de glucosa en sangre',
        fecha: '05 Sep 2025',
        fechaTimestamp: new Date('2025-09-05'),
        medico: 'Dr. Luis Prado',
        especialidad: 'Endocrinología',
        centro: 'Laboratorio Central',
        detalles: 'Glucosa en ayunas 95 mg/dL (normal).',
        resultados: ['Informe Laboratorio'],
        expanded: false
      },
      {
        id: '3',
        tipo: 'receta',
        titulo: 'Receta Médica #2025-0145',
        descripcion: 'Tratamiento para infección respiratoria',
        fecha: '20 Ago 2025',
        fechaTimestamp: new Date('2025-08-20'),
        medico: 'Dr. Juan C. Herrera',
        especialidad: 'Medicina General',
        centro: 'Centro Médico San Juan',
        detalles: 'Amoxicilina 500mg cada 8h por 7 días, Ketazol 200mg cada 12h por 6 días.',
        resultados: ['Receta Digital'],
        expanded: false
      },
      {
        id: '4',
        tipo: 'hospitalizacion',
        titulo: 'Hospitalización por Neumonía',
        descripcion: 'Ingreso por cuadro respiratorio agudo',
        fecha: '20 Ago 2025',
        fechaTimestamp: new Date('2025-08-20'),
        medico: 'Dra. Ana Vargas',
        especialidad: 'Medicina Interna',
        centro: 'Hospital General',
        duracion: '5 días',
        detalles: 'Ingreso por neumonía adquirida en la comunidad. Tratamiento antibiótico endovenoso. Evolución favorable.',
        resultados: ['Radiografía de tórax', 'Cultivos', 'Epicrisis'],
        expanded: false
      },
      {
        id: '5',
        tipo: 'examen',
        titulo: 'Radiografía de Tórax',
        descripcion: 'Control post neumonía',
        fecha: '25 Ago 2025',
        fechaTimestamp: new Date('2025-08-25'),
        medico: 'Dr. Luis Hernández',
        especialidad: 'Radiología',
        centro: 'Centro de Imágenes',
        detalles: 'Pulmones expandidos, sin infiltrados residuales.',
        resultados: ['Rx PA', 'Rx Lateral'],
        expanded: false
      },
      {
        id: '6',
        tipo: 'cirugia',
        titulo: 'Apendicectomía Laparoscópica',
        descripcion: 'Extirpación de apéndice por vía laparoscópica',
        fecha: '15 Jun 2025',
        fechaTimestamp: new Date('2025-06-15'),
        medico: 'Dr. Pedro Ramírez',
        especialidad: 'Cirugía General',
        centro: 'Hospital Quirúrgico',
        duracion: '2 horas',
        detalles: 'Cirugía sin complicaciones. Apéndice inflamado, no perforado.',
        resultados: ['Protocolo operatorio', 'Biopsia', 'Epicrisis'],
        expanded: false
      }
    ];
  }
}
