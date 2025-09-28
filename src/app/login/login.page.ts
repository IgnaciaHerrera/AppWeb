import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonIcon
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

  constructor(private router: Router) {}

  onEmailFocus() { this.emailFocused = true; }
  onEmailBlur() { this.emailFocused = false; }

  onPasswordFocus() { this.passwordFocused = true; }
  onPasswordBlur() { this.passwordFocused = false; }

  togglePassword() { this.showPassword = !this.showPassword; }

  login() {
    if (!this.email || !this.password) {
      console.log('Por favor, completa todos los campos');
      return;
    }
    this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
  }
}
