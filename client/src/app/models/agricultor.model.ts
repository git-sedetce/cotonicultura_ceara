export class Agricultor {
  constructor(
    public id?: number,
    public nome?: string,
    public telefone?: string,
    public cpf_cnpj?: string,
    public rg?: string,
    public endereco?: string,
    public cidade?: number,
    public nome_propriedade?: string,
    public area_total?: number,
    public area_algodao?: number,
    public regime_cultivo?: string,
    public cadastro_adagri?: string,
    public confirma_informacao?: boolean,
  ) {}
}
