import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PacientesActualesPage } from './pacientes-actuales.page';

describe('PacientesActualesPage', () => {
  let component: PacientesActualesPage;
  let fixture: ComponentFixture<PacientesActualesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PacientesActualesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
