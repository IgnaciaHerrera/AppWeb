import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabMorePage } from './tab-more.page';

describe('TabMorePage', () => {
  let component: TabMorePage;
  let fixture: ComponentFixture<TabMorePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabMorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
