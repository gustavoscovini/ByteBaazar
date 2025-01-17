import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterProductComponent } from './product-register.component';

describe('ProductRegisterComponent', () => {
  let component: RegisterProductComponent;
  let fixture: ComponentFixture<RegisterProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterProductComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
