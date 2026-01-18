import { Component, OnInit } from '@angular/core';
import { Agricultor } from '../../../models/agricultor.model';
import { Audit } from '../../../models/audit.model';
import { CadastroAgricultorService } from '../../../services/cadastro-agricultor.service';
import { AuditService } from '../../../services/audit.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CadastroService } from '../../../services/cadastro.service';
declare var bootstrap: any;

@Component({
  selector: 'app-list-farmers',
  standalone: false,
  templateUrl: './list-farmers.component.html',
  styleUrl: './list-farmers.component.css'
})
export class ListFarmersComponent implements OnInit {

  lista_farmers!: any[];
  lista_cidade!: any[];
  lista_regiao!: any[];
  formFarmer!: FormGroup;
  farmerObj: Agricultor = new Agricultor();
  searchFarmers: string = '';
  searchCidade: string = '';
  searchRegiao: string = '';

  lista_filtrada: any[] = [];

  registro!: Audit;
  profile_id!: any;
  user_name!: any;

  page: number = 1; // Página atual
  itemsPerPage: number = 10; // Itens por página

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private auditService: AuditService,
    private serviceUser: CadastroService,
    private cadastroAgricultorService: CadastroAgricultorService
  ) { }

  ngOnInit(): void {
    this.formFarmer = this.formBuilder.group({
      id: [''],
      nome:[''],
      telefone:[''],
      cpf_cnpj:[''],
      rg:[''],
      endereco:[''],
      cidade:[''],
      nome_propriedade:[''],
      ponto_referencia:[''],
      area_total:[''],
      area_algodao:[''],
      regime_cultivo:[''],
      cadastro_adagri:[''],
      confirma_informação:[''],
    });

    this.registro = new Audit();
    this.pegarCidades();
    this.pegarRegioes();
    this.loadUserData();
    this.getFarmers();
  }

  pegarCidades(){
    this.cadastroAgricultorService.getCitys('takecitys').subscribe((cityCE: any[]) => {
      // console.log('cityCE', cityCE)
      this.lista_cidade = cityCE;
    }, (erro: any) => console.error('erro', erro)
    );
  }

  pegarRegioes(){
    this.cadastroAgricultorService.getRegiaos('takeregion').subscribe((regiaoCE: any[]) => {
      // console.log('regiaoCE', regiaoCE)
      this.lista_regiao = regiaoCE;
    }, (erro: any) => console.error('erro', erro)
    );
  }

  loadUserData() {
    const user = this.serviceUser.getUser();
    if (!user) return;

    this.profile_id = user._profile_id;
    this.registro.user_id = user._id;
    this.user_name = user._user_name;
  }

  getFarmers() {
    this.cadastroAgricultorService.agricultorRural('allFarmers').subscribe(
      (usr: any[]) => {
        this.lista_farmers = usr;
        this.lista_filtrada = usr; // inicia filtrada
        // console.log('lista_users', this.lista_farmers)
      },
      (erro: any) => console.error(erro)
    );
  }

  filtrarUsuarios() {
    this.lista_filtrada = this.lista_farmers.filter((user) => {
      const termo = this.searchFarmers.toLowerCase();

      const matchFarmer =
        user.nome.toLowerCase().includes(termo)

      const matchCidade =
        this.searchCidade === ''
          ? true
          : String(user.ass_produtor_rural_cidade.nome_municipio) === this.searchCidade;

      const matchRegiao =
        this.searchRegiao === ''
          ? true
          : user.ass_produtor_rural_cidade.ass_municipio_regiao.nome === this.searchRegiao;

      return matchFarmer && matchCidade && matchRegiao;
    });

    this.page = 1;
  }

  onEdit(user: any) {
    this.farmerObj.id = user.id;
    this.formFarmer.controls['nome'].setValue(user.nome);
    this.formFarmer.controls['telefone'].setValue(user.telefone);
    this.formFarmer.controls['cpf_cnpj'].setValue(user.cpf_cnpj);
    this.formFarmer.controls['rg'].setValue(user.rg);
    this.formFarmer.controls['endereco'].setValue(user.endereco);
    this.formFarmer.controls['cidade'].setValue(user.cidade);
    this.formFarmer.controls['nome_propriedade'].setValue(user.nome_propriedade);
    this.formFarmer.controls['ponto_referencia'].setValue(user.ponto_referencia);
    this.formFarmer.controls['area_total'].setValue(user.area_total);
    this.formFarmer.controls['area_algodao'].setValue(user.area_algodao);
    this.formFarmer.controls['regime_cultivo'].setValue(user.regime_cultivo);
    this.formFarmer.controls['cadastro_adagri'].setValue(user.cadastro_adagri);
    this.formFarmer.controls['confirma_informação'].setValue(user.confirma_informação);
  }
  updateFarmer() {
    this.farmerObj.nome = this.formFarmer.value.nome;
    this.farmerObj.telefone = this.formFarmer.value.telefone;
    this.farmerObj.cpf_cnpj = this.formFarmer.value.cpf_cnpj;
    this.farmerObj.rg = this.formFarmer.value.rg;
    this.farmerObj.endereco = this.formFarmer.value.endereco;
    this.farmerObj.cidade = this.formFarmer.value.cidade;
    this.farmerObj.nome_propriedade = this.formFarmer.value.nome_propriedade;
    this.farmerObj.ponto_referencia = this.formFarmer.value.ponto_referencia;
    this.farmerObj.area_total = this.formFarmer.value.area_total;
    this.farmerObj.area_algodao = this.formFarmer.value.area_algodao;
    this.farmerObj.regime_cultivo = this.formFarmer.value.regime_cultivo;
    this.farmerObj.cadastro_adagri = this.formFarmer.value.cadastro_adagri;

    this.cadastroAgricultorService
      .atualizarAgricultor(this.farmerObj, Number(this.farmerObj.id))
      .subscribe((res) => {
        this.toastr.success('Atualiação realizada com sucesso!!!');
        this.formFarmer.reset();
        this.getFarmers();

        // 🔥 Fechar modal
        const modalEl = document.getElementById('modalEdit');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
          modal.hide();
        }
      });

    // this.saveRegister(this.userObj.user_name, 'Alteração de dados do usuário');
  }
  deletaFarmer(user: any) {
    this.cadastroAgricultorService.deleteAgricultor(user.id).subscribe((res) => {
      this.toastr.success('Exclusão realizada com sucesso!!!');
      this.getFarmers();
    });

    // this.saveRegister(user.user_name, 'Exclusão de usuário');
  }



}
