import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../models/user.model';
import { CadastroService } from '../../services/cadastro.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-sexha',
  standalone: false,
  templateUrl: './reset-sexha.component.html',
  styleUrl: './reset-sexha.component.css'
})
export class ResetSexhaComponent implements OnInit {
  @ViewChild("formResetPassword") formResetPassword!: NgForm;
  resetSenha!: User;

  constructor(
    private serviceUser: CadastroService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.resetSenha = new User()
  }

  reset(): void {
    console.log('nova_senha',this.resetSenha)
    this.resetSenha.user_password = this.serviceUser.CriptografarMD5(this.resetSenha.user_password);
    this.serviceUser.reset_password(this.resetSenha).subscribe({
      next:(res:any) => {
        console.log('res',res)
        this.toastr.success('Senha alterada com sucesso!!!')
        this.router.navigate(['/login'])
      },error: (e) => {
        console.error(e)
        this.toastr.error(e.error.message)
        this.formResetPassword.reset()
      }
    })
  }

}
