import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { QuickAccessCardComponent } from '../components/quick-access-card/quick-access-card.component';
import { ApiService } from '../services/api.service';

interface Examen {
  id: string;
  nombre: string;
  fecha: string;
  tipo?: string;
  resultados?: any[];
}

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QuickAccessCardComponent],
})
export class Tab1Page implements OnInit {
  paciente = {
    nombre: 'María',
    apellido: 'Rodríguez'
  };

  contadores = {
    examenes: 0,
    alergias: 0
  };

  ultimosExamenes: Examen[] = [];

  constructor(
    private router: Router,
    private toastController: ToastController,
    private api: ApiService
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  goTo(route: string): void {
    this.router.navigate([route]);
  }

  navegarA(seccion: string): void {
    switch (seccion) {
      case 'examenes':
        this.router.navigate(['/examenes']);
        break;
      case 'alergias':
        this.router.navigate(['/alergias']);
        break;
    }
  }

  private async cargarDatos(): Promise<void> {
    try {
      const examenesResponse = await this.api.get('/examenes-completos');
      if (examenesResponse && Array.isArray(examenesResponse)) {
        const todosExamenes = examenesResponse;
        this.contadores.examenes = todosExamenes.length;
        this.ultimosExamenes = todosExamenes.slice(0, 4);
      }
    } catch (error) {
      console.warn('Error al cargar exámenes:', error);
    }

    try {
      const alergiasResponse = await this.api.get('/alergias');
      if (alergiasResponse && Array.isArray(alergiasResponse)) {
        const todasAlergias = alergiasResponse;
        this.contadores.alergias = todasAlergias.length;
      }
    } catch (error) {
      console.warn('Error al cargar alergias:', error);
    }

    console.log('Datos del paciente cargados...');
  }
}
