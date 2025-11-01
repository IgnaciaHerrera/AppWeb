import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonButton, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonLabel, IonIcon]
})
export class FilterBarComponent {
  @Input() colorTema: 'verde' | 'cyan' | 'morado' | 'rojo' | 'naranja' | 'rosa' = 'verde';
  @Input() periodoTexto: string = 'Todos';
  @Input() ordenTexto: string = 'Más recientes';
  
  @Output() abrirPeriodo = new EventEmitter<void>();
  @Output() abrirOrden = new EventEmitter<void>();
  abrirSelectorPeriodo() { 
    this.abrirPeriodo.emit(); 
  }
  
  abrirSelectorOrden() { 
    this.abrirOrden.emit(); 
  }
}