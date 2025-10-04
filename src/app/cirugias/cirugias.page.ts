import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonSelect, IonSelectOption, IonFab, IonFabButton,
  IonModal, IonInput, IonFooter, IonDatetime, IonPopover, ToastController,
  IonButton
} from '@ionic/angular/standalone';

interface Cirugia {
  id: string;
  nombre: string;
  medico: string;
  hospital: string;
  fecha: string;
  estado: 'Programada' | 'Finalizada';
  expanded: boolean;
}

type OrdenCirugia = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';

@Component({
  selector: 'app-cirugias',
  templateUrl: './cirugias.page.html',
  styleUrls: ['./cirugias.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonSelect, IonSelectOption, IonFab, IonFabButton,
    IonModal, IonInput, IonFooter, IonDatetime, IonPopover, IonButton
  ]
})
export class CirugiasPage implements OnInit {
  cirugias: Cirugia[] = [];
  filtroOrden: OrdenCirugia = 'recientes';
  modalAbierto = false;
  fechaFormateada = '';
  
  nuevaCirugia: Partial<Cirugia> = {
    nombre: '',
    medico: '',
    hospital: '',
    fecha: ''
  };

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    this.inicializarDatosDePrueba();
    this.ordenarCirugias();
  }

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.limpiarFormulario();
  }

  private limpiarFormulario() {
    this.nuevaCirugia = {
      nombre: '',
      medico: '',
      hospital: '',
      fecha: ''
    };
    this.fechaFormateada = '';
  }

  onFechaChange(event: any) {
    if (event?.detail?.value) {
      // Guardar la fecha ISO completa
      this.nuevaCirugia.fecha = event.detail.value;
      
      // Extraer año, mes y día del string ISO
      const fechaParts = event.detail.value.split('T')[0].split('-');
      const año = parseInt(fechaParts[0]);
      const mes = parseInt(fechaParts[1]) - 1;
      const dia = parseInt(fechaParts[2]);
      
      // Crear fecha en hora local
      const fechaObj = new Date(año, mes, dia);
      
      this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  }

  esFormularioValido(): boolean {
    return !!(
      this.nuevaCirugia.nombre?.trim() &&
      this.nuevaCirugia.medico?.trim() &&
      this.nuevaCirugia.hospital?.trim() &&
      this.nuevaCirugia.fecha
    );
  }

  async guardarCirugia() {
    if (!this.esFormularioValido()) {
      this.mostrarToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    // Extraer la fecha para comparación
    const fechaParts = this.nuevaCirugia.fecha!.split('T')[0].split('-');
    const fechaCirugia = new Date(parseInt(fechaParts[0]), parseInt(fechaParts[1]) - 1, parseInt(fechaParts[2]));
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const nueva: Cirugia = {
      id: Date.now().toString(),
      nombre: this.nuevaCirugia.nombre!.trim(),
      medico: this.nuevaCirugia.medico!.trim(),
      hospital: this.nuevaCirugia.hospital!.trim(),
      fecha: this.nuevaCirugia.fecha!.split('T')[0],
      estado: fechaCirugia > hoy ? 'Programada' : 'Finalizada',
      expanded: false
    };

    this.cirugias.unshift(nueva);
    this.cerrarModal();
    this.mostrarToast('Cirugía registrada exitosamente', 'success');
    this.ordenarCirugias();
  }

  toggleCirugia(cirugia: Cirugia): void {
    cirugia.expanded = !cirugia.expanded;
  }

  getStatusClass(cirugia: Cirugia): string {
    return cirugia.estado === 'Programada' ? 'status-programada' : 'status-finalizada';
  }

  getBadgeClass(cirugia: Cirugia): string {
    return cirugia.estado === 'Programada' ? 'badge-programada' : 'badge-finalizada';
  }

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

  ordenarCirugias(): void {
    switch (this.filtroOrden) {
      case 'recientes':
        this.cirugias.sort((a, b) => {
          const fechaA = a.fecha.split('-').map(n => parseInt(n));
          const fechaB = b.fecha.split('-').map(n => parseInt(n));
          return new Date(fechaB[0], fechaB[1] - 1, fechaB[2]).getTime() - 
                 new Date(fechaA[0], fechaA[1] - 1, fechaA[2]).getTime();
        });
        break;
      case 'antiguas':
        this.cirugias.sort((a, b) => {
          const fechaA = a.fecha.split('-').map(n => parseInt(n));
          const fechaB = b.fecha.split('-').map(n => parseInt(n));
          return new Date(fechaA[0], fechaA[1] - 1, fechaA[2]).getTime() - 
                 new Date(fechaB[0], fechaB[1] - 1, fechaB[2]).getTime();
        });
        break;
      case 'alfabetico-asc':
        this.cirugias.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
        break;
      case 'alfabetico-desc':
        this.cirugias.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es'));
        break;
    }
  }

  async mostrarToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }

  private inicializarDatosDePrueba(): void {
    this.cirugias = [
      {
        id: '1',
        nombre: 'Apendicectomía',
        medico: 'Dr. Juan Herrera',
        hospital: 'Clínica Central',
        fecha: '2024-06-24',
        estado: 'Finalizada',
        expanded: false
      },
      {
        id: '2',
        nombre: 'Bypass gástrico',
        medico: 'Dra. Ana Vargas',
        hospital: 'Hospital Universitario',
        fecha: '2024-08-15',
        estado: 'Programada',
        expanded: false
      }
    ];
  }
}