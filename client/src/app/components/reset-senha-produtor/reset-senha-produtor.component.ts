import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CadastroService } from '../../services/cadastro.service';

@Component({
  selector: 'app-reset-senha-produtor',
  standalone: false,
  templateUrl: './reset-senha-produtor.component.html',
  styleUrl: './reset-senha-produtor.component.css',
})
export class ResetSenhaProdutorComponent implements OnInit {
  senha = '';
  confirmarSenha = '';
  salvando = false;

  constructor(
    private cadastro: CadastroService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    if (!this.cadastro.possuiTokenResetProdutor()) {
      this.router.navigate(['/firstlogin']);
    }
  }

  resetarSenha(): void {
    if (this.senha.length < 8 || this.senha !== this.confirmarSenha) return;

    this.salvando = true;
    this.cadastro.resetarSenhaProdutor(this.senha).subscribe({
      next: (resposta: any) => {
        this.salvando = false;
        this.toastr.success(resposta.message ?? 'Senha redefinida com sucesso.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.salvando = false;
        this.toastr.error(error.error?.message ?? error.message ?? 'Não foi possível redefinir a senha.');
      },
    });
  }
}
