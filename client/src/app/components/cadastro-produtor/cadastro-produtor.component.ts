import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Agricultor } from '../../models/agricultor.model';
import { ToastrService } from 'ngx-toastr';
import { CadastroAgricultorService } from '../../services/cadastro-agricultor.service';

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

  cadastrarAgricultor(){
    console.log('agricultor', this.agricultor);
    this.cadastroAgricultorService.cadastrarAgricultor(this.agricultor).subscribe({
      next: (res: any) => {
        // console.log('res', res)
        this.toastr.success('Cadastro realizado com sucesso!');
        this.formAgricultor.reset();
      },
      error: (e) => console.error('erro',e)//(this.toastr.error(e.message))
    });
    // this.saveRegister();
  }

}
