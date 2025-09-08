import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab11',
  templateUrl: './tab11.page.html',
  styleUrls: ['./tab11.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
})
export class Tab11Page {
  tareas = [
    { name: 'Comprar insumos', done: false },
    { name: 'Revisar fichas', done: true },
  ];
}
