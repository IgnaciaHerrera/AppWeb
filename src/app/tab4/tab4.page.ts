import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonSearchbar, IonCard, IonCardContent, IonIcon
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonSearchbar, IonCard, IonCardContent, IonIcon,
    CommonModule, FormsModule, RouterModule   
  ]
})
export class Tab4Page implements OnInit {

  searchTerm: string = '';

  pacientes = [
    { nombre: 'Ignacia Pérez', rut: '21.618.632-5', tipoSangre: 'A+', ultimaAtencion: '19/08/2025' },
    { nombre: 'Matías González', rut: '19.456.789-2', tipoSangre: 'O-', ultimaAtencion: '10/08/2025' },
    { nombre: 'Camila Rojas', rut: '17.234.567-8', tipoSangre: 'B+', ultimaAtencion: '05/08/2025' },
    { nombre: 'Felipe Torres', rut: '22.987.654-1', tipoSangre: 'AB-', ultimaAtencion: '01/08/2025' }
  ];

  constructor() {}

  ngOnInit() {}

  pacientesFiltrados() {
    if (!this.searchTerm) {
      return this.pacientes;
    }
    return this.pacientes.filter(p =>
      p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.rut.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
