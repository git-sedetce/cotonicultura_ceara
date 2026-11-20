import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { PerfilProdutorComponent } from './perfil-produtor.component';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CadastroAgricultorService } from '../../../services/cadastro-agricultor.service';
import { of } from 'rxjs';

describe('PerfilProdutorComponent', () => {
  let component: PerfilProdutorComponent;
  let fixture: ComponentFixture<PerfilProdutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilProdutorComponent],
      imports: [CommonModule, FormsModule],
      providers: [
        {
          provide: CadastroAgricultorService,
          useValue: {
            perfilProdutor: () => of({ ass_agricultor_distribuicao_sementes: [] }),
            getCitys: () => of([]),
          },
        },
        { provide: ToastrService, useValue: { error: jasmine.createSpy(), success: jasmine.createSpy() } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilProdutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
