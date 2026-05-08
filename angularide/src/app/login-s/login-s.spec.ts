import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginS } from './login-s';

describe('LoginS', () => {
  let component: LoginS;
  let fixture: ComponentFixture<LoginS>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginS);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
