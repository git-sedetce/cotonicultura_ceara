import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuditService } from '../../../services/audit.service';

interface AuditUser {
  id: number;
  nome: string;
  user_email: string;
}

interface AuditRecord {
  tipo_acao: string;
  acao: string;
  createdAt: string;
  ass_audit_users?: AuditUser | null;
}

type CampoOrdenacao = 'createdAt' | 'usuario' | 'tipo_acao' | 'acao';
type DirecaoOrdenacao = 'asc' | 'desc';

@Component({
  selector: 'app-auditoria',
  standalone: false,
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.css',
})
export class AuditoriaComponent implements OnInit {
  registros: AuditRecord[] = [];
  registrosFiltrados: AuditRecord[] = [];
  usuarios: AuditUser[] = [];
  tiposAcao: string[] = [];

  dataInicio = '';
  dataFim = '';
  usuarioSelecionado = '';
  tipoAcaoSelecionado = '';
  carregando = true;
  page = 1;
  readonly itemsPerPage = 10;
  campoOrdenacao: CampoOrdenacao = 'createdAt';
  direcaoOrdenacao: DirecaoOrdenacao = 'desc';

  constructor(
    private auditService: AuditService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.auditService.pegarRegistros().subscribe({
      next: (registros: AuditRecord[]) => {
        this.registros = [...registros].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        this.usuarios = this.getUsuarios(this.registros);
        this.tiposAcao = [
          ...new Set(this.registros.map((registro) => registro.tipo_acao)),
        ].sort((a, b) => a.localeCompare(b, 'pt-BR'));
        this.aplicarFiltros();
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar registros de auditoria:', erro);
        this.toastr.error('Não foi possível carregar os registros de auditoria.');
        this.carregando = false;
      },
    });
  }

  aplicarFiltros(): void {
    this.page = 1;
    const inicio = this.dataInicio
      ? new Date(`${this.dataInicio}T00:00:00`)
      : null;
    const fim = this.dataFim ? new Date(`${this.dataFim}T23:59:59.999`) : null;

    this.registrosFiltrados = this.registros.filter((registro) => {
      const dataRegistro = new Date(registro.createdAt);
      const combinaDataInicio = !inicio || dataRegistro >= inicio;
      const combinaDataFim = !fim || dataRegistro <= fim;
      const combinaUsuario =
        !this.usuarioSelecionado ||
        String(registro.ass_audit_users?.id) === this.usuarioSelecionado;
      const combinaTipoAcao =
        !this.tipoAcaoSelecionado ||
        registro.tipo_acao === this.tipoAcaoSelecionado;

      return (
        combinaDataInicio &&
        combinaDataFim &&
        combinaUsuario &&
        combinaTipoAcao
      );
    });
    this.reordenarRegistros();
  }

  ordenarPor(campo: CampoOrdenacao): void {
    if (this.campoOrdenacao === campo) {
      this.direcaoOrdenacao =
        this.direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
    } else {
      this.campoOrdenacao = campo;
      this.direcaoOrdenacao = campo === 'createdAt' ? 'desc' : 'asc';
    }
    this.page = 1;
    this.reordenarRegistros();
  }

  selecionarCampoOrdenacao(campo: CampoOrdenacao): void {
    if (this.campoOrdenacao === campo) {
      return;
    }

    this.campoOrdenacao = campo;
    this.direcaoOrdenacao = campo === 'createdAt' ? 'desc' : 'asc';
    this.page = 1;
    this.reordenarRegistros();
  }

  alternarDirecaoOrdenacao(): void {
    this.direcaoOrdenacao =
      this.direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
    this.page = 1;
    this.reordenarRegistros();
  }

  limparFiltros(): void {
    this.dataInicio = '';
    this.dataFim = '';
    this.usuarioSelecionado = '';
    this.tipoAcaoSelecionado = '';
    this.aplicarFiltros();
  }

  async exportarPdf(tipo: 'todos' | 'filtrados'): Promise<void> {
    const registros =
      tipo === 'todos' ? this.registros : this.registrosFiltrados;

    if (registros.length === 0) {
      this.toastr.warning('Nenhum registro para exportar.');
      return;
    }

    try {
      const [{ jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
      ]);
      const documento = new jsPDF({ orientation: 'landscape' });
      const escopo = tipo === 'todos' ? 'Completa' : 'Filtrada';

      documento.setFontSize(16);
      documento.setFont('helvetica', 'bold');
      documento.text('Auditoria do sistema', 14, 16);
      documento.setFontSize(10);
      documento.setFont('helvetica', 'normal');
      documento.text(
        `Exportação ${escopo} - ${registros.length} registro(s)`,
        14,
        22,
      );
      documento.text(
        `Gerado em ${new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date())}`,
        documento.internal.pageSize.getWidth() - 14,
        22,
        { align: 'right' },
      );

      autoTable(documento, {
        startY: 28,
        head: [
          ['Data e hora', 'Usuário', 'E-mail', 'Tipo de ação', 'Registro da ação'],
        ],
        body: registros.map((registro) => [
          new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'medium',
          }).format(new Date(registro.createdAt)),
          registro.ass_audit_users?.nome || 'Usuário não identificado',
          registro.ass_audit_users?.user_email || '',
          registro.tipo_acao,
          registro.acao,
        ]),
        styles: {
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
        },
        headStyles: { fillColor: [13, 110, 253] },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 38 },
          2: { cellWidth: 48 },
          3: { cellWidth: 42 },
          4: { cellWidth: 'auto' },
        },
        margin: { left: 14, right: 14 },
        didDrawPage: () => {
          const pagina = documento.getNumberOfPages();
          const altura = documento.internal.pageSize.getHeight();
          documento.setFontSize(8);
          documento.text(
            `Página ${pagina}`,
            documento.internal.pageSize.getWidth() - 14,
            altura - 7,
            { align: 'right' },
          );
        },
      });

      documento.save(`auditoria_${tipo}.pdf`);
    } catch (erro) {
      console.error('Erro ao exportar registros de auditoria para PDF:', erro);
      this.toastr.error('Não foi possível gerar o arquivo PDF.');
    }
  }

  private getUsuarios(registros: AuditRecord[]): AuditUser[] {
    const usuarios = new Map<number, AuditUser>();

    for (const registro of registros) {
      const usuario = registro.ass_audit_users;
      if (usuario) {
        usuarios.set(usuario.id, usuario);
      }
    }

    return [...usuarios.values()].sort((a, b) =>
      a.nome.localeCompare(b.nome, 'pt-BR'),
    );
  }

  private reordenarRegistros(): void {
    const fatorDirecao = this.direcaoOrdenacao === 'asc' ? 1 : -1;

    this.registrosFiltrados.sort((a, b) => {
      if (this.campoOrdenacao === 'createdAt') {
        return (
          fatorDirecao *
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        );
      }

      const valorA =
        this.campoOrdenacao === 'usuario'
          ? a.ass_audit_users?.nome
          : a[this.campoOrdenacao];
      const valorB =
        this.campoOrdenacao === 'usuario'
          ? b.ass_audit_users?.nome
          : b[this.campoOrdenacao];

      return (
        fatorDirecao *
        (valorA ?? '').localeCompare(valorB ?? '', 'pt-BR', {
          numeric: true,
          sensitivity: 'base',
        })
      );
    });
  }
}
