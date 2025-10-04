import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonSelect, IonSelectOption, IonFab, IonFabButton,
  IonModal, IonButton, IonFooter, IonDatetime, IonPopover,
  IonInput, IonToggle, ToastController
} from '@ionic/angular/standalone';

interface Hospitalizacion {
  id: string;
  motivo: string;
  fechaIngreso: string;   
  fechaAlta?: string;
  medico: string;
  hospital?: string;
  expanded: boolean;
}

type TipoOrden = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';

@Component({
  selector: 'app-hospitalizaciones',
  templateUrl: './hospitalizaciones.page.html',
  styleUrls: ['./hospitalizaciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonSelect, IonSelectOption, IonFab, IonFabButton,
    IonModal, IonButton, IonFooter, IonDatetime, IonPopover, IonInput, IonToggle
  ]
})
export class HospitalizacionesPage implements OnInit {
  hospitalizaciones: Hospitalizacion[] = [];
  ordenSeleccionado: TipoOrden = 'recientes';
  
  // --- Modal ---
  modalAbierto = false;
  fechaIngresoFormateada = '';
  fechaAltaFormateada = '';
  finalizada = false;
  
  nuevaHosp: Partial<Hospitalizacion> = {
    motivo: '',
    medico: '',
    hospital: '',
    fechaIngreso: '',
    fechaAlta: ''
  };

  constructor(private toastController: ToastController) {
    this.inicializarDatosDePrueba();
  }

  ngOnInit() {
    this.aplicarOrden();
  }

  // --- Abrir/Cerrar Modal ---
  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.nuevaHosp = { motivo: '', medico: '', hospital: '', fechaIngreso: '', fechaAlta: '' };
    this.fechaIngresoFormateada = '';
    this.fechaAltaFormateada = '';
    this.finalizada = false;
  }

  // --- Validar formulario ---
  esFormularioValido(): boolean {
    return !!(
      this.nuevaHosp.motivo?.trim() &&
      this.nuevaHosp.medico?.trim() &&
      this.nuevaHosp.hospital?.trim() &&
      this.nuevaHosp.fechaIngreso
    );
  }

  // --- Manejo de Fechas ---
  onFechaIngresoChange(event: any) {
    if (event?.detail?.value) {
      // Guardar la fecha ISO completa
      this.nuevaHosp.fechaIngreso = event.detail.value;
      
      // Extraer año, mes y día del string ISO
      const fechaParts = event.detail.value.split('T')[0].split('-');
      const año = parseInt(fechaParts[0]);
      const mes = parseInt(fechaParts[1]) - 1;
      const dia = parseInt(fechaParts[2]);
      
      // Crear fecha en hora local
      const fechaObj = new Date(año, mes, dia);
      
      this.fechaIngresoFormateada = fechaObj.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // Si ya hay una fecha de alta seleccionada, verificar que sea posterior
      if (this.nuevaHosp.fechaAlta) {
        const fechaIngreso = new Date(año, mes, dia);
        const fechaAltaParts = this.nuevaHosp.fechaAlta.split('T')[0].split('-');
        const fechaAlta = new Date(
          parseInt(fechaAltaParts[0]), 
          parseInt(fechaAltaParts[1]) - 1, 
          parseInt(fechaAltaParts[2])
        );

        if (fechaAlta < fechaIngreso) {
          this.nuevaHosp.fechaAlta = '';
          this.fechaAltaFormateada = '';
          this.mostrarToast('La fecha de alta no puede ser anterior a la fecha de ingreso', 'warning');
        }
      }
    }
  }

  onFechaAltaChange(event: any) {
    if (event?.detail?.value) {
      // Guardar la fecha ISO completa
      this.nuevaHosp.fechaAlta = event.detail.value;
      
      // Extraer año, mes y día del string ISO
      const fechaParts = event.detail.value.split('T')[0].split('-');
      const año = parseInt(fechaParts[0]);
      const mes = parseInt(fechaParts[1]) - 1;
      const dia = parseInt(fechaParts[2]);
      
      // Crear fecha en hora local
      const fechaObj = new Date(año, mes, dia);

      // Validar que la fecha de alta sea posterior o igual a la de ingreso
      if (this.nuevaHosp.fechaIngreso) {
        const fechaIngresoParts = this.nuevaHosp.fechaIngreso.split('T')[0].split('-');
        const fechaIngreso = new Date(
          parseInt(fechaIngresoParts[0]), 
          parseInt(fechaIngresoParts[1]) - 1, 
          parseInt(fechaIngresoParts[2])
        );

        if (fechaObj < fechaIngreso) {
          this.nuevaHosp.fechaAlta = '';
          this.fechaAltaFormateada = '';
          this.mostrarToast('La fecha de alta no puede ser anterior a la fecha de ingreso', 'warning');
          return;
        }
      }
      
      this.fechaAltaFormateada = fechaObj.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  }

  // --- Guardar Hospitalización ---
  async guardarHospitalizacion() {
    if (!this.esFormularioValido()) {
      this.mostrarToast('Completa los campos requeridos', 'warning');
      return;
    }

    // Validación adicional si marcó como finalizada
    if (this.finalizada && !this.nuevaHosp.fechaAlta) {
      this.mostrarToast('Debes ingresar la fecha de alta si la hospitalización está finalizada', 'warning');
      return;
    }

    // Validación final de fechas
    if (this.finalizada && this.nuevaHosp.fechaAlta && this.nuevaHosp.fechaIngreso) {
      const fechaIngresoParts = this.nuevaHosp.fechaIngreso.split('T')[0].split('-');
      const fechaIngreso = new Date(
        parseInt(fechaIngresoParts[0]), 
        parseInt(fechaIngresoParts[1]) - 1, 
        parseInt(fechaIngresoParts[2])
      );

      const fechaAltaParts = this.nuevaHosp.fechaAlta.split('T')[0].split('-');
      const fechaAlta = new Date(
        parseInt(fechaAltaParts[0]), 
        parseInt(fechaAltaParts[1]) - 1, 
        parseInt(fechaAltaParts[2])
      );

      if (fechaAlta < fechaIngreso) {
        this.mostrarToast('La fecha de alta no puede ser anterior a la fecha de ingreso', 'warning');
        return;
      }
    }

    const nueva: Hospitalizacion = {
      id: Date.now().toString(),
      motivo: this.nuevaHosp.motivo!.trim(),
      medico: this.nuevaHosp.medico!.trim(),
      hospital: this.nuevaHosp.hospital!.trim(),
      fechaIngreso: this.nuevaHosp.fechaIngreso!.split('T')[0],
      fechaAlta: this.finalizada && this.nuevaHosp.fechaAlta ? this.nuevaHosp.fechaAlta.split('T')[0] : undefined,
      expanded: false
    };

    this.hospitalizaciones.unshift(nueva);
    this.aplicarOrden();
    this.cerrarModal();
    this.mostrarToast('Hospitalización registrada correctamente', 'success');
  }

  // --- Toast ---
  async mostrarToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'top',
      color
    });
    await toast.present();
  }

  // --- Expansión ---
  toggleHospitalizacion(hosp: Hospitalizacion): void {
    hosp.expanded = !hosp.expanded;
  }

  // --- Clases y Estados ---
  getStatusClass(hosp: Hospitalizacion): string {
    return hosp.fechaAlta ? 'status-finalizada' : 'status-activa';
  }

  getBadgeClass(hosp: Hospitalizacion): string {
    return hosp.fechaAlta ? 'badge-finalizada' : 'badge-en-curso';
  }

  getStatusLabel(hosp: Hospitalizacion): string {
    return hosp.fechaAlta ? 'Finalizada' : 'En curso';
  }

  // --- Fecha formato ---
  formatFecha(fecha: string): string {
    if (!fecha) return '';
    
    // Extraer año, mes y día del string
    const fechaParts = fecha.split('-');
    const año = parseInt(fechaParts[0]);
    const mes = parseInt(fechaParts[1]) - 1;
    const dia = parseInt(fechaParts[2]);
    
    // Crear fecha en hora local
    const date = new Date(año, mes, dia);
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  // --- Ordenamiento ---
  aplicarOrden(): void {
    switch (this.ordenSeleccionado) {
      case 'recientes':
        this.hospitalizaciones.sort((a, b) => {
          const fechaA = a.fechaIngreso.split('-').map(n => parseInt(n));
          const fechaB = b.fechaIngreso.split('-').map(n => parseInt(n));
          return new Date(fechaB[0], fechaB[1] - 1, fechaB[2]).getTime() - 
                 new Date(fechaA[0], fechaA[1] - 1, fechaA[2]).getTime();
        });
        break;
      case 'antiguas':
        this.hospitalizaciones.sort((a, b) => {
          const fechaA = a.fechaIngreso.split('-').map(n => parseInt(n));
          const fechaB = b.fechaIngreso.split('-').map(n => parseInt(n));
          return new Date(fechaA[0], fechaA[1] - 1, fechaA[2]).getTime() - 
                 new Date(fechaB[0], fechaB[1] - 1, fechaB[2]).getTime();
        });
        break;
      case 'alfabetico-asc':
        this.hospitalizaciones.sort(
          (a, b) => a.motivo.localeCompare(b.motivo, 'es', { sensitivity: 'base' })
        );
        break;
      case 'alfabetico-desc':
        this.hospitalizaciones.sort(
          (a, b) => b.motivo.localeCompare(a.motivo, 'es', { sensitivity: 'base' })
        );
        break;
    }
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

  // --- Datos de prueba ---
  private inicializarDatosDePrueba(): void {
    this.hospitalizaciones = [
      {
        id: '1',
        motivo: 'Neumonía aguda',
        fechaIngreso: '2024-07-10',
        fechaAlta: '2024-07-18',
        medico: 'Dr. Carlos Mendoza',
        hospital: 'Hospital Central',
        expanded: false
      },
      {
        id: '2',
        motivo: 'Control diabético',
        fechaIngreso: '2024-09-15',
        medico: 'Dr. Roberto Silva',
        hospital: 'Hospital Universitario',
        expanded: false
      }
    ];
  }
}