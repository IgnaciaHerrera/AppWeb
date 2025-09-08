import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tab-more',
  templateUrl: './tab-more.page.html',
  styleUrls: ['./tab-more.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ],
})
export class TabMorePage {
  pages = [
    { name: 'Buscar Paciente', url: '/tabs/tab7' },
    { name: 'Noticias', url: '/tabs/tab8' },
    { name: 'Eventos', url: '/tabs/tab9' },
    { name: 'Foro', url: '/tabs/tab10' },
    { name: 'Tareas', url: '/tabs/tab11' },
    { name: 'Galería', url: '/tabs/tab12' },
  ];
}
