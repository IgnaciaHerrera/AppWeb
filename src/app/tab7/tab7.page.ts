import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonCard,
  IonCardContent,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab7',
  templateUrl: './tab7.page.html',
  styleUrls: ['./tab7.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonIcon,
  ],
})
export class Tab7Page {
  searchTerm = '';
  pacientes = [
    { nombre: 'Juan Pérez', rut: '11.111.111-1', ultimaAtencion: '2024-09-01', tipoSangre: 'A+' },
    { nombre: 'María López', rut: '22.222.222-2', ultimaAtencion: '2024-08-12', tipoSangre: 'B-' },
  ];

  pacientesFiltrados() {
    return this.pacientes.filter(
      (p) =>
        p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.rut.includes(this.searchTerm)
    );
  }
}
