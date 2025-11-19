import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode: boolean = false;

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedTheme !== null) {
      
      this.darkMode = savedTheme === 'true';
    } else {
      
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.darkMode = prefersDark.matches;
            
      localStorage.setItem('darkMode', this.darkMode.toString());
    }
    
    this.applyTheme(this.darkMode);
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  toggleDarkMode(enable: boolean) {
    this.darkMode = enable;
    
    localStorage.setItem('darkMode', enable.toString());
    
    
    this.applyTheme(enable);
    
    console.log('Tema cambiado manualmente:', enable ? 'Oscuro' : 'Claro');
  }

  private applyTheme(isDark: boolean) {
    
    if (isDark) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    
    console.log('Tema aplicado:', isDark ? 'Oscuro' : 'Claro');
    console.log('Body classes:', document.body.className);
  }

  // Método opcional: resetear a las preferencias del sistema
  resetToSystemPreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMode = prefersDark.matches;
    localStorage.setItem('darkMode', this.darkMode.toString());
    this.applyTheme(this.darkMode);
    
    console.log('Tema reseteado a preferencias del sistema');
  }
}