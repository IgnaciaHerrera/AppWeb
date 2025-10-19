import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-counter-card',
  templateUrl: './counter-card.component.html',
  styleUrls: ['./counter-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon]
})
export class CounterCardComponent {
  @Input() icon: string = 'help-outline';
  @Input() number: number = 0;
  @Input() label: string = '';
  @Input() colorClass: string = 'default'; 
}