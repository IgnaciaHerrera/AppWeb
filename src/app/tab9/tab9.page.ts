import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab9',
  templateUrl: './tab9.page.html',
  styleUrls: ['./tab9.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
  ],
})
export class Tab9Page {
  eventos = [
    { nombre: 'Charla sobre salud mental', fecha: '2025-09-15', tipo: 'Educativo' },
    { nombre: 'Campaña de vacunación', fecha: '2025-09-18', tipo: 'Salud' },
    { nombre: 'Taller de nutrición', fecha: '2025-09-20', tipo: 'Educativo' },
  ];
}
