import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonIcon,
  IonFab, IonFabButton, IonModal, IonInput, IonButton, IonFooter,
  ToastController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.page.html',
  styleUrls: ['./datos-personales.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonIcon,
    IonFab, IonFabButton, IonModal, IonInput, IonButton, IonFooter
  ]
})
export class DatosPersonalesPage implements OnInit {
  
  telefono: string = '+56 9 1234 5678';
  email: string = 'maria.rodriguez@gmail.com';
  
  telefonoTemp: string = '';
  emailTemp: string = '';
  
  isModalOpen: boolean = false;

  constructor(private toastController: ToastController) {}

  ngOnInit() {}

  abrirModalEdicion() {
    // Cargamos los valores actuales en las variables temporales
    this.telefonoTemp = this.telefono;
    this.emailTemp = this.email;
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  async guardarCambios() {
    // Validaciones básicas
    if (!this.telefonoTemp.trim()) {
      await this.mostrarToast('El teléfono es requerido', 'warning');
      return;
    }

    if (!this.emailTemp.trim()) {
      await this.mostrarToast('El email es requerido', 'warning');
      return;
    }

    if (!this.validarEmail(this.emailTemp)) {
      await this.mostrarToast('Ingrese un email válido', 'warning');
      return;
    }

    // Guardamos los cambios
    this.telefono = this.telefonoTemp;
    this.email = this.emailTemp;
    
    // Cerramos el modal
    this.cerrarModal();
    
    // Mostramos mensaje de éxito
    await this.mostrarToast('Datos actualizados correctamente', 'success');
  }

  private validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async mostrarToast(mensaje: string, tipo: 'success' | 'warning') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: tipo === 'success' ? 'success' : 'warning'
    });
    toast.present();
  }
}