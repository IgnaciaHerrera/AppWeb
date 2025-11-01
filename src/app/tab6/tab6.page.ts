import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';

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
    email: 'maria.rodriguez@gmail.com',
    telefono: '+56 9 8765 4321',
    ultimoAcceso: '07/09/2025 14:35'
  };

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.darkMode = this.themeService.isDarkMode();
  }

  onDarkModeToggle() {
    this.themeService.toggleDarkMode(this.darkMode);
  }

  cambiarPassword() {
    alert('Aun no existe esta función :v');
  }

  logout() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
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