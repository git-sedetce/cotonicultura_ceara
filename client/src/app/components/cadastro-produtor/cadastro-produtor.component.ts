import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Agricultor } from '../../models/agricultor.model';

@Component({
  selector: 'app-cadastro-produtor',
  standalone: false,
  templateUrl: './cadastro-produtor.component.html',
  styleUrl: './cadastro-produtor.component.css'
})
export class CadastroProdutorComponent implements OnInit {
  @ViewChild('formAgricultor') formAgricultor!: NgForm;
  agricultor!: Agricultor;

  constructor() { }

  ngOnInit(): void {
    this.agricultor = new Agricultor();
  }

  cadastrarAgricultor(){
    // this.industriaService.cadastrarEmpresa(this.empresa).subscribe({
    //   next: (res: any) => {
    //     // console.log('empresa', res)
    //     this.toastr.success('Cadastro da empresa realizado com sucesso!');
    //     this.formEmpresa.reset();
    //     this.cadastroFdi(res.id)
    //   },
    //   error: (e) => console.error('erro',e)//(this.toastr.error(e.message))
    // })
    // this.saveRegister();
  }

}
