const database = require("../models");
const { Op, Sequelize, where } = require("sequelize");
const bcrypt = require("bcryptjs");
const { randomInt } = require("node:crypto");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { cpfBusca } = require("../utils/cpfBusca");

function calcularQuantidadeSementes(areaAlgodao) {
  return Number((areaAlgodao * 10.2).toFixed(2));
}

async function removerArquivoTemporario(caminho) {
  try {
    await fs.promises.unlink(caminho);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Erro ao remover arquivo enviado:", error);
    }
  }
}

async function criarDistribuicaoInicial(agricultorId, areaAlgodao, transaction) {
  const ano = new Date().getFullYear();
  const distribuicao = await database.distribuicao_sementes.create(
    {
      agricultor_id: agricultorId,
      ano_distribuicao: ano,
      qtde_sementes: calcularQuantidadeSementes(areaAlgodao),
      pedido_atendido: false,
      area_algodao: areaAlgodao,
    },
    { transaction },
  );

  await distribuicao.update(
    {
      pedido: `PED-${String(distribuicao.id).padStart(6, "0")}-${ano}`,
    },
    { transaction },
  );
}

function emailProdutorValido(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function enviarPinPrimeiroAcesso(email, pin) {
  const transporter = nodemailer.createTransport({
    host: "172.26.2.26",
    port: 25,
    secure: false,
    tls: { rejectUnauthorized: false },
  });
  await transporter.sendMail({
    from: "cotec@sde.ce.gov.br",
    to: email,
    subject: "PIN para primeiro acesso - Sistema de Cotonicultura da SDE",
    html: `
      <h2>Primeiro acesso</h2>
      <p>Seu PIN de confirmação é: <strong>${pin}</strong></p>
      <p>Acesse o sistema e selecione “Primeiro acesso do produtor” para cadastrar sua senha.</p>
      <a href="https://cotonicultura.sde.ce.gov.br/firstlogin">Validar primeiro acesso</a>
    `,
  });
}

async function notificarPinPrimeiroAcesso(email, pin) {
  try {
    await enviarPinPrimeiroAcesso(email, pin);
    return true;
  } catch (error) {
    console.error("Erro ao enviar PIN de primeiro acesso:", error);
    return false;
  }
}

class AgroControllers {
  static async registerAgro(req, res) {
    const { area_algodao, ...dadosProdutor } = req.body;
    const areaAlgodao = Number(area_algodao);
    if (
      area_algodao === undefined ||
      area_algodao === null ||
      area_algodao === "" ||
      !Number.isFinite(areaAlgodao) ||
      areaAlgodao < 0 ||
      areaAlgodao > Number(dadosProdutor.area_total)
    ) {
      return res.status(400).json({ message: "Área de algodão inválida" });
    }
    if (!emailProdutorValido(dadosProdutor.email_trabalhador)) {
      return res.status(400).json({
        message: "Informe um e-mail válido para receber o PIN de primeiro acesso",
      });
    }
    const cpfs = cpfBusca(dadosProdutor.cpf_cnpj);
    if (!cpfs) {
      return res.status(400).json({ message: "Informe um CPF válido" });
    }
    const cpfNumerico = cpfs[0];
    const pin = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const [passwordHash, pinHash] = await Promise.all([
      bcrypt.hash(cpfNumerico, 10),
      bcrypt.hash(pin, 10),
    ]);

    let transaction;
    try {
      transaction = await database.sequelize.transaction();
      const novoProdutor = await database.produtor_rural.create(
        {
          ...dadosProdutor,
          password_trabalhador: passwordHash,
          pin_trabalhador: pinHash,
          login_ativado: false,
          etapa: 2,
        },
        { transaction },
      );

      await criarDistribuicaoInicial(novoProdutor.id, areaAlgodao, transaction);

      await transaction.commit();
      const pinEnviado = await notificarPinPrimeiroAcesso(
        dadosProdutor.email_trabalhador,
        pin,
      );
      const produtorCriado = novoProdutor.toJSON();
      delete produtorCriado.password_trabalhador;
      delete produtorCriado.pin_trabalhador;
      return res.status(201).json({
        ...produtorCriado,
        pinEnviado,
        message: pinEnviado
          ? "Cadastro realizado. Consulte o e-mail informado para obter o PIN."
          : "Cadastro salvo, mas não foi possível enviar o PIN. Procure o suporte.",
      });
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      return res.status(500).json(error.message);
    }
  }

  static async registerAgroCompleto(req, res) {
    if (!req.files?.cpf || !req.files?.residencia) {
      return res.status(400).json({
        message: "CPF/CNPJ e comprovante de residência são obrigatórios",
      });
    }

    let t;
    try {
      const dados = JSON.parse(req.body.dados);
      const areaAlgodao = Number(dados.area_algodao);
      if (
        dados.area_algodao === undefined ||
        dados.area_algodao === null ||
        dados.area_algodao === "" ||
        !Number.isFinite(areaAlgodao) ||
        areaAlgodao < 0 ||
        areaAlgodao > Number(dados.area_total)
      ) {
        return res.status(400).json({ message: "Área de algodão inválida" });
      }
      const { area_algodao, ...dadosProdutor } = dados;
      const cpfs = cpfBusca(dadosProdutor.cpf_cnpj);
      if (!cpfs) {
        return res.status(400).json({ message: "Informe um CPF válido" });
      }
      if (!emailProdutorValido(dadosProdutor.email_trabalhador)) {
        return res.status(400).json({
          message: "Informe um e-mail válido para receber o PIN de primeiro acesso",
        });
      }

      const cpfNumerico = cpfs[0];
      const pin = String(randomInt(0, 1_000_000)).padStart(6, "0");
      const [passwordHash, pinHash] = await Promise.all([
        bcrypt.hash(cpfNumerico, 10),
        bcrypt.hash(pin, 10),
      ]);

      t = await database.sequelize.transaction();

      const novoProdutor = await database.produtor_rural.create(
        {
          ...dadosProdutor,
          password_trabalhador: passwordHash,
          pin_trabalhador: pinHash,
          login_ativado: false,
          etapa: 2,
        },
        { transaction: t },
      );

      await criarDistribuicaoInicial(novoProdutor.id, areaAlgodao, t);

      const arquivos = [
        {
          file: req.files.cpf[0],
          tipo_anexo: "comprovante_cpf_cnpj",
        },
        {
          file: req.files.residencia[0],
          tipo_anexo: "comprovante_residencia",
        },
      ];

      const tiposPermitidos = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];

      for (const item of arquivos) {
        if (!tiposPermitidos.includes(item.file.mimetype)) {
          throw new Error("Tipo de arquivo não permitido");
        }

        const caminho = item.file.path.split(process.env.SPLIT)[1];

        await database.anexo.create(
          {
            mimetype: item.file.mimetype,
            filename: item.file.filename,
            path: caminho,
            agricultor_id: novoProdutor.id,
            tipo_anexo: item.tipo_anexo,
          },
          { transaction: t },
        );
      }

      await t.commit();
      const pinEnviado = await notificarPinPrimeiroAcesso(
        dadosProdutor.email_trabalhador,
        pin,
      );

      const produtorCriado = novoProdutor.toJSON();
      delete produtorCriado.password_trabalhador;
      delete produtorCriado.pin_trabalhador;
      return res.status(201).json({
        ...produtorCriado,
        pinEnviado,
        message: pinEnviado
          ? "Cadastro realizado. Consulte o e-mail informado para obter o PIN."
          : "Cadastro salvo, mas não foi possível enviar o PIN. Procure o suporte.",
      });
    } catch (error) {
      if (t && !t.finished) {
        await t.rollback();
      }
      return res.status(500).json({ message: error.message });
    }
  }

  static async pegaCidades(req, res) {
    try {
      const cidadesFiltradas = await database.cidades.findAll({
        order: [["nome_municipio", "ASC"]],
        attributes: ["id", "nome_municipio"],
      });

      return res.status(200).json(cidadesFiltradas);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaRegiao(req, res) {
    try {
      const regioesFiltradas = await database.regiao.findAll({
        order: [["nome", "ASC"]],
        attributes: ["id", "nome"],
      });

      return res.status(200).json(regioesFiltradas);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  // static async pegaCidades(req, res) {
  //   try {
  //     const cidadesFiltradas = await database.cidades.findAll({
  //       attributes: ["id", "nome_municipio"],
  //       where: {
  //         nome_municipio: {
  //           [Op.in]: [
  //             "Aiuaba",
  //             "Arneiroz",
  //             "Parambu",
  //             "Quiterianópolis",
  //             "Tauá",
  //             "Novo Oriente",
  //             "Pedra Branca",
  //             "Catarina",
  //             "Independência",
  //           ],
  //         },
  //       },
  //     });

  //     return res.status(200).json(cidadesFiltradas);
  //   } catch (error) {
  //     return res.status(500).json(error.message);
  //   }
  // }

  static async consultarCPF(req, res) {
    const { cpf } = req.params;
    try {
      const verificaCPF = await database.produtor_rural.findOne({
        where: { cpf_cnpj: cpf },
        attributes: ["nome", "cpf_cnpj"],
      });
      if (verificaCPF === null) {
        return res
          .status(200)
          .json({ mensagem: `CPF/CNPJ autorizado para cadastro` });
      } else {
        return res.status(200).json({ mensagem: `CPF/CNPJ já cadastrado!` });
      }
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async consultarADAGRI(req, res) {
    const { adagri } = req.params;
    try {
      const verificaADAGRI = await database.produtor_rural.findOne({
        where: { cadastro_adagri: adagri },
        attributes: ["nome", "cadastro_adagri"],
      });
      if (verificaADAGRI === null) {
        return res
          .status(200)
          .json({ mensagem: `Cadastro ADAGRI autorizado para cadastro` });
      } else {
        return res
          .status(200)
          .json({ mensagem: `Cadastro ADAGRI já cadastrado!` });
      }
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaFarmers(req, res) {
    const { status } = req.query;
    try {
      const getFarmer = await database.produtor_rural.findAll({
        where: { status_farmer: status },
        order: [["nome", "ASC"]],
        attributes: [
          "id",
          "nome",
          "telefone",
          "cpf_cnpj",
          "rg",
          "endereco",
          "cidade",
          "nome_propriedade",
          "ponto_referencia",
          "area_total",
          "regime_cultivo",
          "cadastro_adagri",
          "confirma_informacao",
          "email_trabalhador",
          "apelido_trabalhador",
          "tem_cadastro_adagri",
          "uso_dados",
          "etapa",
          "status_farmer",
          "createdAt",
        ],
        include: [
          {
            association: "ass_produtor_rural_cidade",
            attributes: ["id", "nome_municipio"],
            include: [
              {
                association: "ass_municipio_regiao",
                attributes: ["id", "nome"],
              },
            ],
          },
          {
            association: "ass_agricultor_anexo",
            attributes: ["id", "tipo_anexo"],
          },
          {
            association: "ass_agricultor_distribuicao_sementes",
            attributes: ["id", "pedido", "qtde_sementes", "ano_distribuicao", "pedido_atendido", "area_algodao"],
          },
        ],
      });

      return res.status(200).json(getFarmer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar agricultores" });
    }
  }

  static async pegaFarmersId(req, res) {
    const { id } = req.params;
    try {
      const getFarmer = await database.produtor_rural.findOne({
        where: { id: Number(id) },
        attributes: [
          "id",
          "nome",
          "telefone",
          "cpf_cnpj",
          "rg",
          "endereco",
          "cidade",
          "nome_propriedade",
          "ponto_referencia",
          "area_total",
          "regime_cultivo",
          "cadastro_adagri",
          "confirma_informacao",
          "email_trabalhador",
          "uso_dados",
          "createdAt",
        ],
        include: [
          {
            association: "ass_produtor_rural_cidade",
            attributes: ["id", "nome_municipio"],
            include: [
              {
                association: "ass_municipio_regiao",
                attributes: ["id", "nome"],
              },
            ],
          },
          {
            association: "ass_agricultor_distribuicao_sementes",
            attributes: ["pedido", "qtde_sementes", "ano_distribuicao", "pedido_atendido", "area_algodao"],
          },
        ],
      });

      return res.status(200).json(getFarmer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar agricultor" });
    }
  }

  static async pegaCidade(req, res) {
    const { city } = req.params;
    try {
      const getCity = await database.cidades.findOne({
        where: { nome_municipio: city },
        attributes: ["id", "nome_municipio", "cod_ibge"],
        include: [
          {
            association: "ass_municipio_regiao",
            attributes: ["id", "nome"],
          },
        ],
      });

      const getFarmer = await database.produtor_rural.findAll({
        where: { cidade: getCity.id },
        attributes: [
          "nome",
          "cpf_cnpj",
          "cidade",
          "nome_propriedade",
          "regime_cultivo",
        ],
        include: [
          {
            association: "ass_produtor_rural_cidade",
            attributes: ["id", "nome_municipio"],
          },
          {
            association: "ass_agricultor_anexo",
            attributes: ["tipo_anexo"],
          },
          {
            association: "ass_agricultor_distribuicao_sementes",
            attributes: ["pedido", "qtde_sementes", "ano_distribuicao", "pedido_atendido", "area_algodao"],
          },
        ],
      });

      return res.status(200).json(getFarmer);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao pegar informações da Cidade" });
    }
  }

  static async pegaFarmersCity(req, res) {
    const { id } = req.params;
    try {
      const getFarmer = await database.produtor_rural.findAll({
        where: { cidade: Number(id) },
        attributes: [
          "nome",
          "cpf_cnpj",
          "cidade",
          "nome_propriedade",
          "regime_cultivo",
        ],
        include: [
          {
            association: "ass_produtor_rural_cidade",
            attributes: ["id", "nome_municipio"],
            include: [
              {
                association: "ass_municipio_regiao",
                attributes: ["id", "nome"],
              },
            ],
          },
          {
            association: "ass_agricultor_distribuicao_sementes",
            attributes: ["pedido", "qtde_sementes", "ano_distribuicao", "pedido_atendido", "area_algodao"],
          },
        ],
      });

      return res.status(200).json(getFarmer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar agricultores" });
    }
  }

  static async farmersSemAnexo(req, res) {
    try {
      const getFarmer = await database.produtor_rural.findAll({
        where: {
          id: {
            [Op.notIn]: Sequelize.literal(
              `(SELECT agricultor_id FROM "anexos")`,
            ),
          },
        },
        attributes: ["id", "nome"],
        order: [["nome", "ASC"]],
      });

      return res.status(200).json(getFarmer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar agricultor" });
    }
  }

  static async atualizaFarmer(req, res) {
    const { id } = req.params;
    try {
      await database.produtor_rural.update(req.body, {
        where: { id: Number(id) },
      });
      const updateFarmer = await database.produtor_rural.findOne({
        where: { id: Number(id) },
      });
      return res.status(200).json(updateFarmer);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaPerfilProdutor(req, res) {
    try {
      const produtor = await database.produtor_rural.findByPk(
        res.locals.user._produtor_id,
        {
          attributes: [
            "id", "nome", "telefone", "cpf_cnpj", "rg", "endereco", "cidade",
            "nome_propriedade", "ponto_referencia", "area_total", "regime_cultivo",
            "cadastro_adagri", "confirma_informacao", "email_trabalhador",
            "apelido_trabalhador", "tem_cadastro_adagri", "uso_dados", "createdAt",
          ],
          include: [
            {
              association: "ass_produtor_rural_cidade",
              attributes: ["id", "nome_municipio"],
            },
            {
              association: "ass_agricultor_distribuicao_sementes",
              separate: true,
              attributes: [
                "id", "pedido", "qtde_sementes", "ano_distribuicao",
                "pedido_atendido", "area_algodao",
              ],
              order: [["ano_distribuicao", "DESC"]],
            },
            {
              association: "ass_agricultor_anexo",
              separate: true,
              attributes: ["id", "tipo_anexo", "mimetype", "filename"],
              where: {
                tipo_anexo: {
                  [Op.in]: [
                    "comprovante_cpf_cnpj",
                    "comprovante_residencia",
                  ],
                },
              },
              order: [["id", "DESC"]],
            },
          ],
        },
      );
      if (!produtor) {
        return res.status(404).json({ message: "Produtor não encontrado" });
      }
      return res.status(200).json(produtor);
    } catch (error) {
      console.error("Erro ao buscar perfil do produtor:", error);
      return res.status(500).json({ message: "Erro ao buscar perfil do produtor" });
    }
  }

  static async atualizaAnexoProdutor(req, res) {
    const tiposPermitidos = [
      "comprovante_cpf_cnpj",
      "comprovante_residencia",
    ];
    const { tipo } = req.params;
    const arquivo = req.file;

    if (!tiposPermitidos.includes(tipo)) {
      if (arquivo) await removerArquivoTemporario(arquivo.path);
      return res.status(400).json({ message: "Tipo de documento inválido" });
    }
    if (!arquivo) {
      return res.status(400).json({ message: "Selecione um arquivo para enviar" });
    }

    const tiposMimePermitidos = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!tiposMimePermitidos.includes(arquivo.mimetype)) {
      await removerArquivoTemporario(arquivo.path);
      return res.status(400).json({
        message: "Envie um arquivo PDF, JPG, JPEG ou PNG",
      });
    }

    try {
      const produtorId = res.locals.user._produtor_id;
      const produtor = await database.produtor_rural.findByPk(produtorId);
      if (!produtor) {
        await removerArquivoTemporario(arquivo.path);
        return res.status(404).json({ message: "Produtor não encontrado" });
      }

      const anexosExistentes = await database.anexo.findAll({
        where: { agricultor_id: produtorId, tipo_anexo: tipo },
        order: [["id", "DESC"]],
      });
      const anexoExistente = anexosExistentes[0];
      const caminhoAnterior = anexoExistente?.path;
      const caminhoRelativo = path.relative(
        path.resolve(__dirname, ".."),
        arquivo.path,
      );
      const dadosAnexo = {
        mimetype: arquivo.mimetype,
        filename: arquivo.filename,
        path: caminhoRelativo,
      };

      let anexo;
      if (anexoExistente) {
        await anexoExistente.update(dadosAnexo);
        anexo = anexoExistente;
      } else {
        anexo = await database.anexo.create({
          ...dadosAnexo,
          tipo_anexo: tipo,
          agricultor_id: produtorId,
        });
      }

      if (caminhoAnterior) {
        const raizUploads = path.resolve(__dirname, "../uploads/anexos");
        const caminhoAntigo = path.resolve(
          path.resolve(__dirname, ".."),
          String(caminhoAnterior).replace(/^[\\/]+/, ""),
        );
        if (caminhoAntigo.startsWith(`${raizUploads}${path.sep}`)) {
          await removerArquivoTemporario(caminhoAntigo);
        }
      }

      return res.status(anexoExistente ? 200 : 201).json({
        message: "Documento atualizado com sucesso",
        anexo: {
          id: anexo.id,
          tipo_anexo: anexo.tipo_anexo,
          mimetype: anexo.mimetype,
          filename: anexo.filename,
        },
      });
    } catch (error) {
      await removerArquivoTemporario(arquivo.path);
      console.error("Erro ao atualizar anexo do produtor:", error);
      return res.status(500).json({ message: "Erro ao atualizar o documento" });
    }
  }

  static async pegaAnexoProdutor(req, res) {
    const tiposPermitidos = [
      "comprovante_cpf_cnpj",
      "comprovante_residencia",
    ];
    const { tipo } = req.params;
    if (!tiposPermitidos.includes(tipo)) {
      return res.status(400).json({ message: "Tipo de documento inválido" });
    }

    try {
      const anexo = await database.anexo.findOne({
        where: {
          agricultor_id: res.locals.user._produtor_id,
          tipo_anexo: tipo,
        },
        order: [["id", "DESC"]],
      });
      if (!anexo) {
        return res.status(404).json({ message: "Documento não encontrado" });
      }

      const tiposMimePermitidos = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!tiposMimePermitidos.includes(anexo.mimetype)) {
        return res.status(415).json({ message: "Tipo de documento não suportado" });
      }

      const raizFonte = path.resolve(__dirname, "..");
      const raizUploads = path.resolve(raizFonte, "uploads", "anexos");
      const caminhoArquivo = path.resolve(
        raizFonte,
        String(anexo.path).replace(/^[\\/]+/, ""),
      );
      if (!caminhoArquivo.startsWith(`${raizUploads}${path.sep}`)) {
        return res.status(404).json({ message: "Documento não encontrado" });
      }

      const base64 = await fs.promises.readFile(caminhoArquivo, "base64");
      return res.status(200).json({
        id_anexo: anexo.id,
        tipo_anexo: anexo.tipo_anexo,
        filename: anexo.filename,
        mimetype: anexo.mimetype,
        base64,
      });
    } catch (error) {
      if (error.code === "ENOENT") {
        return res.status(404).json({ message: "Arquivo não existe no servidor" });
      }
      console.error("Erro ao recuperar anexo do produtor:", error);
      return res.status(500).json({ message: "Erro ao recuperar o documento" });
    }
  }

  static async atualizaPerfilProdutor(req, res) {
    const camposPermitidos = [
      "nome", "telefone", "rg", "endereco", "cidade", "nome_propriedade",
      "ponto_referencia", "area_total", "regime_cultivo", "cadastro_adagri",
      "confirma_informacao", "email_trabalhador", "apelido_trabalhador",
      "tem_cadastro_adagri", "uso_dados",
    ];
    const bodyValido =
      req.body && typeof req.body === "object" && !Array.isArray(req.body);
    const dados = bodyValido
      ? Object.fromEntries(
          Object.entries(req.body).filter(([campo]) =>
            camposPermitidos.includes(campo),
          ),
        )
      : {};
    if (Object.keys(dados).length === 0) {
      return res.status(400).json({ message: "Nenhum dado permitido para atualização" });
    }
    if (
      dados.area_total !== undefined &&
      (!Number.isFinite(Number(dados.area_total)) || Number(dados.area_total) < 0)
    ) {
      return res.status(400).json({ message: "Área total inválida" });
    }
    if (
      dados.cidade !== undefined &&
      (!Number.isInteger(Number(dados.cidade)) || Number(dados.cidade) <= 0)
    ) {
      return res.status(400).json({ message: "Município inválido" });
    }

    try {
      const produtor = await database.produtor_rural.findByPk(
        res.locals.user._produtor_id,
      );
      if (!produtor) {
        return res.status(404).json({ message: "Produtor não encontrado" });
      }
      if (dados.area_total !== undefined) dados.area_total = Number(dados.area_total);
      if (dados.cidade !== undefined) dados.cidade = Number(dados.cidade);
      await produtor.update(dados);
      return AgroControllers.pegaPerfilProdutor(req, res);
    } catch (error) {
      console.error("Erro ao atualizar perfil do produtor:", error);
      return res.status(500).json({ message: "Erro ao atualizar perfil do produtor" });
    }
  }

  static async criaPedidoProdutor(req, res) {
    const areaAlgodao = Number(req.body?.area_algodao);
    if (!Number.isFinite(areaAlgodao) || areaAlgodao <= 0) {
      return res.status(400).json({ message: "Informe uma área de algodão válida" });
    }

    let transaction;
    try {
      transaction = await database.sequelize.transaction();
      const produtor = await database.produtor_rural.findByPk(
        res.locals.user._produtor_id,
        { transaction, lock: transaction.LOCK.UPDATE },
      );
      if (!produtor) {
        await transaction.rollback();
        return res.status(404).json({ message: "Produtor não encontrado" });
      }
      if (areaAlgodao > Number(produtor.area_total)) {
        await transaction.rollback();
        return res.status(400).json({
          message: "A área do pedido não pode ser maior que a área total da propriedade",
        });
      }

      const ano = new Date().getFullYear();
      const pedido = await database.distribuicao_sementes.create(
        {
          agricultor_id: produtor.id,
          ano_distribuicao: ano,
          qtde_sementes: calcularQuantidadeSementes(areaAlgodao),
          pedido_atendido: false,
          area_algodao: areaAlgodao,
        },
        { transaction },
      );
      await pedido.update(
        { pedido: `PED-${String(pedido.id).padStart(6, "0")}-${ano}` },
        { transaction },
      );
      await transaction.commit();
      return res.status(201).json(pedido);
    } catch (error) {
      if (transaction && !transaction.finished) await transaction.rollback();
      console.error("Erro ao criar pedido do produtor:", error);
      return res.status(500).json({ message: "Erro ao criar pedido de sementes" });
    }
  }

  static async adicionaDistribuicoes(req, res) {
    const agricultorId = Number(req.params.id);
    const distribuicoes = req.body?.distribuicoes;

    if (!Number.isInteger(agricultorId) || agricultorId <= 0) {
      return res.status(400).json({ message: "ID do agricultor inválido" });
    }

    if (!Array.isArray(distribuicoes) || distribuicoes.length === 0) {
      return res.status(400).json({ message: "Informe ao menos um pedido de sementes" });
    }

    const registrosValidos = distribuicoes.every(
      (distribuicao) =>
        distribuicao &&
        typeof distribuicao === "object" &&
        !Array.isArray(distribuicao),
    );
    if (!registrosValidos) {
      return res.status(400).json({ message: "Dados de distribuição inválidos" });
    }

    const dadosValidos = distribuicoes.every((distribuicao) => {
      const ano = Number(distribuicao.ano_distribuicao);
      const areaAlgodao = Number(distribuicao.area_algodao);

      return (
        distribuicao.ano_distribuicao !== null &&
        distribuicao.ano_distribuicao !== undefined &&
        distribuicao.ano_distribuicao !== "" &&
        Number.isInteger(ano) &&
        ano > 0 &&
        distribuicao.area_algodao !== undefined &&
        distribuicao.area_algodao !== null &&
        distribuicao.area_algodao !== "" &&
        Number.isFinite(areaAlgodao) &&
        areaAlgodao >= 0 &&
        typeof distribuicao.pedido_atendido === "boolean"
      );
    });

    if (!dadosValidos) {
      return res.status(400).json({ message: "Dados de distribuição inválidos" });
    }

    let transaction;

    try {
      transaction = await database.sequelize.transaction();
      const agricultor = await database.produtor_rural.findByPk(agricultorId, {
        transaction,
      });

      if (!agricultor) {
        await transaction.rollback();
        return res.status(404).json({ message: "Agricultor não encontrado" });
      }

      const novosRegistros = distribuicoes.map((distribuicao) => ({
        agricultor_id: agricultorId,
        ano_distribuicao: Number(distribuicao.ano_distribuicao),
        qtde_sementes: calcularQuantidadeSementes(
          Number(distribuicao.area_algodao),
        ),
        pedido_atendido: distribuicao.pedido_atendido,
        area_algodao: Number(distribuicao.area_algodao),
      }));
      const anoAtual = new Date().getFullYear();

      const pedidosCriados = [];
      for (const registro of novosRegistros) {
        const pedido = await database.distribuicao_sementes.create(registro, {
          transaction,
        });
        await pedido.update(
          {
            pedido: `PED-${String(pedido.id).padStart(6, "0")}-${anoAtual}`,
          },
          { transaction },
        );
        pedidosCriados.push(pedido);
      }
      await transaction.commit();

      return res.status(200).json({
        message: "Pedidos de sementes adicionados com sucesso",
        distribuicoes: pedidosCriados,
      });
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      console.error("Erro ao adicionar pedidos de sementes:", error);
      return res.status(500).json({
        message: "Erro ao adicionar pedidos de sementes",
      });
    }
  }

  static async atualizaAtendimentoDistribuicoes(req, res) {
    const agricultorId = Number(req.params.id);
    const distribuicoes = req.body?.distribuicoes;

    if (!Number.isInteger(agricultorId) || agricultorId <= 0) {
      return res.status(400).json({ message: "ID do agricultor inválido" });
    }

    if (!Array.isArray(distribuicoes) || distribuicoes.length === 0) {
      return res.status(400).json({ message: "Informe os atendimentos para atualizar" });
    }

    const dadosValidos = distribuicoes.every(
      (distribuicao) =>
        distribuicao &&
        typeof distribuicao === "object" &&
        !Array.isArray(distribuicao) &&
        Number.isInteger(Number(distribuicao.id)) &&
        Number(distribuicao.id) > 0 &&
        typeof distribuicao.pedido_atendido === "boolean" &&
        distribuicao.area_algodao !== undefined &&
        distribuicao.area_algodao !== null &&
        distribuicao.area_algodao !== "" &&
        Number.isFinite(Number(distribuicao.area_algodao)) &&
        Number(distribuicao.area_algodao) >= 0,
    );
    const ids = distribuicoes.map((distribuicao) => Number(distribuicao?.id));

    if (!dadosValidos || new Set(ids).size !== ids.length) {
      return res.status(400).json({ message: "Dados de atendimento inválidos" });
    }

    let transaction;

    try {
      transaction = await database.sequelize.transaction();
      const registros = await database.distribuicao_sementes.findAll({
        where: {
          agricultor_id: agricultorId,
          id: ids,
        },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (registros.length !== distribuicoes.length) {
        await transaction.rollback();
        return res.status(404).json({
          message: "Uma ou mais distribuições não pertencem a este agricultor",
        });
      }

      if (registros.some((registro) => registro.pedido_atendido)) {
        await transaction.rollback();
        return res.status(409).json({
          message: "Distribuições atendidas não podem mais ser editadas",
        });
      }

      const atendimentos = new Map(
        distribuicoes.map((distribuicao) => [
          Number(distribuicao.id),
          distribuicao,
        ]),
      );

      for (const registro of registros) {
        const distribuicao = atendimentos.get(registro.id);
        const areaAlgodao = Number(distribuicao.area_algodao);
        await registro.update(
          {
            pedido_atendido: distribuicao.pedido_atendido,
            area_algodao: areaAlgodao,
            qtde_sementes: calcularQuantidadeSementes(areaAlgodao),
          },
          { transaction },
        );
      }
      await transaction.commit();

      return res.status(200).json({
        message: "Situação de atendimento atualizada com sucesso",
      });
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      console.error("Erro ao atualizar situação de atendimento:", error);
      return res.status(500).json({
        message: "Erro ao atualizar situação de atendimento",
      });
    }
  }

  static async desisitirPrograma(req, res) {
    const { id } = req.params;
    const produtor = req.body;
    try {
      await database.produtor_rural.update(produtor, {
        where: { id: Number(id) },
      });
      const updateFarmer = await database.produtor_rural.findOne({
        where: { id: Number(id) },
      });
      return res.status(200).json({
        mensagem: "Desistência registrada com sucesso",
        data: updateFarmer,
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async deletaFarmer(req, res) {
    const { id } = req.params;

    try {
      const produtor = await database.produtor_rural.findOne({
        where: { id: Number(id) },
        attributes: ["id", "nome"],
        include: [
          {
            model: database.anexo,
            as: "ass_agricultor_anexo",
            attributes: ["id", "path"],
          },
        ],
      });

      if (!produtor) {
        return res.status(404).json({ error: "Produtor não encontrado" });
      }

      // 🔹 Remove os arquivos físicos
      for (const anexo of produtor.ass_agricultor_anexo) {
        if (anexo.path) {
          const caminhoArquivo = path.resolve(anexo.path);
          // console.log("Caminho do arquivo:", caminhoArquivo);

          if (fs.existsSync(caminhoArquivo)) {
            fs.unlinkSync(caminhoArquivo);
          }
        }
      }

      // 🔹 Remove os registros dos anexos
      await database.anexo.destroy({
        where: { agricultor_id: produtor.id },
      });

      // 🔹 Remove o produtor
      await database.produtor_rural.destroy({
        where: { id: produtor.id },
      });

      return res.status(200).json({
        mensagem: `O Produtor ${produtor.nome} foi excluído com sucesso!!`,
      });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ error: erro.message });
    }
  }
}

module.exports = AgroControllers;
