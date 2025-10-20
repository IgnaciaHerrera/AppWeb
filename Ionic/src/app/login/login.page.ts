import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonIcon, LoadingController
} from '@ionic/angular/standalone';

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
    private loadingCtrl: LoadingController
  ) {}

  onEmailFocus() { this.emailFocused = true; }
  onEmailBlur() { this.emailFocused = false; }

  onPasswordFocus() { this.passwordFocused = true; }
  onPasswordBlur() { this.passwordFocused = false; }

  togglePassword() { this.showPassword = !this.showPassword; }

  async login() {
    this.showErrors = true;
    this.loginError = ''; 

    // Validación de campos vacíos
    if (!this.email || !this.password) {
      return;
    }

    // Mostrar loader mientras se valida
    const loading = await this.loadingCtrl.create({
      message: 'Iniciando...',
      spinner: 'circles'
    });
    await loading.present();

    setTimeout(async () => {
      await loading.dismiss();

      // Validar credenciales fijas
      if (this.email === 'maria.rodriguez@gmail.com' && this.password === 'maria.12345') {
        this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
      } else {
        this.loginError = 'Correo o contraseña incorrectos'; 
      }
    }, 1500);
  }
}
