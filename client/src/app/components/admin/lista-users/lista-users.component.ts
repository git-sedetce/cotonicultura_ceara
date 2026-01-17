import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CadastroService } from '../../../services/cadastro.service';
import { User } from '../../../models/user.model';
import { Audit } from '../../../models/audit.model';
import { AuditService } from '../../../services/audit.service';
declare var bootstrap: any;

@Component({
  selector: 'app-lista-users',
  standalone: false,
  templateUrl: './lista-users.component.html',
  styleUrl: './lista-users.component.css'
})
export class ListaUsersComponent implements OnInit {

  lista_users!: any[];
  lista_profile!: any[];
  lista_sexec!: any[];
  formUser!: FormGroup;
  userObj: User = new User();
  searchText: string = '';
  searchAtivo: string = '';
  searchSexec: string = '';

  lista_filtrada: any[] = [];

  registro!: Audit;
  profile_id!: any;
  user_name!: any;

  page: number = 1; // Página atual
  itemsPerPage: number = 10; // Itens por página

  constructor(
    private serviceUser: CadastroService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private auditService: AuditService
  ) {}

  ngOnInit(): void {
    this.formUser = this.formBuilder.group({
      id: [''],
      nome: [''],
      user_name: [''],
      user_email: [''],
      user_active: [],
      profile_id: [''],
      coord_id: [''],
      sexec_id: [''],
    });

    this.registro = new Audit();
    this.getUsers();
    this.pegarSecretaria();
    this.loadUserData();
  }

  loadUserData() {
    const user = this.serviceUser.getUser();
    if (!user) return;

    this.profile_id = user._profile_id;
    this.registro.user_id = user._id;
    this.user_name = user._user_name;
  }

  pegarSecretaria(){
    this.serviceUser.pegar_secretaria('takeSexec').subscribe((res:any) =>{
      this.lista_sexec = res;
      // console.log(this.lista_sexec);
    },
        (erro: any) => console.error(erro)
      );
  }

  getUsers() {
    this.serviceUser.pegar_users('allUser').subscribe(
      (usr: any[]) => {
        this.lista_users = usr;
        this.lista_filtrada = usr; // inicia filtrada
        console.log('lista_users', this.lista_users)
      },
      (erro: any) => console.error(erro)
    );
  }

  filtrarUsuarios() {
    this.lista_filtrada = this.lista_users.filter((user) => {
      const termo = this.searchText.toLowerCase();

      const matchTexto =
        user.name.toLowerCase().includes(termo) ||
        user.user_email.toLowerCase().includes(termo);

      const matchAtivo =
        this.searchAtivo === ''
          ? true
          : String(user.user_active) === this.searchAtivo;

      const matchSexec =
        this.searchSexec === ''
          ? true
          : user.ass_users_coord.sigla === this.searchSexec;

      return matchTexto && matchAtivo && matchSexec;
    });

    this.page = 1;
  }

  onEdit(user: any) {
    this.userObj.id = user.id;
    this.formUser.controls['nome'].setValue(user.nome);
    this.formUser.controls['user_name'].setValue(user.user_name);
    this.formUser.controls['user_email'].setValue(user.user_email);
    this.formUser.controls['user_active'].setValue(user.user_active);
    this.formUser.controls['profile_id'].setValue(user.profile_id);
    this.formUser.controls['sexec_id'].setValue(user.sexec_id);
  }
  updateUser() {
    this.userObj.nome = this.formUser.value.name;
    this.userObj.user_name = this.formUser.value.user_name;
    this.userObj.user_email = this.formUser.value.user_email;
    this.userObj.user_active = this.formUser.value.user_active;
    this.userObj.profile_id = this.formUser.value.profile_id;
    this.userObj.sexec_id = this.formUser.value.sexec_id;

    this.serviceUser
      .atualizarUser(this.userObj, Number(this.userObj.id))
      .subscribe((res) => {
        this.toastr.success('Atualiação realizada com sucesso!!!');
        this.formUser.reset();
        this.getUsers();

        // 🔥 Fechar modal
        const modalEl = document.getElementById('modalEdit');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
          modal.hide();
        }
      });

    this.saveRegister(this.userObj.user_name, 'Alteração de dados do usuário');
  }
  deletaUser(user: any) {
    this.serviceUser.deleteUser(user.id).subscribe((res) => {
      this.toastr.success('Exclusão realizada com sucesso!!!');
      this.getUsers();
    });

    this.saveRegister(user.user_name, 'Exclusão de usuário');
  }

  saveRegister(name: any, tipo: any): void {
    this.registro.tipo_acao = tipo;
    this.registro.acao = `O usuário ${name} teve seus dados alterados pelo usuário ${this.user_name}`;
    this.auditService.cadastrarRegistros(this.registro).subscribe({
      next: (res: any) => {
        // console.log('registro', res)
      },
      error: (e) => this.toastr.error(e),
    });
  }

}
