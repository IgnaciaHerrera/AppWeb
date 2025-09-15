import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcedimientosPage } from './procedimientos.page';

describe('ProcedimientosPage', () => {
  let component: ProcedimientosPage;
  let fixture: ComponentFixture<ProcedimientosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
