import { Component, OnInit } from '@angular/core';
import { Audit } from '../../../models/audit.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AnexoService } from '../../../services/anexo.service';
import { AuditService } from '../../../services/audit.service';
import { CadastroService } from '../../../services/cadastro.service';
import { Router } from '@angular/router';
import { CadastroAgricultorService } from '../../../services/cadastro-agricultor.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-list-farmes-dropouts',
  standalone: false,
  templateUrl: './list-farmes-dropouts.component.html',
  styleUrl: './list-farmes-dropouts.component.css'
})
export class ListFarmesDropoutsComponent implements OnInit {

  lista_regiao!: any[];
  lista_farmers: any[] = [];
  lista_filtrada: any[] = [];
  lista_cidade: any[] = [];

  searchFarmers: string = '';
  searchCidade: string = '';
  searchRegiao: string = '';
  searchPedidoAtendido: boolean | '' = '';
  searchAdagri: boolean | '' = '';
  numeroPedido: number | '' = '';

  registro!: Audit;
  profile_id!: any;
  user_name!: any;
  filtroFarmers: boolean = false;

  anexo_id!: number;
  mensagemArquivo: string = '';
  farmer_name!: string;
  use_data!: boolean;
  data_cadastro!: Date;

  formAnexo!: FormGroup;
  formFiltro!: FormGroup;
  formFarmer!: FormGroup;

  cpfAnexoId!: number;
  resAnexoId!: number;
  isImagem = false;
  isPdf = false;
  loadingArquivo: boolean = false;

  page: number = 1; // Página atual
  itemsPerPage: number = 10; // Itens por página

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private anexo: AnexoService,
    private auditService: AuditService,
    private serviceUser: CadastroService,
    private router: Router,
    private cadastroAgricultorService: CadastroAgricultorService,
  ) {}

  ngOnInit(): void {
    this.formFarmer = this.formBuilder.group({
      id: [''],
      nome: [''],
      telefone: [''],
      cpf_cnpj: [''],
      rg: [''],
      endereco: [''],
      cidade: [''],
      nome_propriedade: [''],
      ponto_referencia: [''],
      area_total: [''],
      area_algodao: [''],
      pedido_atendido: [''],
      sementes_recebidas: [''],
      regime_cultivo: [''],
      cadastro_adagri: [''],
      confirma_informacao: [''],
      email_trabalhador: [''],
      apelido_trabalhador: [''],
      tem_cadastro_adagri: [''],
      uso_dados: [''],
    });

    this.formFiltro = this.formBuilder.group({
      nome: [''],
      cidade: [''],
      regiao: [''],
      pedidoAtendido: [''],
      cadastroADAGRI: [''],
      dataInicio: [''],
      dataFim: [''],
    });

    this.formAnexo = this.formBuilder.group({
      id: [''],
      tipo_anexo: [''],
      mimetype: [''],
      filename: [''],
      path: [''],
      agricultor_id: [''],
      file: [null], // ← OBRIGATÓRIO
    });

    this.registro = new Audit();
    this.pegarCidades();
    this.pegarRegioes();
    this.loadUserData();
    this.getFarmers();

    this.formFiltro.valueChanges.subscribe(() => {
      this.filtrarUsuarios();
    });
  }

  pegarCidades() {
    this.cadastroAgricultorService.getCitys('takecitys').subscribe(
      (cityCE: any[]) => {
        // console.log('cityCE', cityCE)
        this.lista_cidade = cityCE;
      },
      (erro: any) => console.error('erro', erro),
    );
  }

  pegarRegioes() {
    this.cadastroAgricultorService.getRegiaos('takeregion').subscribe(
      (regiaoCE: any[]) => {
        // console.log('regiaoCE', regiaoCE)
        this.lista_regiao = regiaoCE;
      },
      (erro: any) => console.error('erro', erro),
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
    this.cadastroAgricultorService.agricultorRural(false).subscribe(
      (usr: any[]) => {
        this.lista_farmers = usr;
        this.lista_filtrada = usr; // inicia filtrada
        // console.log('lista_users', this.lista_farmers)
      },
      (erro: any) => console.error(erro),
    );
  }

  retornarPrograma(farmer: any) {
    this.cadastroAgricultorService
      .desistirPrograma({ status_farmer: true }, farmer.id)
      .subscribe((res) => {
        this.toastr.success(res.mensagem);
        this.getFarmers();
      });

    this.saveRegister(farmer.nome, 'Desistência do programa');
  }

  verAgricultores() {
      this.router.navigate(['/listfarmers']);
    }

  naoPossuiTermos(farmer: any): boolean {
    const anexos = farmer.ass_agricultor_anexo || [];

    const possuiDoacao = anexos.some(
      (a: any) => a.tipo_anexo === 'termo_doacao',
    );
    const possuiCompromisso = anexos.some(
      (a: any) => a.tipo_anexo === 'termo_compromisso',
    );

    return !(possuiDoacao && possuiCompromisso);
  }

  private normalize(value: any): string {
    return (value ?? '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  filtrarUsuarios(): void {
    const {
      nome,
      cidade,
      regiao,
      pedidoAtendido,
      cadastroADAGRI,
      dataInicio,
      dataFim,
    } = this.formFiltro.value;

    const termo = this.normalize(nome);

    this.lista_filtrada = this.lista_farmers.filter((farmer) => {
      const matchNome = this.normalize(farmer.nome).includes(termo);

      const matchCidade =
        !cidade || farmer?.ass_produtor_rural_cidade?.nome_municipio === cidade;

      const matchRegiao =
        !regiao ||
        farmer?.ass_produtor_rural_cidade?.ass_municipio_regiao?.nome ===
          regiao;

      const matchPedido =
        pedidoAtendido === '' || farmer?.pedido_atendido === pedidoAtendido;

      const matchADAGRI =
        cadastroADAGRI === '' || farmer?.tem_cadastro_adagri === cadastroADAGRI;

      /* 📅 FILTRO POR DATA DE CADASTRO */
      const dataCadastro = new Date(farmer.createdAt);

      const matchDataInicio =
        !dataInicio || dataCadastro >= new Date(dataInicio);

      const matchDataFim =
        !dataFim || dataCadastro <= new Date(`${dataFim}T23:59:59`);

      this.filtroFarmers = true;

      return (
        matchNome &&
        matchCidade &&
        matchRegiao &&
        matchPedido &&
        matchADAGRI &&
        matchDataInicio &&
        matchDataFim
      );
    });

    this.page = 1;
  }

  limparFiltros(): void {
    this.formFiltro.reset({
      nome: '',
      cidade: '',
      regiao: '',
      pedidoAtendido: '',
      cadastroADAGRI: '',
      dataInicio: '',
      dataFim: '',
    });
    this.lista_filtrada = [...this.lista_farmers];
    this.filtroFarmers = false;
    this.page = 1;
  }

  exibirTodos(): void {
    this.searchFarmers = '';
    this.searchCidade = '';
    this.searchRegiao = '';
    this.searchPedidoAtendido = '';
    this.searchAdagri = '';

    this.lista_filtrada = [...this.lista_farmers];
    this.page = 1;
  }

  exportarPlanilha(tipo: 'todos' | 'filtrados'): void {
    const dados = tipo === 'todos' ? this.lista_farmers : this.lista_filtrada;

    if (!dados || dados.length === 0) {
      this.toastr.warning('Nenhum dado para exportar');
      return;
    }

    const planilha = dados.map((farmer) => ({
      Pedido: farmer.pedido,
      Nome: farmer.nome,
      Telefone: farmer.telefone,
      CPF_CNPJ: farmer.cpf_cnpj,
      RG: farmer.rg,
      Endereço: farmer.endereco,
      Município: farmer.ass_produtor_rural_cidade?.nome_municipio ?? '',
      Região:
        farmer.ass_produtor_rural_cidade?.ass_municipio_regiao?.nome ?? '',
      Nome_Propriedade: farmer.nome_propriedade,
      Ponto_Referência: farmer.ponto_referencia,
      Area_Total: farmer.area_total,
      Area_Algodão: farmer.area_algodao,
      'Pedido Atendido': farmer.pedido_atendido ? 'Sim' : 'Não',
      Sementes_Recebidas: farmer.sementes_recebidas,
      Regime_Cultivo: farmer.regime_cultivo,
      Cadastro_adagri: farmer.cadastro_adagri,
      Email: farmer.email_trabalhador,
      Uso_de_dados: farmer.uso_dados,
      Apelido: farmer.apelido_trabalhador,
      Tem_Cadastro_Adagri: farmer.tem_cadastro_adagri,
      Data_Cadastro: farmer.createdAt,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(planilha);
    const workbook: XLSX.WorkBook = {
      Sheets: { Agricultores: worksheet },
      SheetNames: ['Agricultores'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const nomeArquivo =
      tipo === 'todos'
        ? 'agricultores_todos.xlsx'
        : 'agricultores_filtrados.xlsx';

    saveAs(blob, nomeArquivo);

    this.saveAudit('Exportação de planilha');
  }

  deletaFarmer(user: any) {
    this.cadastroAgricultorService
      .deleteAgricultor(user.id)
      .subscribe((res) => {
        this.toastr.success(res.mensagem);
        this.getFarmers();
      });

    this.saveRegister(user.nome, 'Exclusão de produtor rural');
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

  saveAudit(tipo: any): void {
    this.registro.tipo_acao = tipo;
    this.registro.acao = `O usuário ${this.user_name} Exportou uma planilha de agricultores`;
    this.auditService.cadastrarRegistros(this.registro).subscribe({
      next: (res: any) => {
        // console.log('registro', res)
      },
      error: (e) => this.toastr.error(e),
    });
  }
}
