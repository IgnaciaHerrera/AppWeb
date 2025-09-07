import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardContent, IonIcon, IonButton, IonButtons 
} from '@ionic/angular/standalone';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardContent, IonIcon, IonButton, IonButtons
  ],
})
export class Tab1Page implements AfterViewInit {
  resumenChart: any;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.createResumenChart();
  }

  goTo(path: string) {
    this.router.navigateByUrl(path, { replaceUrl: true });
  }

  createResumenChart() {
    this.resumenChart = new Chart("resumenChart", {
      type: 'bar',
      data: {
        labels: ['Grupo 1', 'Grupo 2', 'Grupo 3', 'Grupo 4'],
        datasets: [
          {
            label: 'Hombres',
            data: [30, 50, 20, 40],
            backgroundColor: 'green'
          },
          {
            label: 'Mujeres',
            data: [40, 70, 25, 60],
            backgroundColor: 'purple'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 10 } } }
        },
        scales: {
          x: { ticks: { font: { size: 10 } } },
          y: { ticks: { font: { size: 10 } } }
        }
      }
    });
  }
}
