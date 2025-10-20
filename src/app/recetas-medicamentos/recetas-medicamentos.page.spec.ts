import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecetasMedicamentosPage } from './recetas-medicamentos.page';

describe('RecetasMedicamentosPage', () => {
  let component: RecetasMedicamentosPage;
  let fixture: ComponentFixture<RecetasMedicamentosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecetasMedicamentosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
