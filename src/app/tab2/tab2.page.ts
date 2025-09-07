import { Component, AfterViewInit } from '@angular/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonFooter
} from '@ionic/angular/standalone';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonFooter
  ]
})
export class Tab2Page implements AfterViewInit {

  lineChart: any;
  barChart: any;

  constructor() {}

  ngAfterViewInit() {
    this.createLineChart();
    this.createBarChart();
  }

createLineChart() {
  this.lineChart = new Chart("lineChart", {
    type: 'line',
    data: {
      labels: ['Abril 1', 'Abril 15', 'Abril 30'],
      datasets: [
        {
          label: 'Pacientes 1',
          data: [18, 20, 30],
          borderColor: 'green',
          backgroundColor: 'rgba(0, 128, 0, 0.2)',
          tension: 0.3
        },
        {
          label: 'Pacientes 2',
          data: [25, 32, 45],
          borderColor: 'purple',
          backgroundColor: 'rgba(128, 0, 128, 0.2)',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, 
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            font: { size: 10 } 
          }
        }
      },
      scales: {
        x: {
          ticks: { font: { size: 10 } }
        },
        y: {
          ticks: { font: { size: 10 } }
        }
      }
    }
  });
}

createBarChart() {
  this.barChart = new Chart("barChart", {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Abr'],
      datasets: [
        {
          label: 'Femenino',
          data: [20, 30, 28, 18],
          backgroundColor: 'purple'
        },
        {
          label: 'Masculino',
          data: [10, 12, 14, 11],
          backgroundColor: 'green'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, 
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            font: { size: 10 }
          }
        }
      },
      scales: {
        x: {
          ticks: { font: { size: 10 } }
        },
        y: {
          ticks: { font: { size: 10 } }
        }
      }
    }
  });
}
}