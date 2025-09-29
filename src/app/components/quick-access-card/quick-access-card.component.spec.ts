import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuickAccessCardComponent } from './quick-access-card.component';

describe('QuickAccessCardComponent', () => {
  let component: QuickAccessCardComponent;
  let fixture: ComponentFixture<QuickAccessCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [QuickAccessCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickAccessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
