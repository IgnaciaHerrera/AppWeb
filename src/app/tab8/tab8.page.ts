import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab8',
  templateUrl: './tab8.page.html',
  styleUrls: ['./tab8.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
  ],
})
export class Tab8Page {
  noticias = [
    {
      titulo: 'Avance en medicina genética',
      descripcion: 'Un nuevo tratamiento promete revolucionar la terapia génica.',
    },
    {
      titulo: 'Clínica inaugura centro de telemedicina',
      descripcion: 'Se busca mejorar la atención a distancia en zonas rurales.',
    },
    {
      titulo: 'Nueva campaña de donación de sangre',
      descripcion: 'Se esperan más de 500 voluntarios en la jornada de salud.',
    },
  ];
}
