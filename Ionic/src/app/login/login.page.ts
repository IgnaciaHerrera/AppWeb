import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonIcon, LoadingController, ToastController
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonIcon,
    CommonModule, FormsModule
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  emailFocused: boolean = false;
  passwordFocused: boolean = false;
  showPassword: boolean = false;
  showErrors: boolean = false;
  loginError: string = ''; 

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private api: ApiService,
    private toastCtrl: ToastController
  ) {}

  onEmailFocus() { this.emailFocused = true; }
  onEmailBlur() { this.emailFocused = false; }

  onPasswordFocus() { this.passwordFocused = true; }
  onPasswordBlur() { this.passwordFocused = false; }

  togglePassword() { this.showPassword = !this.showPassword; }

  async login() {
    this.showErrors = true;
    this.loginError = '';

    if (!this.email || !this.password) {
      this.loginError = 'Correo y contraseña son requeridos';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.loginError = 'Ingrese un correo válido';
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'circles'
    });
    await loading.present();

    try {
      const response: any = await this.api.post('/login', {
        email: this.email,
        password: this.password
      });

      await loading.dismiss();

      if (response?.success) {
        localStorage.setItem('idPaciente', response.idPaciente);
        localStorage.setItem('idUsuario', response.idUsuario || response.idPaciente);
        localStorage.setItem('nombrePaciente', `${response.nombre || ''} ${response.apellido || ''}`.trim());
        localStorage.setItem('emailPaciente', response.email || this.email);
        localStorage.setItem('telefonoPaciente', response.telefono || '');
        
        await this.mostrarToast('¡Bienvenido!', 'success');
        this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
        return;
      } else {
        this.loginError = 'Credenciales inválidas';
      }
    } catch (error: any) {
      await loading.dismiss();
      console.warn('Error al conectar con servidor:', error);
      
      if (this.email === 'maria.rodriguez@gmail.com' && this.password === 'maria.1234') {
        localStorage.setItem('idPaciente', '1');
        localStorage.setItem('idUsuario', '1');
        localStorage.setItem('nombrePaciente', 'María Rodríguez');
        localStorage.setItem('emailPaciente', 'maria.rodriguez@gmail.com');
        localStorage.setItem('telefonoPaciente', '+56912345678');
        
        await this.mostrarToast('Modo demo - datos locales', 'warning');
        this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
        return;
      }
      
      this.loginError = 'Error de conexión. Verifique sus credenciales.';
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async mostrarToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'top',
      color
    });
    await toast.present();
  }
}
