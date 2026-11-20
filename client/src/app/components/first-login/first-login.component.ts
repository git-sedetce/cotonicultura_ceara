import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CadastroService } from '../../services/cadastro.service';

@Component({
  selector: 'app-first-login',
  standalone: false,
  templateUrl: './first-login.component.html',
  styleUrl: './first-login.component.css'
})
export class FirstLoginComponent {
  cpf = '';
  pin = '';
  senha = '';
  validando = false;

  constructor(
    private cadastro: CadastroService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  validarPrimeiroAcesso(): void {
    const cpf = this.cpf.replace(/\D/g, '');
    const senha = this.senha.replace(/\D/g, '');
    if (cpf.length !== 11 || senha !== cpf) {
      this.toastr.error('Informe um CPF válido e use esse CPF como senha inicial.');
      return;
    }

    this.validando = true;
    this.cadastro.primeiroAcessoProdutor({
      cpf,
      pin: this.pin.trim(),
      user_password: this.cadastro.CriptografarMD5(senha),
    }).subscribe({
      next: () => {
        this.validando = false;
        this.toastr.success('Validação concluída. Cadastre uma nova senha.');
        this.router.navigate(['/resetSenhaProdutor']);
      },
      error: (error) => {
        this.validando = false;
        this.toastr.error(error.error?.message ?? 'Não foi possível validar o primeiro acesso.');
      },
    });
  }
}
