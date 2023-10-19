import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormDialogComponentComponent } from './user-form-dialog-component.component';

describe('UserFormDialogComponentComponent', () => {
  let component: UserFormDialogComponentComponent;
  let fixture: ComponentFixture<UserFormDialogComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserFormDialogComponentComponent]
    });
    fixture = TestBed.createComponent(UserFormDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
