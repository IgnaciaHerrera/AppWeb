import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlergiasPage } from './alergias.page';

describe('AlergiasPage', () => {
  let component: AlergiasPage;
  let fixture: ComponentFixture<AlergiasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlergiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
