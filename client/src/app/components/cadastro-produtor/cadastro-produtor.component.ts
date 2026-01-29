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
  styleUrl: './cadastro-produtor.component.css'
})
export class CadastroProdutorComponent implements OnInit {
  @ViewChild('formAgricultor') formAgricultor!: NgForm;
  @ViewChild('anexoCPFCNPJ') anexoCPFCNPJ!: ElementRef;
  @ViewChild('anexoResidencia') anexoResidencia!: ElementRef;
  agricultor!: Agricultor;
  comprovanteSelected: boolean = false;
  cpf_cnpjSelected: boolean = false;
  city_list!: any[];

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private cadastroAgricultorService: CadastroAgricultorService
  ) { }

  ngOnInit(): void {
    this.agricultor = new Agricultor();
    this.getCity();
  }

  getCity(){
    this.cadastroAgricultorService.getCitys('takecitys').subscribe((cityBr: any[]) => {
      // console.log('cityBr', cityBr)
      this.city_list = cityBr;
    }, (erro: any) => console.error('erro', erro)
    );
  }

  consultaCPF(epf:any, form: any){
      this.cadastroAgricultorService.consultarCPF(epf).subscribe((res:any) =>{
        if(res.mensagem === 'CPF/CNPJ já cadastrado!'){
          this.toastr.error(res.mensagem)
          this.formAgricultor.reset();
        }
      })
    }

    consultaADAGRI(adagri:any, form: any){
      this.cadastroAgricultorService.consultarADAGRI(adagri).subscribe((res:any) =>{
        if(res.mensagem === 'Cadastro ADAGRI já cadastrado!'){
          this.toastr.error(res.mensagem)
          this.formAgricultor.reset();
        }
      })
    }

  cadastrarAgricultor(){
    this.cadastroAgricultorService.cadastrarAgricultor(this.agricultor).subscribe({
      next: (res: any) => {
        // console.log('res', res)
        this.onDocumentoUpload(res.id);
        this.onComprovanteUpload(res.id);
        this.toastr.success('Cadastro realizado com sucesso!');
        // this.cadastroAgricultorService.setAgricultor(Number(res.id));
        this.formAgricultor.reset();
        this.router.navigate(['/home'])
      },
      error: (e) => console.error('erro',e)//(this.toastr.error(e.message))
    });
    // this.saveRegister();
  }

  onCPFCNPJSelected(event: any): void {
    this.cpf_cnpjSelected = event.target.files.length > 0;
    // console.log('comprovanteSelected', this.comprovanteSelected);
  }

  //anexar arquivos
  onDocumentoUpload(id: any) {
    const imageDoc = this.anexoCPFCNPJ.nativeElement.files[0];
    const file = new FormData();
    file.append('file', imageDoc);
    file.append('id', id);
    //console.log('formData', file)
    //console.log('id', user_id)

    this.http.post(environment.apiUrl + 'anexoCPFCNPJ' + '/' + id, file).subscribe({
      next: (response: any) => {
        this.toastr.success('Comprovante de CPF/CNPJ anexado com sucesso!');
        console.log('resposta_anexo', response);
      },
      error: (e) => {
        this.toastr.error(e.error.message);
        console.log('resposta_anexo', e);
      },
    });
  }

  onComprovanteSelected(event: any): void {
    this.comprovanteSelected = event.target.files.length > 0;
    // console.log('comprovanteSelected', this.comprovanteSelected);
  }

  onComprovanteUpload(id: any) {
    const imageRes = this.anexoResidencia.nativeElement.files[0];
    const file = new FormData();
    file.append('file', imageRes);
    file.append('id', id);
    //console.log('formData', file)
    //console.log('id', user_id)

    this.http.post(environment.apiUrl + 'anexoResidencia' + '/' + id, file).subscribe({
      next: (response: any) => {
        this.toastr.success('Comprovante de Residência anexado com sucesso!');
        console.log('resposta_anexo', response);
      },
      error: (e) => {
        this.toastr.error(e.error.message);
        console.log('resposta_anexo', e);
      },
    });
  }

}
