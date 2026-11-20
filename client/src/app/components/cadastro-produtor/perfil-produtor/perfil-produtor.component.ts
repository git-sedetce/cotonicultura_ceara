import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { CadastroAgricultorService } from '../../../services/cadastro-agricultor.service';

@Component({
  selector: 'app-perfil-produtor',
  standalone: false,
  templateUrl: './perfil-produtor.component.html',
  styleUrl: './perfil-produtor.component.css'
})
export class PerfilProdutorComponent implements OnInit, OnDestroy {
  readonly documentos = [
    { tipo: 'comprovante_cpf_cnpj', titulo: 'Documento de CPF/CNPJ' },
    { tipo: 'comprovante_residencia', titulo: 'Comprovante de residência' },
  ];
  produtor: any;
  cidades: any[] = [];
  anexosSelecionados: Record<string, File | null> = {};
  private camposAnexo: Record<string, HTMLInputElement> = {};
  areaAlgodao: number | null = null;
  carregando = true;
  salvando = false;
  solicitando = false;
  enviandoAnexo: string | null = null;
  carregandoAnexo: string | null = null;
  anexoExibido: { tipo: string; titulo: string; mimetype: string; url: string } | null = null;
  urlAnexoPdf: SafeResourceUrl | null = null;

  constructor(
    private agricultores: CadastroAgricultorService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.carregarPerfil();
    this.agricultores.getCitys('takecitys').subscribe({
      next: (cidades: any[]) => this.cidades = cidades,
      error: () => this.toastr.error('Não foi possível carregar os municípios.'),
    });
  }

  ngOnDestroy(): void {
    this.limparAnexoExibido();
  }

  carregarPerfil(): void {
    this.carregando = true;
    this.agricultores.perfilProdutor().subscribe({
      next: (produtor: any) => {
        this.produtor = produtor;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.toastr.error('Não foi possível carregar seu cadastro.');
      },
    });
  }

  salvarPerfil(): void {
    const camposEditaveis = [
      'nome', 'telefone', 'rg', 'endereco', 'cidade', 'nome_propriedade',
      'ponto_referencia', 'area_total', 'regime_cultivo', 'cadastro_adagri',
      'confirma_informacao', 'email_trabalhador', 'apelido_trabalhador',
      'tem_cadastro_adagri', 'uso_dados',
    ];
    const dados = Object.fromEntries(
      camposEditaveis.map((campo) => [campo, this.produtor[campo]]),
    );

    this.salvando = true;
    this.agricultores.atualizarPerfilProdutor(dados).subscribe({
      next: (produtor: any) => {
        this.produtor = produtor;
        this.salvando = false;
        this.toastr.success('Cadastro atualizado com sucesso.');
      },
      error: (error) => {
        this.salvando = false;
        this.toastr.error(error.error?.message ?? 'Não foi possível atualizar o cadastro.');
      },
    });
  }

  solicitarPedido(): void {
    if (this.areaAlgodao === null) return;

    this.solicitando = true;
    this.agricultores.solicitarSementes(this.areaAlgodao).subscribe({
      next: () => {
        this.areaAlgodao = null;
        this.solicitando = false;
        this.toastr.success('Pedido de sementes registrado com sucesso.');
        this.carregarPerfil();
      },
      error: (error) => {
        this.solicitando = false;
        this.toastr.error(error.error?.message ?? 'Não foi possível registrar o pedido.');
      },
    });
  }

  quantidadeSementes(): number {
    return Number(((Number(this.areaAlgodao) || 0) * 10.2).toFixed(2));
  }

  selecionarAnexo(tipo: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.camposAnexo[tipo] = input;
    this.anexosSelecionados[tipo] = input.files?.[0] ?? null;
  }

  nomeAnexo(tipo: string): string | null {
    return this.produtor.ass_agricultor_anexo?.find(
      (anexo: any) => anexo.tipo_anexo === tipo,
    )?.filename ?? null;
  }

  trocarAnexo(tipo: string): void {
    const arquivo = this.anexosSelecionados[tipo];
    if (!arquivo || this.enviandoAnexo) return;

    this.enviandoAnexo = tipo;
    this.agricultores.substituirAnexoProdutor(tipo, arquivo).subscribe({
      next: (resposta: any) => {
        const anexos = this.produtor.ass_agricultor_anexo ?? [];
        this.produtor.ass_agricultor_anexo = [
          ...anexos.filter((anexo: any) => anexo.tipo_anexo !== tipo),
          resposta.anexo,
        ];
        this.anexosSelecionados[tipo] = null;
        this.camposAnexo[tipo].value = '';
        this.enviandoAnexo = null;
        this.toastr.success('Documento substituído com sucesso.');
      },
      error: (error) => {
        this.enviandoAnexo = null;
        this.toastr.error(error.error?.message ?? 'Não foi possível substituir o documento.');
      },
    });
  }

  exibirAnexo(tipo: string, titulo: string): void {
    if (this.carregandoAnexo) return;

    this.carregandoAnexo = tipo;
    this.agricultores.pegarAnexoProdutor(tipo).subscribe({
      next: (resposta: any) => {
        const bytes = Uint8Array.from(atob(resposta.base64), (caractere) =>
          caractere.charCodeAt(0),
        );
        const url = URL.createObjectURL(
          new Blob([bytes], { type: resposta.mimetype }),
        );
        this.limparAnexoExibido();
        this.anexoExibido = {
          tipo,
          titulo,
          mimetype: resposta.mimetype,
          url,
        };
        this.urlAnexoPdf =
          resposta.mimetype === 'application/pdf'
            ? this.sanitizer.bypassSecurityTrustResourceUrl(url)
            : null;
        this.carregandoAnexo = null;
      },
      error: (error) => {
        this.carregandoAnexo = null;
        this.toastr.error(error.error?.message ?? 'Não foi possível exibir o documento.');
      },
    });
  }

  fecharAnexo(): void {
    this.limparAnexoExibido();
  }

  private limparAnexoExibido(): void {
    if (this.anexoExibido) URL.revokeObjectURL(this.anexoExibido.url);
    this.anexoExibido = null;
    this.urlAnexoPdf = null;
  }
}
