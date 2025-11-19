import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HospitalizacionesPage } from './hospitalizaciones.page';

describe('HospitalizacionesPage', () => {
  let component: HospitalizacionesPage;
  let fixture: ComponentFixture<HospitalizacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalizacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
