import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonItem, IonIcon, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-ficha-item',
  templateUrl: './ficha-item.component.html',
  styleUrls: ['./ficha-item.component.scss'],
  standalone: true,
  imports: [CommonModule, IonItem, IonIcon, IonLabel]
})
export class FichaItemComponent {
  @Input() titulo!: string;
  @Input() icon!: string;
  @Input() colorClass!: string;  // ej: "red", "blue"
  @Output() action = new EventEmitter<void>();

  onClick() {
    this.action.emit();
  }
}
