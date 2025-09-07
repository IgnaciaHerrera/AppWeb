import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonModal, IonItem,
  IonInput, IonSelect, IonSelectOption, IonDatetime,
  IonLabel, IonDatetimeButton, IonText
} from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonButtons, IonModal, IonItem,
    IonInput, IonSelect, IonSelectOption, IonDatetime,
    IonLabel, IonDatetimeButton, IonText  
  ],
})
export class Tab3Page {
  @ViewChild(IonModal) modal!: IonModal;

  nuevoPaciente = {
    nombre: '',
    apellido: '',
    rut: '',
    sexo: '',
    cumpleanos: '',
    tipoSangre: '',
    telefono: '',
    gmail: ''
  };

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.nuevoPaciente, 'confirm');
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      console.log('Paciente guardado:', event.detail.data);

    }
  }
}
