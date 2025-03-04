import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncrptComponent } from './encrpt.component';

describe('EncrptComponent', () => {
  let component: EncrptComponent;
  let fixture: ComponentFixture<EncrptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncrptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncrptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
