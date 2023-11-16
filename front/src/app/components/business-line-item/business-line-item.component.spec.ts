import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessLineItemComponent } from './business-line-item.component';

describe('BusinessLineItemComponent', () => {
  let component: BusinessLineItemComponent;
  let fixture: ComponentFixture<BusinessLineItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessLineItemComponent]
    });
    fixture = TestBed.createComponent(BusinessLineItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
