import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiagnosticosPage } from './diagnosticos.page';

describe('DiagnosticosPage', () => {
  let component: DiagnosticosPage;
  let fixture: ComponentFixture<DiagnosticosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
