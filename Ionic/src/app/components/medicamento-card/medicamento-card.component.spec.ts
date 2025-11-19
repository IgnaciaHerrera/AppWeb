import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MedicamentoCardComponent } from './medicamento-card.component';

describe('MedicamentoCardComponent', () => {
  let component: MedicamentoCardComponent;
  let fixture: ComponentFixture<MedicamentoCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MedicamentoCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicamentoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
