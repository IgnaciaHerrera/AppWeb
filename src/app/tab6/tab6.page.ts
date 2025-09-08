import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab6',
  templateUrl: './tab6.page.html',
  styleUrls: ['./tab6.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab6Page implements OnInit {

  darkMode: boolean = false;

  constructor() {}

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMode = prefersDark.matches;
  }

  cambiarPassword() {
    alert('Aun no existe esta función :v');
  }

  logout() {
    alert('Esta tampoco :v.');
  }

  onDarkModeToggle() {
    document.body.classList.toggle('dark', this.darkMode);
  }
}
