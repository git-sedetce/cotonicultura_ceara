const database = require("../models");
const { Op, Sequelize, where } = require("sequelize");
const fs = require("fs");
const path = require("path");

class AgroControllers {
  static async registerAgro(req, res) {
    const newRegister = { ...req.body, etapa: 2 };
    // console.log('newRegister', newRegister);
    try {
      const novoProdutor = await database.produtor_rural.create(newRegister);
      const numeroPedido = `PED-${String(novoProdutor.id).padStart(6, "0")}`;

      await novoProdutor.update({ pedido: numeroPedido });
      ("");
      return res.status(200).json(novoProdutor);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async registerAgroCompleto(req, res) {
    const t = await database.sequelize.transaction();

    try {
      // ===== 1. VALIDAR ARQUIVOS =====
      if (!req.files?.cpf || !req.files?.residencia) {
        return res.status(400).json({
          message: "CPF/CNPJ e comprovante de residência são obrigatórios",
        });
      }

      // ===== 2. DADOS =====
      const dados = JSON.parse(req.body.dados);

      // ===== 3. CRIAR AGRICULTOR =====
      const novoProdutor = await database.produtor_rural.create(
        { ...dados, etapa: 2 },
        { transaction: t },
      );

      // ===== 4. PROCESSAR ARQUIVOS =====
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

      // ===== 5. COMMIT =====
      await t.commit();

      return res.status(200).json(novoProdutor);
    } catch (error) {
      await t.rollback();
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
          "area_algodao",
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
            attributes: ["id", "pedido", "qtde_sementes", "ano_distribuicao", "pedido_atendido"],
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
          "area_algodao",
          "sementes_recebidas",
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
            attributes: ["pedido", "qtde_sementes", "ano_distribuicao", "pedido_atendido"],
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
          "area_algodao",
          "sementes_recebidas",
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
            attributes: ["pedido", "qtde_sementes", "ano_distribuicao", "pedido_atendido"],
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
          "area_algodao",
          "sementes_recebidas",
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
            attributes: ["pedido", "qtde_sementes", "ano_distribuicao", "pedido_atendido"],
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
    const produtor = req.body;
    // console.log('user', user)
    try {
      await database.produtor_rural.update(produtor, {
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
      const quantidade = Number(distribuicao.qtde_sementes);

      return (
        distribuicao.ano_distribuicao !== null &&
        distribuicao.ano_distribuicao !== undefined &&
        distribuicao.ano_distribuicao !== "" &&
        distribuicao.qtde_sementes !== null &&
        distribuicao.qtde_sementes !== undefined &&
        distribuicao.qtde_sementes !== "" &&
        Number.isInteger(ano) &&
        ano > 0 &&
        Number.isFinite(quantidade) &&
        quantidade >= 0 &&
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
        qtde_sementes: Number(distribuicao.qtde_sementes),
        pedido_atendido: distribuicao.pedido_atendido,
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
        typeof distribuicao.pedido_atendido === "boolean",
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
        transaction,
      });

      if (registros.length !== distribuicoes.length) {
        await transaction.rollback();
        return res.status(404).json({
          message: "Uma ou mais distribuições não pertencem a este agricultor",
        });
      }

      const atendimentos = new Map(
        distribuicoes.map((distribuicao) => [
          Number(distribuicao.id),
          distribuicao.pedido_atendido,
        ]),
      );

      for (const registro of registros) {
        await registro.update(
          { pedido_atendido: atendimentos.get(registro.id) },
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
