import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ide } from './ide';

describe('Ide', () => {
  let component: Ide;
  let fixture: ComponentFixture<Ide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ide]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ide);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
