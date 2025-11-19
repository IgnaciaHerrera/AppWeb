import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonModal, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-delete-confirm-modal',
  templateUrl: './delete-confirm-modal.component.html',
  styleUrls: ['./delete-confirm-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonModal,
    IonButton,
    IonIcon
  ]
})
export class DeleteConfirmModalComponent {
  @Input() isOpen = false;
  @Input() itemName = '';
  @Input() title = 'Eliminar elemento';
  @Input() message = '¿Estás seguro de eliminar';
  @Input() warningText = 'Esta acción no se puede deshacer.';
  @Input() cancelText = 'Cancelar';
  @Input() confirmText = 'Eliminar';
  
  @Output() onCancel = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();
  @Output() didDismiss = new EventEmitter<void>();

  handleCancel() {
    this.onCancel.emit();
  }

  handleConfirm() {
    this.onConfirm.emit();
  }

  handleDismiss() {
    this.didDismiss.emit();
  }
}