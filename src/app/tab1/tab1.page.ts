import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { CitaCardComponent } from '../components/cita-card/cita-card.component';
import { QuickAccessCardComponent } from '../components/quick-access-card/quick-access-card.component';


interface Cita {
  id: string;
  dia: string;
  mes: string;
  especialidad: string;
  medico: string;
  centro: string;

}

interface MedicamentoActivo {
  id: string;
  nombre: string;
  dosis: string;
  forma: string;
  frecuencia: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CitaCardComponent, QuickAccessCardComponent],
})
export class Tab1Page implements OnInit {
  paciente = {
    nombre: 'María Elena',
    apellido: 'Rodríguez'
  };

  contadores = {
    medicamentos: 2,
    diagnosticos: 4,
    alergias: 3,
    historial: 7
  };

  proximasCitas: Cita[] = [
    {
      id: '1',
      dia: '20',
      mes: 'SEP',
      especialidad: 'Cardiología',
      medico: 'Dr. Carlos Mendoza',
      centro: 'Hospital Cardiovascular',
    },
    {
      id: '2',
      dia: '25',
      mes: 'SEP',
      especialidad: 'Laboratorio',
      medico: 'Exámenes de Sangre',
      centro: 'LabMed',
    }
  ];

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    this.cargarDatos();
    await this.mostrarToastBienvenida();
  }

  goTo(route: string): void {
    this.router.navigate([route]);
  }

  navegarA(seccion: string): void {
    switch (seccion) {
      case 'medicamentos':
        this.router.navigate(['/recetas-medicamentos']);
        break;
      case 'diagnosticos':
        this.router.navigate(['/diagnosticos']);
        break;
      case 'alergias':
        this.router.navigate(['/alergias']);
        break;
      case 'historial':
        this.router.navigate(['/historial']);
        break;
    }
  }

  private cargarDatos(): void {
    console.log('Cargando datos del paciente...');
  }

  private async mostrarToastBienvenida(): Promise<void> {
    const toast = await this.toastController.create({
      message: `Bienvenido/a ${this.paciente.nombre} 👋`,
      duration: 3000,
      position: 'top',
      cssClass: 'toast-bienvenida'
    });
    await toast.present();
  }
}
