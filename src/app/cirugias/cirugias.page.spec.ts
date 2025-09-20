import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CirugiasPage } from './cirugias.page';

describe('CirugiasPage', () => {
  let component: CirugiasPage;
  let fixture: ComponentFixture<CirugiasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CirugiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
