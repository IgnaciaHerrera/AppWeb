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
  }

  private applyTheme(isDark: boolean) {
    document.body.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('dark', isDark);
    
    console.log('Tema aplicado:', isDark ? 'Oscuro' : 'Claro');
  }
}