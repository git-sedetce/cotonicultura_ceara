import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginUser } from '../../models/login-user.model';
import { ToastrService } from 'ngx-toastr';
import { CadastroService } from '../../services/cadastro.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  @ViewChild("formLogin") formLogin!: NgForm;
  loginUsers!: LoginUser;

  constructor(
    private serviceUser: CadastroService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loginUsers = new LoginUser()
  }

  verificaEmail(email: any){
    email = this.loginUsers.user_email?.split("@")
    //console.log('verificaEmail', email)
    if(email[1] != 'sde.ce.gov.br'){
      this.toastr.warning('Somente emaili @SDE!')
      this.formLogin.reset()
    }
  }

  login(): void {
    this.loginUsers.user_password = this.serviceUser.CriptografarMD5(this.loginUsers.user_password)
    // console.log('loginUser', this.loginUsers)
    this.serviceUser.login(this.loginUsers).subscribe({
      next: (res) => res,
      error: (e) => (this.toastr.error(e), this.formLogin.reset())
    })

  }

  gerarPin(){
    this.serviceUser.resetPin(this.loginUsers).subscribe(
      () =>{
        this.toastr.success('Verifique seu Email');
        this.formLogin.reset();
      },
      (error) => {
        this.toastr.error('Erro durante o processo', error.error.message);
        this.formLogin.reset();
      }
    );

  }

}
