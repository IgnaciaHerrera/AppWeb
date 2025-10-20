import { Component, Input } from '@angular/core';
import { IonIcon, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
  standalone: true,
  imports: [IonIcon]
})
export class ScrollToTopComponent {
  @Input() visible = false;
  @Input() content!: IonContent;

  async scrollToTop() {
    if (this.content) {
      await this.content.scrollToTop(500);
    }
  }
}
