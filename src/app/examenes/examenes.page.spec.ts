import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamenesPage } from './examenes.page';

describe('ExamenesPage', () => {
  let component: ExamenesPage;
  let fixture: ComponentFixture<ExamenesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamenesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
