import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleFichaPage } from './detalle-ficha.page';

describe('DetalleFichaPage', () => {
  let component: DetalleFichaPage;
  let fixture: ComponentFixture<DetalleFichaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleFichaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
