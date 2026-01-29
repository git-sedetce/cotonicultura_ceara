import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Agricultor } from '../../../models/agricultor.model';
import { Audit } from '../../../models/audit.model';
import { CadastroAgricultorService } from '../../../services/cadastro-agricultor.service';
import { AuditService } from '../../../services/audit.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CadastroService } from '../../../services/cadastro.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AnexoService } from '../../../services/anexo.service';
import { Anexo } from '../../../models/anexo.model';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

declare var bootstrap: any;

@Component({
  selector: 'app-list-farmers',
  standalone: false,
  templateUrl: './list-farmers.component.html',
  styleUrl: './list-farmers.component.css',
})
export class ListFarmersComponent implements OnInit {
  @ViewChild('atualizaDocumento') atualizaDocumento!: ElementRef;
  @ViewChild('atualizaComprovante') atualizaComprovante!: ElementRef;
  anexoObj: Anexo = new Anexo();

  lista_regiao!: any[];
  lista_farmers: any[] = [];
  lista_filtrada: any[] = [];
  lista_cidade: any[] = [];

  farmerObj: Agricultor = new Agricultor();
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
  farmer_name!: string;
  use_data!: boolean;
  data_cadastro!: Date;

  formAnexo!: FormGroup;
  formFiltro!: FormGroup;
  formFarmer!: FormGroup;
  arquivoUrl: SafeResourceUrl | null = null;
  arquivoCpfUrl: SafeResourceUrl | null = null;
  arquivoResidenciaUrl: SafeResourceUrl | null = null;
  cpfIsImagem = false;
  cpfIsPdf = false;

  resIsImagem = false;
  resIsPdf = false;

  cpfAnexoId!: number;
  resAnexoId!: number;
  isImagem = false;
  isPdf = false;

  page: number = 1; // Página atual
  itemsPerPage: number = 10; // Itens por página

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
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
    this.cadastroAgricultorService.agricultorRural('allFarmers').subscribe(
      (usr: any[]) => {
        this.lista_farmers = usr;
        this.lista_filtrada = usr; // inicia filtrada
        // console.log('lista_users', this.lista_farmers)
      },
      (erro: any) => console.error(erro),
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
  }

  anexarArquivo(id: number) {
    this.cadastroAgricultorService.setAgricultor(Number(id));
    this.router.navigate(['/anexo']);
  }

  onEdit(farmer: any) {
    this.farmerObj.id = farmer.id;
    this.numeroPedido = farmer.pedido;
    this.formFarmer.controls['nome'].setValue(farmer.nome);
    this.formFarmer.controls['apelido_trabalhador'].setValue(
      farmer.apelido_trabalhador,
    );
    this.formFarmer.controls['email_trabalhador'].setValue(
      farmer.email_trabalhador,
    );
    this.formFarmer.controls['telefone'].setValue(farmer.telefone);
    this.formFarmer.controls['cpf_cnpj'].setValue(farmer.cpf_cnpj);
    this.formFarmer.controls['rg'].setValue(farmer.rg);
    this.formFarmer.controls['endereco'].setValue(farmer.endereco);
    this.formFarmer.controls['cidade'].setValue(farmer.cidade);
    this.formFarmer.controls['nome_propriedade'].setValue(
      farmer.nome_propriedade,
    );
    this.formFarmer.controls['ponto_referencia'].setValue(
      farmer.ponto_referencia,
    );
    this.formFarmer.controls['area_total'].setValue(farmer.area_total);
    this.formFarmer.controls['area_algodao'].setValue(farmer.area_algodao);
    this.formFarmer.controls['regime_cultivo'].setValue(farmer.regime_cultivo);
    this.formFarmer.controls['cadastro_adagri'].setValue(
      farmer.cadastro_adagri,
    );
    this.formFarmer.controls['confirma_informacao'].setValue(
      farmer.confirma_informacao,
    );
    this.formFarmer.controls['sementes_recebidas'].setValue(
      farmer.sementes_recebidas,
    );
    this.formFarmer.controls['pedido_atendido'].setValue(
      farmer.pedido_atendido,
    );
    this.formFarmer.controls['uso_dados'].setValue(farmer.uso_dados);
    this.formFarmer.controls['tem_cadastro_adagri'].setValue(
      farmer.tem_cadastro_adagri,
    );
  }
  updateFarmer() {
    this.farmerObj.nome = this.formFarmer.value.nome;
    this.farmerObj.apelido_trabalhador =
      this.formFarmer.value.apelido_trabalhador;
    this.farmerObj.email_trabalhador = this.formFarmer.value.email_trabalhador;
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
    this.farmerObj.confirma_informacao =
      this.formFarmer.value.confirma_informacao;
    this.farmerObj.sementes_recebidas =
      this.formFarmer.value.sementes_recebidas;
    this.farmerObj.pedido_atendido = this.formFarmer.value.pedido_atendido;
    this.farmerObj.uso_dados = this.formFarmer.value.uso_dados;
    this.farmerObj.tem_cadastro_adagri =
      this.formFarmer.value.tem_cadastro_adagri;

    this.cadastroAgricultorService
      .atualizarAgricultor(this.farmerObj, Number(this.farmerObj.id))
      .subscribe((res) => {
        this.toastr.success('Atualiação realizada com sucesso!!!');
        this.formFarmer.reset();
        this.getFarmers();

        // 🔥 Fechar modal
        const modalEl = document.getElementById('modalEdit');
        if (modalEl) {
          const modal =
            bootstrap.Modal.getInstance(modalEl) ||
            new bootstrap.Modal(modalEl);
          modal.hide();
        }
      });

    this.saveRegister(this.farmerObj.nome, 'Alteração de dados do agricultor');
  }

  resetVisualizacao(tipo: string) {
    if (tipo === 'comprovante_cpf_cnpj') {
      this.arquivoCpfUrl = null;
      this.cpfIsImagem = false;
      this.cpfIsPdf = false;
    }

    if (tipo === 'comprovante_residencia') {
      this.arquivoResidenciaUrl = null;
      this.resIsImagem = false;
      this.resIsPdf = false;
    }
  }

  getFile(farmer: any, tipo_anexo: string): void {
    this.resetVisualizacao(tipo_anexo);
    this.anexo.pegarArquivos(farmer.id, tipo_anexo).subscribe(
      (data: any) => {
        this.anexo_id = data.id_anexo;
        this.farmer_name = farmer.nome;

        const byteCharacters = atob(data.base64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], { type: data.mimetype });
        const fileURL = URL.createObjectURL(blob);

        this.arquivoUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);

        // Flag para controle no HTML
        this.isImagem = data.mimetype.startsWith('image/');
        this.isPdf = data.mimetype === 'application/pdf';
      },
      (error) => {
        console.error('Erro ao carregar arquivo:', error.error?.message);
      },
    );
  }

  updateDocumento() {
    const newRegister = this.atualizaDocumento.nativeElement.files[0];
    const novoDocumento = new FormData();
    novoDocumento.append('file', newRegister);

    // console.log('novoDocumento', novoDocumento)

    this.anexo.atualizAnexo(novoDocumento, this.anexo_id).subscribe({
      next: (res: any) => {
        this.toastr.success('Certificado atualizado com sucesso!!!');
        const myModal = bootstrap.Modal.getInstance(
          document.getElementById('modalDocumento') as HTMLElement,
        );
        if (myModal) {
          myModal.hide();
        }
        this.formAnexo.reset();
      },
      error: (e) => {
        console.error(e);
        this.toastr.error(e.error.message);
        this.formAnexo.reset();
      },
    });
    this.saveRegister(this.farmer_name, 'Atualização de documento');
  }

  updateComprovante() {
    const newRegister = this.atualizaComprovante.nativeElement.files[0];
    const novoAnexo = new FormData();
    novoAnexo.append('file', newRegister);

    // console.log('novoAnexo', novoAnexo)

    this.anexo.atualizAnexo(novoAnexo, this.anexo_id).subscribe({
      next: (res: any) => {
        this.toastr.success(
          'Comprovante de residência atualizado com sucesso!!!',
        );
        const myModal = bootstrap.Modal.getInstance(
          document.getElementById('modalResidencia') as HTMLElement,
        );
        if (myModal) {
          myModal.hide();
        }
        this.formAnexo.reset();
      },
      error: (e) => {
        console.error(e);
        this.toastr.error(e.error.message);
        this.formAnexo.reset();
      },
    });
    this.saveRegister(this.farmer_name, 'Atualização de comprovante');
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
}
