import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CadastroService } from '../../services/cadastro.service';
import { FirstLoginComponent } from './first-login.component';

describe('FirstLoginComponent', () => {
  let component: FirstLoginComponent;
  let fixture: ComponentFixture<FirstLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirstLoginComponent],
      imports: [CommonModule, FormsModule],
      providers: [
        { provide: CadastroService, useValue: {} },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } },
        { provide: ToastrService, useValue: { error: jasmine.createSpy(), success: jasmine.createSpy() } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
