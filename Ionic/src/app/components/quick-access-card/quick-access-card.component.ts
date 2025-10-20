import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quick-access-card',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './quick-access-card.component.html',
  styleUrls: ['./quick-access-card.component.scss']
})
export class QuickAccessCardComponent {
  @Input() titulo!: string;
  @Input() icon!: string;
  @Input() contador!: number;
  @Input() unidad!: string;
  @Input() customClass: string = '';

  @Output() action = new EventEmitter<void>();

  onClick() {
    this.action.emit();
  }
}
