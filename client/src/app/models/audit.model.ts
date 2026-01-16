export class Audit {
  constructor(
    public id?: number,
    public user_id?: number,
    public tipo_acao?: string,
    public acao?: string,
  ) {}
}
