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

  lista_regiao!: any[];
  lista_farmers: any[] = [];
  lista_filtrada: any[] = [];
  lista_cidade: any[] = [];

  formFarmer!: FormGroup;
  farmerObj: Agricultor = new Agricultor();
  searchFarmers: string = '';
  searchCidade: string = '';
  searchRegiao: string = '';
  searchPedidoAtendido: boolean | '' = '';
  numeroPedido: number | '' = '';

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
      pedido_atendido: [''],
      sementes_recebidas:[''],
      regime_cultivo:[''],
      cadastro_adagri:[''],
      confirma_informacao:[''],
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

  private normalize(value: any): string {
  return (value ?? '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

  filtrarUsuarios(): void {
  const termo = this.normalize(this.searchFarmers);

  this.lista_filtrada = (this.lista_farmers || []).filter((farmer) => {

    const matchNome =
      this.normalize(farmer.nome).includes(termo);

    const matchCidade =
      !this.searchCidade ||
      farmer?.ass_produtor_rural_cidade?.nome_municipio === this.searchCidade;

    const matchRegiao =
      !this.searchRegiao ||
      farmer?.ass_produtor_rural_cidade?.ass_municipio_regiao?.nome === this.searchRegiao;

    const matchPedido =
      this.searchPedidoAtendido === '' ||
      farmer?.pedido_atendido === this.searchPedidoAtendido;

    return matchNome && matchCidade && matchRegiao && matchPedido;
  });

  this.page = 1;
}

exibirTodos(): void {
  this.searchFarmers = '';
  this.searchCidade = '';
  this.searchRegiao = '';
  this.searchPedidoAtendido = '';

  this.lista_filtrada = [...this.lista_farmers];
  this.page = 1;
}



  onEdit(farmer: any) {
    this.farmerObj.id = farmer.id;
    this.numeroPedido = farmer.pedido;
    this.formFarmer.controls['nome'].setValue(farmer.nome);
    this.formFarmer.controls['telefone'].setValue(farmer.telefone);
    this.formFarmer.controls['cpf_cnpj'].setValue(farmer.cpf_cnpj);
    this.formFarmer.controls['rg'].setValue(farmer.rg);
    this.formFarmer.controls['endereco'].setValue(farmer.endereco);
    this.formFarmer.controls['cidade'].setValue(farmer.cidade);
    this.formFarmer.controls['nome_propriedade'].setValue(farmer.nome_propriedade);
    this.formFarmer.controls['ponto_referencia'].setValue(farmer.ponto_referencia);
    this.formFarmer.controls['area_total'].setValue(farmer.area_total);
    this.formFarmer.controls['area_algodao'].setValue(farmer.area_algodao);
    this.formFarmer.controls['regime_cultivo'].setValue(farmer.regime_cultivo);
    this.formFarmer.controls['cadastro_adagri'].setValue(farmer.cadastro_adagri);
    this.formFarmer.controls['confirma_informacao'].setValue(farmer.confirma_informacao);
    this.formFarmer.controls['sementes_recebidas'].setValue(farmer.sementes_recebidas);
    this.formFarmer.controls['pedido_atendido'].setValue(farmer.pedido_atendido);
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
    this.farmerObj.confirma_informacao = this.formFarmer.value.confirma_informacao;
    this.farmerObj.sementes_recebidas = this.formFarmer.value.sementes_recebidas;
    this.farmerObj.pedido_atendido = this.formFarmer.value.pedido_atendido;

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

    this.saveRegister(this.farmerObj.nome, 'Alteração de dados do agricultor');
  }
  deletaFarmer(user: any) {
    this.cadastroAgricultorService.deleteAgricultor(user.id).subscribe((res) => {
      this.toastr.success('Exclusão realizada com sucesso!!!');
      this.getFarmers();
    });

    this.saveRegister(user.user_name, 'Exclusão de usuário');
  }

  saveRegister(name: any, tipo: any): void {
    this.registro.tipo_acao = tipo;
    this.registro.acao = `O usuário ${this.user_name} alterou os dados do agricultor ${name}`;
    this.auditService.cadastrarRegistros(this.registro).subscribe({
      next: (res: any) => {
        // console.log('registro', res)
      },
      error: (e) => this.toastr.error(e),
    });
  }



}
