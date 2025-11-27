import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonGrid, IonRow, IonCol, IonButton, IonIcon, IonList, IonItem, IonLabel, 
  IonFab, IonFabButton, IonFabList, IonModal, IonInfiniteScroll, 
  IonInfiniteScrollContent, IonInput, IonFooter, IonDatetime, IonPopover,
  ToastController, IonSpinner
} from '@ionic/angular/standalone';
import { FilterBarComponent } from '../components/filter-bar/filter-bar.component';
import { ScrollToTopComponent } from '../components/scroll-to-top/scroll-to-top.component';
import { CounterCardComponent } from '../components/counter-card/counter-card.component';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import { DeleteConfirmModalComponent } from '../components/delete-confirm-modal/delete-confirm-modal.component';
import { ExamenesPdfService } from '../services/examenes-pdf.service';
import { ApiService } from '../services/api.service';

interface ResultadoExamen {
  nombre: string;
  valor: string;
  unidad: string;
  rangoReferencia?: string;
  estado: 'normal' | 'alto' | 'bajo' | 'critico';
}

interface Examen {
  id: string;
  nombre: string;
  tipo: string;
  fecha: string; 
  resultados?: ResultadoExamen[];
  expanded: boolean;
}

interface Contadores {
  laboratorio: number;
  imagenologia: number;
}

type TipoOrden = 'recientes' | 'antiguas' | 'alfabetico-asc' | 'alfabetico-desc';
type TipoPeriodo = 'todos' | 'ultimo-mes' | 'ultimos-3-meses' | 'ultimos-6-meses' | 'este-anio';

@Component({
  selector: 'app-examenes',
  templateUrl: './examenes.page.html',
  styleUrls: ['./examenes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonGrid, IonRow, IonCol, IonButton, IonIcon, IonList, IonItem, IonLabel,
    IonFab, IonFabButton, IonFabList, IonModal, IonInfiniteScroll, 
    IonInfiniteScrollContent, IonInput, IonFooter, IonDatetime, IonPopover, IonSpinner,
    FilterBarComponent, ScrollToTopComponent, CounterCardComponent,
    MenuItemComponent, DeleteConfirmModalComponent
  ]
})
export class ExamenesPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll!: IonInfiniteScroll;

  // Scroll y Lazy Loading 
  showScrollButton = false;
  private scrollThreshold = 300;
  private itemsPorCarga = 10;
  private indiceActual = 0;
  private lastScrollTop = 0;
  private buffer = 200;

  // Datos y filtros 
  examenes: Examen[] = [];
  examenesFiltrados: Examen[] = [];
  examenesVisibles: Examen[] = [];
  ordenSeleccionado: TipoOrden = 'recientes';
  periodoSeleccionado: TipoPeriodo = 'todos';
  periodoSeleccionadoTexto = 'Todos';
  modalPeriodoAbierto = false;
  modalOrdenAbierto = false;

  // Contadores 
  contadores: Contadores = { laboratorio: 0, imagenologia: 0 };
  totalExamenesTexto: string = '';

  modalManualAbierto = false;
  modoEdicion = false;
  examenEditandoId: string | null = null;
  fechaFormateada = '';
  nuevoExamen: Partial<Examen> & { fechaISO?: string } = {
    nombre: '',
    tipo: '',
    fecha: '',
    fechaISO: '',
    resultados: []
  };

  // Modal subir archivo 
  modalSubirAbierto = false;
  selectedFile: File | null = null;
  cargandoPDF = false;

  //  Modal eliminar 
  modalEliminarAbierto = false;
  examenAEliminar: Examen | null = null;

  // FAB Menu 
  fabMenuActivado = false;

  constructor(
    private toastController: ToastController,
    private pdfService: ExamenesPdfService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.cargarExamenesDesdeBackend();
  }

  // CARGAR DESDE API
  private async cargarExamenesDesdeBackend() {
    try {
      console.log('Cargando exámenes desde API...');
      const response: any = await this.api.get('/examenes-completos');

      let datos: any = null;
      if (Array.isArray(response)) {
        datos = response;
      } else if (response && Array.isArray(response.data)) {
        datos = response.data;
      } else if (response && Array.isArray(response.body)) {
        datos = response.body;
      } else if (response && Array.isArray(response.items)) {
        datos = response.items;
      } else if (response && Array.isArray(response.examenes)) {
        datos = response.examenes;
      } else if (response && typeof response === 'object') {
        datos = [response];
      }

      if (!Array.isArray(datos)) {
        console.warn('API devolvió datos en formato inesperado, usando datos locales de prueba');
        this.inicializarDatosDePrueba();
      } else {
        this.examenes = datos.map((item: any, index: number) => ({
          id: String(item.id || item.idExamen || item._id || `temp_${Date.now()}_${index}`),
          nombre: item.nombre || item.name || 'Sin nombre',
          tipo: item.tipo || item.type || 'Sin tipo',
          fecha: item.fecha || item.fecha_registro || item.date || new Date().toISOString().split('T')[0],
          resultados: (item.resultados || item.results || []).map((r: any) => ({
            nombre: r.nombre || r.name || '',
            valor: r.valor || r.value || '',
            unidad: r.unidad || r.unit || '',
            rangoReferencia: r.rangoReferencia || r.rango_referencia || r.range || '',
            estado: (r.estado || r.status || 'normal') as 'normal' | 'alto' | 'bajo' | 'critico'
          })),
          expanded: false
        }));

        this.aplicarFiltroPeriodo();
        this.calcularContadores();
        this.cargarPrimerosExamenes();

        if (this.examenes.length === 0) {
          console.log('API devolvió un array vacío de exámenes');
        }
      }
    } catch (error: any) {
      console.error('Error al cargar exámenes desde API:', error);
      this.mostrarToast('No fue posible cargar exámenes desde el servidor, usando datos locales', 'warning');
      this.inicializarDatosDePrueba();
      this.aplicarFiltroPeriodo();
      this.calcularContadores();
      this.cargarPrimerosExamenes();
    }
  }

  private inicializarDatosDePrueba() {
    this.examenes = [
      {
        id: '1',
        nombre: 'Hemograma',
        tipo: 'Laboratorio',
        fecha: '2025-11-15',
        resultados: [
          { nombre: 'RBC', valor: '4.5', unidad: 'M/µL', estado: 'normal' }
        ],
        expanded: false
      }
    ];
  }

  agregarResultado() {
    if (!this.nuevoExamen.resultados) {
      this.nuevoExamen.resultados = [];
    }
    
    this.nuevoExamen.resultados.push({
      nombre: '',
      valor: '',
      unidad: '',
      rangoReferencia: '',
      estado: 'normal'
    });
  }

  eliminarResultado(index: number) {
    if (this.nuevoExamen.resultados) {
      this.nuevoExamen.resultados.splice(index, 1);
    }
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      'normal': 'Normal',
      'alto': 'Alto',
      'bajo': 'Bajo',
      'critico': 'Crítico'
    };
    return labels[estado] || 'Seleccionar';
  }

  // Editar examen
  editarExamen(examen: Examen) {
    this.modoEdicion = true;
    this.examenEditandoId = examen.id;
    
    const [año, mes, día] = examen.fecha.split('-').map(n => parseInt(n, 10));
    const fechaObj = new Date(año, mes - 1, día);
    
    this.nuevoExamen = {
      nombre: examen.nombre,
      tipo: examen.tipo,
      fecha: examen.fecha,
      fechaISO: examen.fecha,
      resultados: examen.resultados ? JSON.parse(JSON.stringify(examen.resultados)) : []
    };
    
    this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    this.modalManualAbierto = true;
  }

  // Confirmar eliminacion
  confirmarEliminar(examen: Examen) {
    this.examenAEliminar = examen;
    this.modalEliminarAbierto = true;
  }

  cerrarModalEliminar() {
    this.modalEliminarAbierto = false;
    this.examenAEliminar = null;
  }

  // Eliminar examen 
  async eliminarExamen() {
    if (!this.examenAEliminar) return;

    const id = this.examenAEliminar.id;
    
    try {

      const resultado: any = await this.api.delete(`/examenes-completos/${id}`);
      console.log('DELETE response:', resultado);

      await this.cargarExamenesDesdeBackend();
      this.cerrarModalEliminar();
      await this.mostrarToast('Examen eliminado correctamente', 'success');
    } catch (err: any) {
      console.error('Error eliminando examen en servidor:', err);

      const status = err?.status ?? 'unknown';
      const body = err?.error ?? err?.message ?? JSON.stringify(err);
      console.error('DELETE error status:', status);
      console.error('DELETE error body:', body);

      // Fallback local
      this.examenes = this.examenes.filter(e => e.id !== id);
      this.aplicarFiltroPeriodo();
      this.cerrarModalEliminar();
      await this.mostrarToast(`Examen eliminado correctamente`, 'success');
    }
  }

  // Lazy Loading 
  cargarPrimerosExamenes() {
    this.indiceActual = 0;
    this.examenesVisibles = [];
    this.cargarMasExamenes();
  }

  cargarMasExamenes() {
    const inicio = this.indiceActual;
    const fin = Math.min(inicio + this.itemsPorCarga, this.examenesFiltrados.length);
    if (inicio >= fin) return;

    const nuevos = this.examenesFiltrados.slice(inicio, fin);
    this.examenesVisibles = [...this.examenesVisibles, ...nuevos];
    this.indiceActual = fin;
  }

  onIonInfinite(event: any) {
    setTimeout(() => {
      this.cargarMasExamenes();
      event.target.complete();
      if (this.indiceActual >= this.examenesFiltrados.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  resetInfiniteScroll() {
    if (this.infiniteScroll) this.infiniteScroll.disabled = false;
  }

  // Scroll to Top 
  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const clientHeight = event.target.clientHeight;
    const nearBottom = scrollTop + clientHeight + this.buffer >= scrollHeight;
    const nearTop = scrollTop <= this.buffer;
    this.showScrollButton = scrollTop > this.scrollThreshold;

    if (scrollTop > this.lastScrollTop) {
      if (nearBottom && !this.infiniteScroll?.disabled && this.indiceActual < this.examenesFiltrados.length) {
        // Cargar más al bajar
      }
    } else if (nearTop && this.indiceActual > this.itemsPorCarga) {
      const nuevoInicio = Math.max(0, this.indiceActual - 2 * this.itemsPorCarga);
      this.examenesVisibles = this.examenesFiltrados.slice(nuevoInicio, nuevoInicio + this.itemsPorCarga);
      this.indiceActual = nuevoInicio + this.itemsPorCarga;
      if (this.infiniteScroll?.disabled) this.infiniteScroll.disabled = false;
    }

    this.lastScrollTop = Math.max(scrollTop, 0);
  }

  async scrollToTop() {
    await this.content.scrollToTop(500);
  }

  // Filtros y orden 
  abrirSelectorPeriodo() { this.modalPeriodoAbierto = true; }
  cerrarSelectorPeriodo() { this.modalPeriodoAbierto = false; }
  abrirSelectorOrden() { this.modalOrdenAbierto = true; }
  cerrarSelectorOrden() { this.modalOrdenAbierto = false; }

  seleccionarPeriodo(periodo: TipoPeriodo) {
    this.periodoSeleccionado = periodo;
    const textos: Record<TipoPeriodo, string> = {
      'todos': 'Todos',
      'ultimo-mes': 'Último mes',
      'ultimos-3-meses': 'Últimos 3 meses',
      'ultimos-6-meses': 'Últimos 6 meses',
      'este-anio': 'Este año'
    };
    this.periodoSeleccionadoTexto = textos[periodo];
    this.aplicarFiltroPeriodo();
    this.cerrarSelectorPeriodo();
  }

  seleccionarOrden(orden: TipoOrden) {
    this.ordenSeleccionado = orden;
    this.aplicarOrden();
    this.cerrarSelectorOrden();
    this.cargarPrimerosExamenes();
    this.resetInfiniteScroll();
  }

  aplicarFiltroPeriodo() {
    const ahora = new Date();
    let fechaLimite: Date | null = null;
    
    switch (this.periodoSeleccionado) {
      case 'ultimo-mes':
        fechaLimite = new Date(ahora.getFullYear(), ahora.getMonth() - 1, ahora.getDate());
        break;
      case 'ultimos-3-meses':
        fechaLimite = new Date(ahora.getFullYear(), ahora.getMonth() - 3, ahora.getDate());
        break;
      case 'ultimos-6-meses':
        fechaLimite = new Date(ahora.getFullYear(), ahora.getMonth() - 6, ahora.getDate());
        break;
      case 'este-anio':
        fechaLimite = new Date(ahora.getFullYear(), 0, 1);
        break;
      default:
        fechaLimite = null;
    }

    if (!fechaLimite) {
      this.examenesFiltrados = [...this.examenes];
    } else {
      this.examenesFiltrados = this.examenes.filter(examen => {
        const fecha = this.parsearFecha(examen.fecha);
        return fecha >= fechaLimite!;
      });
    }

    this.aplicarOrden();
    this.actualizarTotalExamenesTexto();
    this.cargarPrimerosExamenes();
    this.resetInfiniteScroll();
  }

  getOrdenLabel(): string {
    const labels: Record<TipoOrden, string> = {
      'recientes': 'Más recientes',
      'antiguas': 'Más antiguos',
      'alfabetico-asc': 'A-Z',
      'alfabetico-desc': 'Z-A'
    };
    return labels[this.ordenSeleccionado];
  }

  aplicarOrden(): void {
    switch (this.ordenSeleccionado) {
      case 'recientes':
        this.examenesFiltrados.sort((a, b) => 
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        break;
      case 'antiguas':
        this.examenesFiltrados.sort((a, b) => 
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
        break;
      case 'alfabetico-asc':
        this.examenesFiltrados.sort(
          (a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        );
        break;
      case 'alfabetico-desc':
        this.examenesFiltrados.sort(
          (a, b) => b.nombre.localeCompare(a.nombre, 'es', { sensitivity: 'base' })
        );
        break;
    }
  }

  parsearFecha(fecha: string): Date {
    const [anio, mes, dia] = fecha.split('-').map(n => parseInt(n));
    return new Date(anio, mes - 1, dia);
  }

  calcularContadores(): void {
    this.contadores = {
      laboratorio: this.examenes.filter(e => this.esLaboratorio(e.tipo)).length,
      imagenologia: this.examenes.filter(e => this.esImagenologia(e.tipo)).length
    };
  }

  actualizarTotalExamenesTexto() {
    const cantidad = this.examenesFiltrados.length;
    this.totalExamenesTexto =
      cantidad === 0
        ? 'No hay exámenes para este período'
        : cantidad === 1
        ? '1 examen disponible'
        : `${cantidad} exámenes disponibles`;
  }

  // FAB Menu Control 
  onFabOpen() {
    this.fabMenuActivado = true;
  }

  onFabClose() {
    this.fabMenuActivado = false;
  }

  cerrarFabMenu() {
    this.fabMenuActivado = false;
    const fabElement = document.querySelector('ion-fab') as any;
    if (fabElement && fabElement.activated) {
      fabElement.close();
    }
  }

  // Modal agregar/editar 
  abrirModalManual() { 
    this.modoEdicion = false;
    this.examenEditandoId = null;
    this.modalManualAbierto = true;
    this.cerrarFabMenu();
  }
  
  cerrarModalManual() { 
    this.modalManualAbierto = false; 
    this.modoEdicion = false;
    this.examenEditandoId = null;
    this.limpiarFormulario();
    this.cerrarFabMenu(); 
  }

  limpiarFormulario() {
    this.nuevoExamen = { 
      nombre: '', 
      tipo: '', 
      fecha: '',
      fechaISO: '',
      resultados: []
    };
    this.fechaFormateada = '';
    this.modoEdicion = false;
    this.examenEditandoId = null;
  }

  seleccionarTipo(tipo: string) {
    this.nuevoExamen.tipo = tipo;
  }

  onFechaChange(event: any) {
    if (event?.detail?.value) {
      this.nuevoExamen.fechaISO = event.detail.value;
      this.nuevoExamen.fecha = event.detail.value;
      
      const fechaObj = new Date(event.detail.value);
      this.fechaFormateada = fechaObj.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
  }

  esFormularioValido(): boolean {
    return !!(this.nuevoExamen.nombre?.trim() && this.nuevoExamen.tipo?.trim() && this.nuevoExamen.fecha);
  }

  // Guardar examen 
  async guardarExamen() {
    if (!this.esFormularioValido()) {
      this.mostrarToast('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    // Filtrar resultados vacios
    const resultadosValidos = this.nuevoExamen.resultados?.filter(r => 
      r.nombre.trim() !== '' || r.valor.trim() !== ''
    ) || [];

    const examenPayload = {
      nombre: this.nuevoExamen.nombre!.trim(),
      tipo: this.nuevoExamen.tipo!.trim(),
      fecha: this.nuevoExamen.fecha!.split('T')[0],
      resultados: resultadosValidos.map(r => ({
        nombre: r.nombre,
        valor: r.valor,
        unidad: r.unidad,
        rangoReferencia: r.rangoReferencia || '',
        estado: r.estado
      }))
    };

    try {
      if (this.modoEdicion && this.examenEditandoId) {
        // EDITAR
        await this.api.put(`/examenes-completos/${this.examenEditandoId}`, examenPayload);
        console.log('Examen actualizado vía API');
        this.mostrarToast('Examen actualizado correctamente', 'success');
      } else {
        // CREAR NUEVO
        await this.api.post('/examenes-completos', examenPayload);
        console.log('Examen creado vía API');
        this.mostrarToast('Examen creado correctamente', 'success');
      }

      this.cerrarModalManual();
      this.limpiarFormulario();

      await this.cargarExamenesDesdeBackend();
    } catch (error: any) {
      console.error('Error al guardar examen en API:', error);

      if (this.modoEdicion && this.examenEditandoId) {
        const index = this.examenes.findIndex(e => e.id === this.examenEditandoId);
        if (index !== -1) {
          this.examenes[index] = {
            ...this.examenes[index],
            nombre: examenPayload.nombre,
            tipo: examenPayload.tipo,
            fecha: examenPayload.fecha,
            resultados: examenPayload.resultados as any
          };
        }
        this.aplicarFiltroPeriodo();
        this.cerrarModalManual();
        this.limpiarFormulario();
        this.mostrarToast('Examen actualizado correctamente', 'success');
      } else {
        const nuevoExamen: Examen = {
          id: `temp_${Date.now()}`,
          nombre: examenPayload.nombre,
          tipo: examenPayload.tipo,
          fecha: examenPayload.fecha,
          resultados: examenPayload.resultados as any,
          expanded: false
        };
        this.examenes.push(nuevoExamen);
        this.aplicarFiltroPeriodo();
        this.cerrarModalManual();
        this.limpiarFormulario();
        this.mostrarToast('Examen creado correctamente', 'success');
      }
    }
  }

  // Modal subir archivo
  abrirModalSubir() { 
    this.modalSubirAbierto = true;
    this.cerrarFabMenu(); 
  }

  cerrarModalSubir() {
    this.modalSubirAbierto = false;
    this.selectedFile = null;
    if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
    this.cerrarFabMenu(); 
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeFile(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedFile = null;
    if (this.fileInput?.nativeElement) this.fileInput.nativeElement.value = '';
  }

  async validateFile(file: File): Promise<boolean> {
    // Validar tipo de archivo
    if (file.type !== 'application/pdf') {
      await this.mostrarToast('Solo se permiten archivos PDF', 'danger');
      return false;
    }
    
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      await this.mostrarToast('El archivo es muy grande. Máximo 10 MB', 'danger');
      return false;
    }
    
    return true;
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const esValido = await this.validateFile(file);
      
      if (esValido) {
        this.selectedFile = file;
      } else {
        this.selectedFile = null;
        input.value = '';
      }
    }
  }

  // Subir examen PDF 
  async subirExamen() {
    if (!this.selectedFile) {
      await this.mostrarToast('Por favor selecciona un archivo', 'warning');
      return;
    }

    this.cargandoPDF = true;
    try {
      console.log('Procesando PDF:', this.selectedFile.name);
      
      const examenExtraido = await this.pdfService.procesarPDF(this.selectedFile);
      
      // VALIDACIÓN 1: Nombre válido
      const nombreEsGenerico = !examenExtraido.nombre || 
                               examenExtraido.nombre === 'Examen de Laboratorio' ||
                               examenExtraido.nombre.trim() === '';
      
      // VALIDACIÓN 2: Resultados encontrados
      const tieneResultados = examenExtraido.resultados && 
                             examenExtraido.resultados.length > 0;
      
      // VALIDACIÓN 3: Fecha válida
      const fechaEsValida = examenExtraido.fecha && 
                           examenExtraido.fecha !== new Date().toISOString().split("T")[0];
      
      // Si falla alguna validación crítica
      if (nombreEsGenerico && !tieneResultados) {
        await this.mostrarToast('Este PDF no parece ser un examen médico válido. No se encontró información reconocible.', 'danger');
        this.cargandoPDF = false;
        return;
      }
      
      // Si no tiene resultados pero tiene nombre
      if (!tieneResultados) {
        await this.mostrarToast('No se encontraron resultados en este PDF. Verifica que sea un examen de laboratorio con valores numéricos.', 'danger');
        this.cargandoPDF = false;
        return;
      }
      
      // Si el nombre es genérico pero tiene resultados
      if (nombreEsGenerico && tieneResultados) {
        await this.mostrarToast(' No se pudo identificar el nombre del examen, pero se guardarán los resultados encontrados.', 'warning');
        // Continuar con el guardado
      }

      // Crear payload del examen
      const examenPayload = {
        nombre: examenExtraido.nombre,
        tipo: examenExtraido.tipo,
        fecha: examenExtraido.fecha,
        medico: examenExtraido.medico,
        resultados: examenExtraido.resultados.map(r => ({
          nombre: r.nombre,
          valor: r.valor,
          unidad: r.unidad,
          rangoReferencia: r.rangoReferencia,
          estado: r.estado
        }))
      };

      try {

        await this.api.post('/examenes-completos', examenPayload);
        console.log('Examen guardado vía API');
        await this.mostrarToast('Examen registrado correctamente', 'success');

        await this.cargarExamenesDesdeBackend();
      } catch (apiError) {
        console.warn('Error al guardar via API, guardando localmente:', apiError);

        const nuevoExamen: Examen = {
          id: `temp_${Date.now()}`,
          nombre: examenPayload.nombre,
          tipo: examenPayload.tipo,
          fecha: examenPayload.fecha,
          resultados: examenPayload.resultados as any,
          expanded: false
        };
        this.examenes.push(nuevoExamen);
        this.aplicarFiltroPeriodo();
        await this.mostrarToast('Examen registrado localmente (sin conexión)', 'warning');
      }

      this.cerrarModalSubir();
    } catch (error) {
      console.error('Error al procesar examen:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Invalid PDF') || error.message.includes('invalid')) {
          await this.mostrarToast('El archivo no es un PDF válido o está corrupto', 'danger');
        } else {
          await this.mostrarToast('Este PDF no tiene el formato de examen esperado. Intenta con otro archivo.', 'danger');
        }
      } else {
        await this.mostrarToast('Error inesperado al procesar el PDF. Intenta con otro archivo.', 'danger');
      }
    } finally {
      this.cargandoPDF = false;
    }
  }

  // Helpers 
  toggleExamen(e: Examen) { e.expanded = !e.expanded; }
  getExamenTypeClass(examen: Examen): string { return `tipo-${this.getTipoClass(examen.tipo)}`; }

  getTipoClass(tipo: string): string {
    if (this.esLaboratorio(tipo)) return 'laboratorio';
    if (this.esImagenologia(tipo)) return 'imagen';
    return 'laboratorio';
  }

  getTipoIcon(tipo: string): string {
    if (this.esLaboratorio(tipo)) return 'flask-outline';
    if (this.esImagenologia(tipo)) return 'scan-outline';
    return 'document-text-outline';
  }

  esLaboratorio(tipo: string): boolean {
    return tipo.toLowerCase().includes('laboratorio') || tipo.toLowerCase().includes('sangre');
  }

  esImagenologia(tipo: string): boolean {
    return tipo.toLowerCase().includes('imagen') ||
           tipo.toLowerCase().includes('radiografía') ||
           tipo.toLowerCase().includes('ecografía') ||
           tipo.toLowerCase().includes('tomografía') ||
           tipo.toLowerCase().includes('resonancia');
  }

  formatFecha(f: string): string {
    const [y, m, d] = f.split('-').map(n => parseInt(n));
    return new Date(y, m - 1, d).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  async mostrarToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({ 
      message, 
      duration: 2500, 
      position: 'top', 
      color 
    });
    await toast.present();
  }
}