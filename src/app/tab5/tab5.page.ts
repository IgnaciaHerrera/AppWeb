import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardContent, IonIcon, IonButton, IonButtons, IonAccordion, IonAccordionGroup, IonItem, IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardContent, IonIcon, IonButton, IonButtons, IonAccordion, IonAccordionGroup, IonItem, IonLabel
  ],
})
export class Tab5Page implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  goTo(path: string) {
    this.router.navigateByUrl(path, { replaceUrl: true });
  }
  goPacientes() {
  this.router.navigate(['/pacientes-actuales']);

}};