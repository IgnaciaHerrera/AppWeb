import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

interface Cita {
  id: string;
  dia: string;
  mes: string;
  especialidad: string;
  medico: string;
  centro: string;
  hora: string;
}

@Component({
  selector: 'app-cita-card',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './cita-card.component.html',
  styleUrls: ['./cita-card.component.scss']
})
export class CitaCardComponent {
  @Input() cita!: Cita;
}
