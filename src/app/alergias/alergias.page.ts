import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
  IonBadge, IonButton, IonFab, IonFabButton, IonModal, IonInput,
  IonFooter, IonTextarea, IonSelect, IonSelectOption, IonDatetime, IonPopover,
  ToastController
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';

interface Alergia {
  id: string;
  nombre: string;
  descripcion: string;
  grado: 'leve' | 'moderado' | 'severo';
  fechaRegistro: string; 
  expanded: boolean;
}

type TipoOrden = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';

@Component({
  selector: 'app-alergias',
  templateUrl: './alergias.page.html',
  styleUrls: ['./alergias.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonIcon, IonGrid, IonRow, IonCol,
    IonBadge, IonButton, IonFab, IonFabButton, IonModal, IonInput,
    IonFooter, IonTextarea, IonSelect, IonSelectOption, IonDatetime, IonPopover
  ]
})
export class AlergiasPage implements OnInit {

  alergias: Alergia[] = [];
  modalAbierto = false;

  fechaMaxima = new Date().toISOString();
  fechaFormateada = '';

  ordenSeleccionado: TipoOrden = 'recientes';

  nuevaAlergia: Partial<Alergia> = {
    nombre: '',
    descripcion: '',
    grado: 'leve',
    fechaRegistro: new Date().toISOString().split('T')[0] // YYYY-MM-DD
  };

  constructor(private toastController: ToastController, private api: ApiService) {}

  ngOnInit() {
    this.cargarAlergias();
  }

  async probarConexion() {
    console.log('Probando conexión simple...');
    this.mostrarToast('Iniciando prueba de conexión...', 'primary');
    
    try {
      const response = await this.api.get('/alergias');
      console.log('Conexión exitosa:', response);
      this.mostrarToast('Conexión exitosa!', 'success');
    } catch (error: any) {
      console.error('Error de conexión:', error);
      this.mostrarToast('Error: ' + (error.message || 'Sin conexión'), 'danger');
    }
  }

  recargarAlergias() {
    console.log('Recargando alergias...');
    this.cargarAlergias();
  }

  abrirModal() {
    console.log('Botón abrirModal clickeado');
    this.mostrarToast('Abriendo modal...', 'primary');
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  esFormularioValido(): boolean {
    return !!this.nuevaAlergia.nombre?.trim() && !!this.nuevaAlergia.descripcion?.trim();
  }

  async cargarAlergias() {
    try {
      console.log('Iniciando carga de alergias...');
      const response: any = await this.api.get('/alergias');
      
      console.log('RESPUESTA COMPLETA DE LA API:');
      console.log('- Tipo:', typeof response);
      console.log('- Contenido completo:', JSON.stringify(response, null, 2));
      console.log('- Es array directo?', Array.isArray(response));
      
      let datos = null;
      
      if (Array.isArray(response)) {
        console.log('La respuesta es directamente un array');
        datos = response;
      } else if (response && Array.isArray(response.data)) {
        console.log('Encontrado array en response.data');
        datos = response.data;
      } else if (response && Array.isArray(response.body)) {
        console.log('Encontrado array en response.body');
        datos = response.body;
      } else if (response && Array.isArray(response.items)) {
        console.log('Encontrado array en response.items');
        datos = response.items;
      } else if (response && Array.isArray(response.alergias)) {
        console.log('Encontrado array en response.alergias');
        datos = response.alergias;
      } else {
        console.log('No se encontró un array en la respuesta');
        console.log('Estructura completa:', Object.keys(response || {}));
        
        if (response && typeof response === 'object' && !Array.isArray(response)) {
          console.log('Convirtiendo objeto único a array');
          datos = [response];
        } else {
          console.log('No se pudo procesar la respuesta');
          datos = [];
        }
      }
      
      console.log('DATOS FINALES A PROCESAR:');
      console.log('- Tipo:', typeof datos);
      console.log('- Es array?', Array.isArray(datos));
      console.log('- Cantidad de elementos:', datos?.length || 0);
      console.log('- Contenido:', JSON.stringify(datos, null, 2));
      
      if (!Array.isArray(datos)) {
        console.error('FALLO CRÍTICO: Los datos finales no son un array');
        this.alergias = [];
        this.mostrarToast('Error: Formato de respuesta inválido de la API');
        return;
      }
      
      this.alergias = datos.map((item: any, index: number) => {
        console.log(`Procesando elemento ${index + 1}/${datos.length}:`, item);
        
        const alergia = {
          id: item.id?.toString() || item._id?.toString() || `temp_${Date.now()}_${index}`,
          nombre: item.nombre || item.name || 'Sin nombre',
          descripcion: item.descripcion || item.description || 'Sin descripción',
          grado: (item.grado || item.grade || 'leve') as 'leve' | 'moderado' | 'severo',
          fechaRegistro: item.fechaRegistro || item.fecha_registro || item.date || new Date().toISOString().split('T')[0],
          expanded: false
        };
        
        console.log(`Elemento ${index + 1} procesado:`, alergia);
        return alergia;
      });
      
      this.aplicarOrden();
      
      console.log('RESULTADO FINAL:');
      console.log(`- Total alergias cargadas: ${this.alergias.length}`);
      console.log('- Lista final:', this.alergias);
      
      if (this.alergias.length === 0) {
        this.mostrarToast('No hay alergias registradas', 'warning');
      } else {
        this.mostrarToast(`${this.alergias.length} alergias cargadas correctamente`, 'success');
      }
      
    } catch (error: any) {
      console.error('ERROR AL CARGAR ALERGIAS:');
      console.error('- Error completo:', error);
      console.error('- Status:', error.status);
      console.error('- Message:', error.message);
      console.error('- URL:', error.url);
      
      this.alergias = [];
      
      let errorMessage = 'Error al cargar alergias';
      if (error.status === 0) {
        errorMessage = 'Sin conexión con el servidor';
      } else if (error.status === 404) {
        errorMessage = 'Endpoint /alergias no encontrado';
      } else if (error.status >= 500) {
        errorMessage = 'Error interno del servidor';
      }
      
      this.mostrarToast(errorMessage, 'danger');
    }
  }

  async guardarAlergia() {
    if (!this.esFormularioValido()) {
      this.mostrarToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    try {
      console.log('INICIANDO GUARDADO DE NUEVA ALERGIA');
      
      const payload = {
        nombre: this.nuevaAlergia.nombre?.trim(),
        descripcion: this.nuevaAlergia.descripcion?.trim(),
        grado: this.nuevaAlergia.grado || 'leve',
        fechaRegistro: this.nuevaAlergia.fechaRegistro || new Date().toISOString().split('T')[0]
      };
      
      console.log('PAYLOAD A ENVIAR:', JSON.stringify(payload, null, 2));
      console.log('URL completa:', 'https://clc8mu24re.execute-api.us-east-1.amazonaws.com/alergias');
      
      const resultado: any = await this.api.post('/alergias', payload);
      
      console.log('RESPUESTA DEL POST:');
      console.log('- Tipo:', typeof resultado);
      console.log('- Contenido completo:', JSON.stringify(resultado, null, 2));
      
      this.cerrarModal();
      this.nuevaAlergia = {
        nombre: '',
        descripcion: '',
        grado: 'leve',
        fechaRegistro: new Date().toISOString().split('T')[0]
      };

      console.log('POST EXITOSO - Mostrando mensaje de éxito');
      this.mostrarToast('Alergia guardada exitosamente', 'success');
      
      console.log('RECARGANDO TODAS LAS ALERGIAS DESDE LA BD...');
      await this.cargarAlergias();
      
    } catch (error: any) {
      console.error('ERROR AL GUARDAR ALERGIA:');
      console.error('- Error completo:', error);
      console.error('- Status:', error.status);
      console.error('- Message:', error.message);
      console.error('- URL:', error.url);
      console.error('- Response body:', error.error);
      
      let errorMessage = 'Error al crear alergia';
      if (error.status === 0) {
        errorMessage = 'Sin conexión con el servidor';
      } else if (error.status === 400) {
        errorMessage = 'Datos inválidos - verifica la información';
      } else if (error.status === 404) {
        errorMessage = 'Endpoint /alergias no encontrado';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      }
      
      this.mostrarToast(errorMessage, 'danger');
    }
  }

  async mostrarToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    await toast.present();
  }

  aplicarOrden(): void {
    switch (this.ordenSeleccionado) {
      case 'recientes':
        this.alergias.sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime());
        break;
      case 'antiguas':
        this.alergias.sort((a, b) => new Date(a.fechaRegistro).getTime() - new Date(b.fechaRegistro).getTime());
        break;
      case 'alfabetico-asc':
        this.alergias.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
        break;
      case 'alfabetico-desc':
        this.alergias.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es', { sensitivity: 'base' }));
        break;
    }
  }

  toggleAlergia(alergia: Alergia): void {
    alergia.expanded = !alergia.expanded;
  }

  getOrdenLabel(): string {
    const labels: Record<TipoOrden, string> = {
      'recientes': 'Más recientes',
      'antiguas': 'Más antiguas',
      'alfabetico-asc': 'Alfabético (A-Z)',
      'alfabetico-desc': 'Alfabético (Z-A)'
    };
    return labels[this.ordenSeleccionado];
  }

  getAlergiaGradeClass(alergia: Alergia): string {
    return `grade-${alergia.grado}`;
  }

  getBadgeColor(alergia: Alergia): string {
    switch (alergia.grado) {
      case 'leve': return 'success';
      case 'moderado': return 'warning';
      case 'severo': return 'danger';
      default: return 'medium';
    }
  }

  getGradeLabel(grado: string): string {
    switch (grado) {
      case 'leve': return 'Leve';
      case 'moderado': return 'Moderado';
      case 'severo': return 'Severo';
      default: return 'Sin clasificar';
    }
  }

  getSeverityDescription(grado: string): string {
    switch (grado) {
      case 'leve': return 'Reacción leve';
      case 'moderado': return 'Reacción moderada';
      case 'severo': return 'Reacción severa';
      default: return 'Sin clasificar';
    }
  }

  getSeverityIcon(grado: string): string {
    switch (grado) {
      case 'leve': return 'checkmark-circle-outline';
      case 'moderado': return 'warning-outline';
      case 'severo': return 'alert-circle-outline';
      default: return 'help-circle-outline';
    }
  }

  onFechaChange(event: any) {
    if (event?.detail?.value) {
      this.nuevaAlergia.fechaRegistro = event.detail.value.split('T')[0];
    }
  }
}
