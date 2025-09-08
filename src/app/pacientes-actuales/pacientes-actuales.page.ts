import { Component, OnInit,ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonAccordion, IonAccordionGroup, IonButton, IonItem, IonLabel, IonList } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pacientes-actuales',
  templateUrl: './pacientes-actuales.page.html',
  styleUrls: ['./pacientes-actuales.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonAccordion, IonAccordionGroup, IonButton, IonItem, IonLabel,
    IonList
  ]
})
export class PacientesActualesPage implements OnInit {

  @ViewChild('accordionGroup', { static: true }) accordionGroup!: IonAccordionGroup;

  pacientes = [
    { nombre: 'Juan Pérez', edad: 45, habitacion: '101A', diagnostico: 'Hipertensión' },
    { nombre: 'María López', edad: 32, habitacion: '102B', diagnostico: 'Diabetes' },
    { nombre: 'Carlos Ramírez', edad: 60, habitacion: '103C', diagnostico: 'Insuficiencia Cardíaca' },
  ];

  constructor() { }

  ngOnInit() {}

  toggleAccordion() {
    if (this.accordionGroup.value === 'second') {
      this.accordionGroup.value = undefined;
    } else {
      this.accordionGroup.value = 'second';
    }
  }
}
