import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Agricultor } from '../../models/agricultor.model';
import { ToastrService } from 'ngx-toastr';
import { CadastroAgricultorService } from '../../services/cadastro-agricultor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-produtor',
  standalone: false,
  templateUrl: './cadastro-produtor.component.html',
  styleUrl: './cadastro-produtor.component.css'
})
export class CadastroProdutorComponent implements OnInit {
  @ViewChild('formAgricultor') formAgricultor!: NgForm;
  agricultor!: Agricultor;
  city_list!: any[];

  constructor(
    private router: Router,
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
    console.log('agricultor', this.agricultor);
    this.cadastroAgricultorService.cadastrarAgricultor(this.agricultor).subscribe({
      next: (res: any) => {
        // console.log('res', res)
        this.toastr.success('Cadastro realizado com sucesso!');
        this.cadastroAgricultorService.setAgricultor(Number(res.id));
        this.formAgricultor.reset();
        // this.router.navigate(['/anexo'])
      },
      error: (e) => console.error('erro',e)//(this.toastr.error(e.message))
    });
    // this.saveRegister();
  }

}
