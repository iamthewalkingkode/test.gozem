import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDeliveryComponent } from './form-delivery.component';

describe('FormDeliveryComponent', () => {
  let component: FormDeliveryComponent;
  let fixture: ComponentFixture<FormDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDeliveryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
