import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonIcon,
  IonFab, IonFabButton, IonModal, IonInput, IonButton, IonFooter,
  ToastController
} from '@ionic/angular/standalone';
import { LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.page.html',
  styleUrls: ['./datos-personales.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonIcon,
    IonFab, IonFabButton, IonModal, IonInput, IonButton, IonFooter
  ]
})
export class DatosPersonalesPage implements OnInit {
  
  nombre: string = 'María';
  apellido: string = 'Rodríguez';
  rut: string = '21.658.645-2';
  fechaNacimiento: string = '1989-03-15';
  email: string = 'maria.rodriguez@gmail.com';
  telefono: string = '+56912345678';
  edad: number | null = 35;
  tipoSanguineo: string = 'O+';
  
  nombreTemp: string = '';
  apellidoTemp: string = '';
  emailTemp: string = '';
  telefonoTemp: string = '';
  edadTemp: number | null = null;
  
  isModalOpen: boolean = false;
  isLoading: boolean = false;
  idPaciente: string = '';
  darkMode: boolean = false;

  constructor(
    private toastController: ToastController,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.darkMode = this.themeService.isDarkMode();
    this.cargarDatosPersonales();
    
    // Escuchar cambios en el tema
    document.addEventListener('darkModeChange', () => {
      this.darkMode = this.themeService.isDarkMode();
    });
  }

  onDarkModeToggle() {
    this.themeService.toggleDarkMode(this.darkMode);
  }

  async cargarDatosPersonales() {
    this.isLoading = true;
    try {
      this.idPaciente = localStorage.getItem('idPaciente') || '';

      if (!this.idPaciente) {
        await this.mostrarToast('Error: No hay sesión activa', 'warning');
        this.isLoading = false;
        return;
      }

      const response: any = await this.api.get(`/paciente/${this.idPaciente}`);
      
      if (response) {
        this.nombre = response.nombre || '';
        this.apellido = response.apellido || '';
        this.rut = response.rut || '';
        this.fechaNacimiento = response.fechaNacimiento || '';
        this.email = response.email || '';
        this.telefono = response.telefono || '';
        this.edad = response.edad || null;
        this.tipoSanguineo = response.tipoSanguineo || '';
      }
    } catch (error: any) {
      console.warn('Error al cargar datos personales:', error);
      const nombreCompleto = localStorage.getItem('nombrePaciente') || 'María Rodríguez';
      const partes = nombreCompleto.split(' ');
      
      this.nombre = partes[0] || 'María';
      this.apellido = partes.slice(1).join(' ') || 'Rodríguez';
      this.email = localStorage.getItem('emailPaciente') || 'maria.rodriguez@gmail.com';
      this.telefono = localStorage.getItem('telefonoPaciente') || '+56912345678';
      this.rut = '21.658.645-2';
      this.edad = 35;
      this.tipoSanguineo = 'O+';
      this.fechaNacimiento = '1989-03-15';
      
      await this.mostrarToast('Cargando datos locales', 'warning');
    } finally {
      this.isLoading = false;
    }
  }

  abrirModalEdicion() {
    this.nombreTemp = this.nombre;
    this.apellidoTemp = this.apellido;
    this.emailTemp = this.email;
    this.telefonoTemp = this.telefono;
    this.edadTemp = this.edad;
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  async guardarCambios() {
    if (!this.telefonoTemp?.trim()) {
      await this.mostrarToast('El teléfono es requerido', 'warning');
      return;
    }

    if (!this.emailTemp?.trim()) {
      await this.mostrarToast('El email es requerido', 'warning');
      return;
    }

    if (!this.validarEmail(this.emailTemp)) {
      await this.mostrarToast('Ingrese un email válido', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Actualizando datos...',
      spinner: 'circles'
    });
    await loading.present();

    try {
      const response: any = await this.api.put(`/datos-personales/${this.idPaciente}`, {
        nombre: this.nombreTemp,
        apellido: this.apellidoTemp,
        email: this.emailTemp,
        telefono: this.telefonoTemp,
        edad: this.edadTemp
      });

      if (response) {

        this.nombre = this.nombreTemp;
        this.apellido = this.apellidoTemp;
        this.email = this.emailTemp;
        this.telefono = this.telefonoTemp;
        this.edad = this.edadTemp;

        localStorage.setItem('nombrePaciente', `${this.nombre} ${this.apellido}`);
        localStorage.setItem('emailPaciente', this.email);
        localStorage.setItem('telefonoPaciente', this.telefono);

        this.cerrarModal();

        await this.mostrarToast('Datos actualizados correctamente', 'success');
      }
    } catch (error: any) {
      console.error('Error al guardar cambios:', error);
      await this.mostrarToast('Error al guardar los cambios', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  private validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async mostrarToast(mensaje: string, tipo: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: tipo
    });
    await toast.present();
  }
}