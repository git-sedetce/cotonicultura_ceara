import { Component, OnInit, ViewChild } from '@angular/core';
import { Anexo } from '../../models/anexo.model';
import { CadastroAgricultorService } from '../../services/cadastro-agricultor.service';
import { CadastroService } from '../../services/cadastro.service';
import { Audit } from '../../models/audit.model';
import { AuditService } from '../../services/audit.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AnexoService } from '../../services/anexo.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-anexo',
  standalone: false,
  templateUrl: './anexo.component.html',
  styleUrl: './anexo.component.css',
})
export class AnexoComponent implements OnInit {
  @ViewChild('formAnexo') formAnexo: any;
  anexo!: Anexo;
  lista_farmers: any[] = [];
  arquivos_enviados: any[] = [];
  viewInputs: boolean = false;
  has_farmer: boolean = false;
  nomeAgricultor: string = '';

  registro!: Audit;
  profile_id!: any;
  user_name!: any;

  anexos: any = {
    // identidade: {
    //   label: 'Documento Oficial com Foto',
    //   accept: '.png,.jpg,.jpeg,.webp,.gif,.pdf',
    //   endpoint: 'anexoIdentidade',
    //   multiple: false,
    //   file: null,
    //   uploaded: false,
    //   error: '',
    // },
    cpf_cnpj: {
      label: 'CPF/CNPJ',
      accept: '.png,.jpg,.jpeg,.pdf',
      endpoint: 'anexoCPFCNPJ',
      multiple: false,
      file: null,
      uploaded: false,
      error: '',
    },
    residencia: {
      label: 'Comprovante de Residência',
      accept: 'application/pdf',
      endpoint: 'anexoResidencia',
      multiple: false,
      file: null,
      uploaded: false,
      error: '',
    },

    // propriedade: {
    //   label: 'Comprovante de Propriedade',
    //   accept: 'application/pdf',
    //   endpoint: 'anexoPropriedade',
    //   multiple: false,
    //   file: null,
    //   uploaded: false,
    //   error: '',
    // },
  };

  uploadedMap: any = {
  // identidade: 'identidade',
  comprovante_cpf_cnpj: 'cpf_cnpj',
  comprovante_residencia: 'residencia',
  // comprovante_propriedade: 'propriedade',
};

  get anexosList() {
    return Object.keys(this.anexos).map((key) => ({
      key,
      ...this.anexos[key],
    }));
  }

  get todosAnexosEnviados(): boolean {
  return Object.values(this.anexos).every(
    (item: any) => item.uploaded === true
  );
}


  constructor(
    private cadastroAgricultorService: CadastroAgricultorService,
    private serviceUser: CadastroService,
    private anexoService: AnexoService,
    private auditService: AuditService,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registro = new Audit();
    this.anexo = new Anexo();
    this.loadUserData();
    this.getFarmers();

    const id = this.cadastroAgricultorService.getAgricultor();
    if (id) {
      this.anexo.agricultor_id = id;
      this.has_farmer = true;

      // limpar para não afetar futuros acessos
      this.cadastroAgricultorService.clear();
    }

    if (id) {
      this.anexo.agricultor_id = id;
      this.has_farmer = true;
      this.viewInputs = true;

      this.cadastroAgricultorService.agricultorById(id).subscribe({
        next: (c: any) => {
          this.nomeAgricultor = c.nome;
        },
      });

      this.cadastroAgricultorService.clear();
    }
  }

  //aqui fazer o onSelect de agricultores sem anexos

  loadUserData() {
    const user = this.serviceUser.getUser();
    if (!user) return;

    this.profile_id = user._profile_id;
    this.registro.user_id = user._id;
    this.user_name = user._user_name;
  }

  getFarmers() {
    this.cadastroAgricultorService.agricultorRural('farmerNoAnexo').subscribe(
      (usr: any[]) => {
        this.lista_farmers = usr;
        // console.log('lista_users', this.lista_farmers)
      },
      (erro: any) => console.error(erro),
    );
  }

  checkFiles(id: number) {
    this.anexoService.checarArquivos(id).subscribe((resp: any[]) => {
      resp.forEach((anexo) => {
        const key = this.uploadedMap[anexo.tipo_anexo];

        if (key && this.anexos[key]) {
          this.anexos[key].uploaded = true;
        }
      });
    });
  }

  showInputs() {
    this.viewInputs = true;
  }

  /* Recebe arquivo único */
  onSelectSingle(key: string, event: any) {
    this.anexos[key].file = event.target.files[0];
  }

  onSelectMultiple(key: string, event: any) {
    this.anexos[key].file = [...event.target.files];
  }

  /* Função única de upload */
  uploadFile(key: string) {
    const item = this.anexos[key];
    const id = this.anexo.agricultor_id;

    if (!item.file) {
      item.error = 'Selecione um arquivo.';
      return;
    }

    const fd = new FormData();

    if (item.multiple) {
      item.file.forEach((f: File) => fd.append('files', f));
    } else {
      fd.append('file', item.file);
    }

    this.http
      .post(environment.apiUrl + item.endpoint + '/' + id, fd)
      .subscribe({
        next: () => {
          item.uploaded = true;
          item.error = '';
          this.cadastroAgricultorService.setAgricultor(
            Number(this.anexo.agricultor_id),
          );
        },
        error: () => {
          item.error = 'Erro ao enviar arquivo.';
        },
      });
  }

  finish(has_farmer: boolean) {
    if (!has_farmer) {
      this.toastr.success('Inscrição finalizada com sucesso!');
      this.router.navigate(['/home']);
    } else {
      this.toastr.success('Inscrição finalizada com sucesso!');
      this.router.navigate(['/listfarmers']);
    }
  }
}
