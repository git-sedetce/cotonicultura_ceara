import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Agricultor } from '../../models/agricultor.model';
import { ToastrService } from 'ngx-toastr';
import { CadastroAgricultorService } from '../../services/cadastro-agricultor.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

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

  cadastrarAgricultor() {
    this.agricultor.sementes_recebidas = this.agricultor.area_algodao * 10;

    if (!this.anexoCPFCNPJ?.nativeElement.files.length) {
    this.arquivoDocumentoInvalido = true;
    return;
  }

  if (!this.anexoResidencia?.nativeElement.files.length) {
    this.arquivoResidenciaInvalido = true;
    return;
  }
    this.cadastroAgricultorService
      .cadastrarAgricultor(this.agricultor)
      .subscribe({
        next: (res: any) => {
          // console.log('res', res)
          this.onDocumentoUpload(res.id);
          this.onComprovanteUpload(res.id);
          this.toastr.success('Cadastro realizado com sucesso!');
          // this.cadastroAgricultorService.setAgricultor(Number(res.id));
          this.formAgricultor.reset();
          this.router.navigate(['/home']);
        },
        error: (e) => this.toastr.error(e.error.message), //(console.error('erro', e))
      });
    // this.saveRegister();
  }

  onCPFCNPJSelected(event: any): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.arquivoDocumentoInvalido = true;
      return;
    }

    this.arquivoDocumentoInvalido = false;

    const arquivo = input.files[0];
  }

  //anexar arquivos
  onDocumentoUpload(id: any) {
    const imageDoc = this.anexoCPFCNPJ.nativeElement.files[0];
    if (!imageDoc) return;
    const file = new FormData();
    file.append('file', imageDoc);
    file.append('id', id);
    //console.log('formData', file)
    //console.log('id', user_id)

    this.http
      .post(environment.apiUrl + 'anexoCPFCNPJ' + '/' + id, file)
      .subscribe({
        next: (response: any) => {
          this.toastr.success('Comprovante de CPF/CNPJ anexado com sucesso!');
        },
        error: (e) => {
          this.toastr.error(e.error.message);
        },
      });
  }

  onComprovanteSelected(event: any): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.arquivoResidenciaInvalido = true;
      return;
    }

    this.arquivoResidenciaInvalido = false;

    const arquivo = input.files[0];
  }

  onComprovanteUpload(id: any) {
    const imageRes = this.anexoResidencia.nativeElement.files[0];
    if (!imageRes) return;
    const file = new FormData();
    file.append('file', imageRes);
    file.append('id', id);
    //console.log('formData', file)
    //console.log('id', user_id)

    this.http
      .post(environment.apiUrl + 'anexoResidencia' + '/' + id, file)
      .subscribe({
        next: (response: any) => {
          this.toastr.success('Comprovante de Residência anexado com sucesso!');
        },
        error: (e) => {
          this.toastr.error(e.error.message);
        },
      });
  }
}
