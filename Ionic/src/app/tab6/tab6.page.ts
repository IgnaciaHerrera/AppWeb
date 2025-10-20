import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab6',
  templateUrl: './tab6.page.html',
  styleUrls: ['./tab6.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab6Page implements OnInit {

  darkMode: boolean = false;
  
  paciente = {
    nombre: 'María Elena Rodríguez',
    rut: '12.345.678-9',
    email: 'maria.rodriguez@email.com',
    telefono: '+56 9 8765 4321',
    ultimoAcceso: '07/09/2025 14:35'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMode = prefersDark.matches;
  }

  cambiarPassword() {
    alert('Aun no existe esta función :v');
  }

  logout() {
    // Aquí podrías limpiar storage o variables si tuvieras auth real
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  onDarkModeToggle() {
    document.body.classList.toggle('dark', this.darkMode);
  }

  cambiarIdioma(): void {
    alert('Función para cambiar idioma - próximamente');
  }

  verPoliticasPrivacidad(): void {
    alert('Función para ver políticas de privacidad - próximamente');
  }

  editarFoto(): void {
    alert('Función para cambiar foto de perfil - próximamente');
  }
}
