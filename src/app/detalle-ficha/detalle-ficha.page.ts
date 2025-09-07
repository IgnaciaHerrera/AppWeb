import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonCard, IonCardContent,
  IonButton, IonSelect, IonSelectOption, IonItem, IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-detalle-ficha',
  templateUrl: './detalle-ficha.page.html',
  styleUrls: ['./detalle-ficha.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton,
    IonCard, IonCardContent,
    IonButton, IonSelect, IonSelectOption,
    IonItem, IonLabel
  ]
})
export class DetalleFichaPage implements OnInit {
  paciente: any;
  opcionSeleccionada: string = ''; 

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const rut = this.route.snapshot.paramMap.get('rut');

    const pacientes = [
      { 
        nombre: 'Ignacia Pérez', rut: '21.618.632-5', edad: 25,
        tipoSangre: 'A+', telefono: '+56 9 8765 4321', correo: 'ignacia.herrera@gmail.com',
        critico: true, ultimaAtencion: '19/08/2025',
        consultas: [
          { titulo: 'Control Medicina General', detalle: 'Exámenes complementarios y tratamiento sintomático.', fecha: '19/08/2025' }
        ],
        medicamentos: [
          { titulo: 'Losartán 50mg', detalle: '1 comprimido cada 12 horas. Control de hipertensión arterial.', fecha: '28/06/2025' }
        ],
        enfermedades: [
          { titulo: 'Hipertensión Arterial', detalle: 'Tratamiento farmacológico con buen control. Última PA: 125/80 mmHg.', fecha: 'Junio 2025' }
        ],
        alergias: [
          { titulo: 'Penicilina', detalle: 'Reacción alérgica severa. Evitar derivados.', nivel: 'Alta', fecha: '15/03/2020' }
        ]
      },
      { 
        nombre: 'Matías González', rut: '19.456.789-2', edad: 32,
        tipoSangre: 'O-', telefono: '+56 9 1234 5678', correo: 'matias.gonzalez@gmail.com',
        critico: false, ultimaAtencion: '10/08/2025',
        consultas: [
          { titulo: 'Consulta de Urgencia', detalle: 'Cefalea intensa. Evaluación neurológica normal.', fecha: '15/07/2025' }
        ],
        medicamentos: [
          { titulo: 'Paracetamol 500mg', detalle: '1-2 comprimidos cada 8h según necesidad para dolor o fiebre.', fecha: '05/08/2025' }
        ],
        enfermedades: [
          { titulo: 'Migraña Crónica', detalle: 'Episodios frecuentes tratados con analgésicos.', fecha: '2024' }
        ],
        alergias: [
          { titulo: 'Polen de gramíneas', detalle: 'Rinitis alérgica estacional.', nivel: 'Media', fecha: '22/09/2021' }
        ]
      },
      { 
        nombre: 'Camila Rojas', rut: '17.234.567-8', edad: 28,
        tipoSangre: 'B+', telefono: '+56 9 2222 3333', correo: 'camila.rojas@gmail.com',
        critico: false, ultimaAtencion: '05/08/2025',
        consultas: [
          { titulo: 'Control Cardiología', detalle: 'Presión controlada con medicación. Próximo control en 3 meses.', fecha: '28/06/2025' }
        ],
        medicamentos: [
          { titulo: 'Omeprazol 20mg', detalle: '1 cápsula en ayunas, tratamiento por 4 semanas.', fecha: '19/08/2025' }
        ],
        enfermedades: [
          { titulo: 'Gastritis Crónica', detalle: 'Tratada. Control periódico con gastroenterología.', fecha: 'Marzo 2023' }
        ],
        alergias: []
      },
      { 
        nombre: 'Felipe Torres', rut: '22.987.654-1', edad: 40,
        tipoSangre: 'AB-', telefono: '+56 9 4444 5555', correo: 'felipe.torres@gmail.com',
        critico: true, ultimaAtencion: '01/08/2025',
        consultas: [
          { titulo: 'Control Medicina General', detalle: 'Chequeo general con exámenes solicitados.', fecha: '20/07/2025' }
        ],
        medicamentos: [
          { titulo: 'Atorvastatina 20mg', detalle: 'Uso diario para control de colesterol.', fecha: '12/07/2025' }
        ],
        enfermedades: [
          { titulo: 'Colesterol Alto', detalle: 'En tratamiento con estatinas.', fecha: '2023' }
        ],
        alergias: [
          { titulo: 'Mariscos', detalle: 'Reacción cutánea y malestar digestivo.', nivel: 'Baja', fecha: '2018' }
        ]
      }
    ];

    this.paciente = pacientes.find(p => p.rut === rut);
  }

  getIniciales(nombre: string): string {
    if (!nombre) return '';
    const partes = nombre.split(' ');
    return partes[0][0] + (partes[1] ? partes[1][0] : '');
  }
}
