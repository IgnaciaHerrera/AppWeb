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
  selector: 'app-tab10',
  templateUrl: './tab10.page.html',
  styleUrls: ['./tab10.page.scss'],
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
export class Tab10Page {
  chats = [
    { usuario: 'Juan Pérez', mensaje: 'Hola, ¿cómo estás?', sinLeer: 2 },
    { usuario: 'María López', mensaje: 'Revisé tu reporte', sinLeer: 0 },
    { usuario: 'Pedro Ramírez', mensaje: '¿Nos vemos mañana?', sinLeer: 5 },
  ];
}
