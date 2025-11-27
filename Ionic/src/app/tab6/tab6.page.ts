import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { ApiService } from '../services/api.service';
import { LoadingController, ToastController } from '@ionic/angular';

interface Paciente {
  idPaciente: number;
  nombre: string;
  apellido: string;
  rut: string;
  email: string;
  telefono: string;
  tipoSanguineo: string;
  edad: number;
  fechaNacimiento: string;
}

@Component({
  selector: 'app-tab6',
  templateUrl: './tab6.page.html',
  styleUrls: ['./tab6.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab6Page implements OnInit {

  darkMode: boolean = false;
  isPrivacyModalOpen: boolean = false;
  isLoading: boolean = false;
  idPaciente: string = '';

  paciente: Paciente = {
    idPaciente: 1,
    nombre: 'María',
    apellido: 'Rodríguez',
    rut: '21.658.645-2',
    email: 'maria.rodriguez@gmail.com',
    telefono: '+56912345678',
    tipoSanguineo: 'O+',
    edad: 35,
    fechaNacimiento: '1989-03-15'
  };

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.darkMode = this.themeService.isDarkMode();
    this.cargarPaciente();
  }

  async cargarPaciente() {
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
        this.paciente = response;
      }
    } catch (error: any) {
      console.warn('Error al cargar paciente:', error);
      this.cargarDatosLocal();
      await this.mostrarToast('Cargando datos locales', 'warning');
    } finally {
      this.isLoading = false;
    }
  }

  private cargarDatosLocal() {
    const nombreCompleto = localStorage.getItem('nombrePaciente') || '';
    const [nombre = '', apellido = ''] = nombreCompleto.split(' ');
    
    this.paciente = {
      idPaciente: parseInt(this.idPaciente),
      nombre: nombre,
      apellido: apellido,
      rut: '21.658.645-2',
      email: localStorage.getItem('emailPaciente') || '',
      telefono: localStorage.getItem('telefonoPaciente') || '',
      tipoSanguineo: 'O+',
      edad: 35,
      fechaNacimiento: '1989-03-15'
    };
  }

  onDarkModeToggle() {
    this.themeService.toggleDarkMode(this.darkMode);
  }

  verPoliticasPrivacidad() {
    this.isPrivacyModalOpen = true;
  }

  cerrarModal() {
    this.isPrivacyModalOpen = false;
  }

  editarFoto() {
    this.mostrarToast('Función para cambiar foto de perfil - próximamente disponible', 'warning');
  }

  logout() {
    localStorage.removeItem('idPaciente');
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('nombrePaciente');
    localStorage.removeItem('emailPaciente');
    localStorage.removeItem('telefonoPaciente');
    
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  private async mostrarToast(mensaje: string, tipo: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: tipo
    });
    await toast.present();
  }
}
