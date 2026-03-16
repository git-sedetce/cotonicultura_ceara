import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Agricultor } from '../../models/agricultor.model';
import { ToastrService } from 'ngx-toastr';
import { CadastroAgricultorService } from '../../services/cadastro-agricultor.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cadastro-produtor',
  standalone: false,
  templateUrl: './cadastro-produtor.component.html',
  styleUrl: './cadastro-produtor.component.css',
})
export class CadastroProdutorComponent implements OnInit {
  @ViewChild('formAgricultor') formAgricultor!: NgForm;
  @ViewChild('anexoCPFCNPJ') anexoCPFCNPJ!: ElementRef;
  @ViewChild('anexoResidencia') anexoResidencia!: ElementRef;
  agricultor!: Agricultor;
  comprovanteSelected: boolean = false;
  cpf_cnpjSelected: boolean = false;
  arquivoResidenciaInvalido = false;
  arquivoDocumentoInvalido = false;
  city_list!: any[];

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private cadastroAgricultorService: CadastroAgricultorService,
  ) {}

  ngOnInit(): void {
    this.agricultor = new Agricultor();
    this.getCity();
  }

  getCity() {
    this.cadastroAgricultorService.getCitys('takecitys').subscribe(
      (cityBr: any[]) => {
        // console.log('cityBr', cityBr)
        this.city_list = cityBr;
      },
      (erro: any) => console.error('erro', erro),
    );
  }

  consultaCPF(epf: any, form: any) {
    this.cadastroAgricultorService.consultarCPF(epf).subscribe((res: any) => {
      if (res.mensagem === 'CPF/CNPJ já cadastrado!') {
        this.toastr.error(res.mensagem);
        this.formAgricultor.reset();
      }
    });
  }

  consultaADAGRI(adagri: any, form: any) {
    this.cadastroAgricultorService
      .consultarADAGRI(adagri)
      .subscribe((res: any) => {
        if (res.mensagem === 'Cadastro ADAGRI já cadastrado!') {
          this.toastr.error(res.mensagem);
          this.formAgricultor.reset();
        }
      });
  }

  onCPFCNPJSelected() {
    this.arquivoDocumentoInvalido = false;
  }

  onComprovanteSelected() {
    this.arquivoResidenciaInvalido = false;
  }

  cadastrarAgricultor() {
    this.agricultor.sementes_recebidas = this.agricultor.area_algodao * 10;

    const cpfFile = this.anexoCPFCNPJ.nativeElement.files[0];
    const resFile = this.anexoResidencia.nativeElement.files[0];

    if (!cpfFile) {
      this.arquivoDocumentoInvalido = true;
      return;
    }

    if (!resFile) {
      this.arquivoResidenciaInvalido = true;
      return;
    }

    const formData = new FormData();

    formData.append('dados', JSON.stringify(this.agricultor));
    formData.append('cpf', cpfFile);
    formData.append('residencia', resFile);

    this.http
      .post(environment.apiUrl + 'registerCompleto', formData)
      .subscribe({
        next: () => {
          this.toastr.success('Cadastro realizado com sucesso!');
          this.formAgricultor.reset();
          this.router.navigate(['/home']);
        },
        error: (e) => this.toastr.error(e.error.message),
      });
  }
}
