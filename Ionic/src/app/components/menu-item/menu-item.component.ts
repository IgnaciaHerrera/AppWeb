import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonPopover, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon,
    IonPopover,
    IonContent,
    IonList,
    IonItem,
    IonLabel
  ]
})
export class MenuItemComponent {
  @Input() itemId!: string;
  @Input() showEdit = true;
  @Input() showDelete = true;
  @Input() editLabel = 'Editar';
  @Input() deleteLabel = 'Eliminar';
  
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();

  handleEdit() {
    this.onEdit.emit();
  }

  handleDelete() {
    this.onDelete.emit();
  }
}