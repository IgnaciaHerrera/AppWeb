import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

interface Recordatorio {
  id: string;
  tipo: 'medicamento' | 'cita' | 'examen';
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
}

interface Cita {
  id: string;
  dia: string;
  mes: string;
  especialidad: string;
  medico: string;
  centro: string;
  hora: string;
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
  imports: [IonicModule, CommonModule, FormsModule],
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

  medicamentosActivos: MedicamentoActivo[] = [
    {
      id: '1',
      nombre: 'Losartán',
      dosis: '50 mg',
      forma: 'Comprimidos',
      frecuencia: 'Cada 12 horas'
    },
    {
      id: '2',
      nombre: 'Amoxicilina',
      dosis: '500 mg',
      forma: 'Cápsulas',
      frecuencia: 'Cada 8 horas por 7 días'
    }
  ];

  proximasCitas: Cita[] = [
    {
      id: '1',
      dia: '20',
      mes: 'SEP',
      especialidad: 'Cardiología',
      medico: 'Dr. Carlos Mendoza',
      centro: 'Hospital Cardiovascular',
      hora: '10:30'
    },
    {
      id: '2',
      dia: '25',
      mes: 'SEP',
      especialidad: 'Laboratorio',
      medico: 'Exámenes de Sangre',
      centro: 'LabMed',
      hora: '08:00'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.cargarDatos();
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
}

