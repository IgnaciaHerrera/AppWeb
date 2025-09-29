import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonIcon,
  IonGrid, IonRow, IonCol, IonItem, IonLabel, IonList
} from '@ionic/angular/standalone';
import { FichaItemComponent } from '../components/ficha-item/ficha-item.component';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardContent, IonIcon,
    IonGrid, IonRow, IonCol, IonItem, IonLabel, IonList,FichaItemComponent
  ],
})
export class Tab5Page implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  goTo(path: string) {
    this.router.navigateByUrl(path);
  }
}