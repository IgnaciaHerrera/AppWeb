import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CitaCardComponent } from './cita-card.component';

describe('CitaCardComponent', () => {
  let component: CitaCardComponent;
  let fixture: ComponentFixture<CitaCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CitaCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CitaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
