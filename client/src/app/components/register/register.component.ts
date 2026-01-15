import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  @ViewChild("formCadastroUser") formCadastroUser!: NgForm;
  user!: User

  passwordPtn = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$";
  lista_sexec!: any[];
  sexec!:any;

  constructor() { }

  ngOnInit(): void {
    this.user = new User();
  }

  verificaEmail(email:any){
    console.log(email);
      // this.serviceUser.consultarEmail(email).subscribe((res:any) =>{
      //   if(res.mensagem === 'Email já cadastrado!'){
      //     this.toastr.error(res.mensagem)
      //     this.users.user_email = '';
      //   }
      // })
    }

    saveUser(): void {
      // this.users.user_password = this.serviceUser.CriptografarMD5(this.users.user_password)
      // this.users.user_confirm_password = this.serviceUser.CriptografarMD5(this.users.user_confirm_password)
      // const nome_usuario = this.users.user_email?.split("@",1).toString();
      // this.users.user_name = nome_usuario;
      // this.serviceUser.cadastrar_users(this.users).subscribe({
      //   next: (res:any) => {
      //     this.users.id = res.id
      //     this.toastr.success('Usuário cadastrado com sucesso!!!')
      //     this.router.navigate(['/login'])
      //   },
      //   error:(e: any) => {
      //     console.error(e)
      //     this.toastr.error('Problemas ao realizar o cadastro!')
      //     this.formCadastroUser.reset()
      //   }
      // })
    }

}
