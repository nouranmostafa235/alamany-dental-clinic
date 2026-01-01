import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingApointment } from './pending-apointment';

describe('PendingApointment', () => {
  let component: PendingApointment;
  let fixture: ComponentFixture<PendingApointment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingApointment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingApointment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
