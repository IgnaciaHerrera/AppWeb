import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

interface MedicamentoActivo {
  id: string;
  nombre: string;
  dosis: string;
  forma: string;
  frecuencia: string;
}

@Component({
  selector: 'app-medicamento-card',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './medicamento-card.component.html',
  styleUrls: ['./medicamento-card.component.scss']
})
export class MedicamentoCardComponent {
  @Input() medicamento!: MedicamentoActivo;
}
