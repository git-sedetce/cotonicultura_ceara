import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../models/user.model';
import { CadastroService } from '../../services/cadastro.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Audit } from '../../models/audit.model';
import { AuditService } from '../../services/audit.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  @ViewChild('formCadastroUser') formCadastroUser!: NgForm;
  user!: User;

  passwordPtn = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$';
  lista_sexec!: any[];
  sexec!: any;

  registro!: Audit;
  profile_id!: any;
  user_name!: any;
  authenticated: boolean = false;

  constructor(
    private serviceUser: CadastroService,
    private router: Router,
    private toastr: ToastrService,
    private auditService: AuditService,
  ) {}

  ngOnInit(): void {
    this.user = new User();
    this.listarSecretaria();

    this.registro = new Audit();
    this.loadUserData();
  }

  loadUserData() {
    const user = this.serviceUser.getUser();
    if (!user) return;

    this.profile_id = user._profile_id;
    this.registro.user_id = user._id;
    this.user_name = user._user_name;
    this.authenticated = true;
  }

  listarSecretaria() {
    this.serviceUser.pegar_secretaria('takeSexec').subscribe(
      (res: any) => {
        this.lista_sexec = res;
        // console.log(this.lista_sexec);
      },
      (erro: any) => console.error(erro),
    );
  }

  verificaEmail(email: any) {
    email = this.user.user_email?.split('@');
    //console.log('verificaEmail', email)
    if (email[1] != 'sde.ce.gov.br') {
      this.toastr.warning('Somente email @SDE podem ser cadastrados!');
      this.formCadastroUser.reset();
    }
  }

  consultaEmail(email: any, form: any) {
    this.serviceUser.consultarEmail(email).subscribe((res: any) => {
      if (res.mensagem === 'Email já cadastrado!') {
        this.toastr.error(res.mensagem);
        this.user.user_email = '';
      }
    });
  }

  saveUser(): void {
    if (this.authenticated === true) {
      const nome_usuario = this.user.user_email?.split('@', 1).toString();
      this.user.user_name = nome_usuario;
      this.user.user_password = this.serviceUser.CriptografarMD5(this.user.user_name);
      this.user.confirm_password = this.serviceUser.CriptografarMD5(this.user.user_name);
    } else {
      this.user.user_password = this.serviceUser.CriptografarMD5(this.user.user_password);
      this.user.confirm_password = this.serviceUser.CriptografarMD5(this.user.confirm_password);
      const nome_usuario = this.user.user_email?.split('@', 1).toString();
      this.user.user_name = nome_usuario;
    }

    this.serviceUser.cadastrar_users(this.user).subscribe({
      next: (res: any) => {
        this.user.id = res.id;
        this.toastr.success('Usuário cadastrado com sucesso!!!');
        this.router.navigate(['/login']);
        this.saveRegister(this.user.user_name, 'Cadastro de novo usuário');
      },
      error: (e: any) => {
        console.error(e);
        this.toastr.error('Problemas ao realizar o cadastro!');
        this.formCadastroUser.reset();
      },
    });
  }

  saveRegister(name: any, tipo: any): void {
    console.log('authenticated', this.authenticated);
    this.registro.tipo_acao = tipo;
    if (this.authenticated === true) {
      this.registro.acao = `O usuário ${name} foi cadastrado pelo usuário ${this.user_name}`;
    } else {
      this.registro.acao = `O usuário ${name} realizou seu próprio cadastro no sistema`;
    }
    this.auditService.cadastrarRegistros(this.registro).subscribe({
      next: (res: any) => {
        // console.log('registro', res)
      },
      error: (e) => console.error('e', e),
    });
  }
}
