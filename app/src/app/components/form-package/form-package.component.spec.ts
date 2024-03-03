import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPackageComponent } from './form-package.component';

describe('FormPackageComponent', () => {
  let component: FormPackageComponent;
  let fixture: ComponentFixture<FormPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPackageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
