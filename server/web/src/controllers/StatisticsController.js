const database = require("../models");
const { Sequelize, QueryTypes, Op, fn, col, literal } = require("sequelize");
const dbConfig = require("../config/config").development;

function lerAnoQuery(req, res) {
  const valor = req.query.ano;
  if (valor === undefined || valor === "") return null;

  const ano = Number(valor);
  if (!/^\d{4}$/.test(String(valor)) || !Number.isInteger(ano) || ano < 1900) {
    res.status(400).json({ message: "Ano inválido" });
    return undefined;
  }
  return ano;
}

function filtroAnoCadastro(ano) {
  if (ano === null) return {};
  return {
    createdAt: {
      [Op.gte]: new Date(Date.UTC(ano, 0, 1)),
      [Op.lt]: new Date(Date.UTC(ano + 1, 0, 1)),
    },
  };
}

function condicaoAnoDistribuicao(ano) {
  return ano === null ? "" : " AND ds.ano_distribuicao = :ano";
}

function opcoesQueryAno(ano) {
  return {
    type: QueryTypes.SELECT,
    ...(ano === null ? {} : { replacements: { ano } }),
  };
}

class StatisticsController {
  static async anosDisponiveis(req, res) {
    try {
      const anos = await database.sequelize.query(
        `SELECT ano
         FROM (
           SELECT EXTRACT(YEAR FROM pr."createdAt")::INTEGER AS ano
           FROM produtor_rurals AS pr
           WHERE pr.status_farmer = true
           UNION
           SELECT ds.ano_distribuicao::INTEGER AS ano
           FROM distribuicao_sementes AS ds
           INNER JOIN produtor_rurals AS pr ON pr.id = ds.agricultor_id
           WHERE pr.status_farmer = true
             AND ds.ano_distribuicao IS NOT NULL
         ) AS anos
         WHERE ano IS NOT NULL
         ORDER BY ano DESC`,
        { type: QueryTypes.SELECT },
      );
      return res.status(200).json(anos.map(({ ano }) => Number(ano)));
    } catch (error) {
      console.error("Erro ao listar anos disponíveis:", error);
      return res.status(500).json({ message: "Erro ao listar anos disponíveis" });
    }
  }

  static async countProdutores(req, res) {
    const ano = lerAnoQuery(req, res);
    if (ano === undefined) return;
    try {
      const totalAgricultores = await database.produtor_rural.count({
        where: { status_farmer: true, ...filtroAnoCadastro(ano) },
      });

      return res.status(200).json({
        total: totalAgricultores,
      });
    } catch (error) {
      console.error("Erro ao contar agricultores:", error);
      return res.status(500).json({
        message: "Erro ao contar agricultores",
      });
    }
  }

  static async countPorMunicipio(req, res) {
    const ano = lerAnoQuery(req, res);
    if (ano === undefined) return;
    try {
      const resultado = await database.produtor_rural.findAll({
        where: { status_farmer: true, ...filtroAnoCadastro(ano) },
        attributes: [
          [col("ass_produtor_rural_cidade.nome_municipio"), "nome_municipio"],
          [fn("COUNT", col("produtor_rural.id")), "qtd_agricultores"],
        ],
        include: [
          {
            association: "ass_produtor_rural_cidade",
            attributes: [],
          },
        ],
        group: ["ass_produtor_rural_cidade.nome_municipio"],
        // order: [[col("ass_produtor_rural_cidade.nome_municipio"), "ASC"]],
        order: [[col('qtd_agricultores'), 'DESC']],
        limit: 10,
      });

      return res.status(200).json(resultado);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao contar agricultores por município" });
    }
  }

  static async countPorRegiao(req, res) {
    const ano = lerAnoQuery(req, res);
    if (ano === undefined) return;
    try {
      const resultado = await database.produtor_rural.findAll({
        where: { status_farmer: true, ...filtroAnoCadastro(ano) },
        attributes: [
          [
            col("ass_produtor_rural_cidade.ass_municipio_regiao.nome"),
            "nome_regiao",
          ],
          [fn("COUNT", col("produtor_rural.id")), "qtd_agricultores"],
        ],
        include: [
          {
            association: "ass_produtor_rural_cidade",
            attributes: [],
            include: [
              {
                association: "ass_municipio_regiao",
                attributes: [],
              },
            ],
          },
        ],
        group: ["ass_produtor_rural_cidade.ass_municipio_regiao.nome"],
        // order: [
        //   [col("ass_produtor_rural_cidade.ass_municipio_regiao.nome"), "ASC"],
        // ],
        order: [[col('qtd_agricultores'), 'DESC']],
        limit: 5,
      });

      return res.status(200).json(resultado);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao contar agricultores por região" });
    }
  }

  static async countAgricultoresAtendidos(req, res) {
    const ano = lerAnoQuery(req, res);
    if (ano === undefined) return;
    try {
      const total = await database.produtor_rural.count({
        where: {
          status_farmer: true,
        },
        include: [
          {
            association: "ass_agricultor_distribuicao_sementes",
            attributes: [],
            where: {
              pedido_atendido: true,
              ...(ano === null ? {} : { ano_distribuicao: ano }),
            },
            required: true,
          },
        ],
        distinct: true,
        col: "id",
      });

      return res.status(200).json({
        agricultores_atendidos: total,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao contar agricultores atendidos",
      });
    }
  }

  static async totalSementesDistribuidas(req, res) {
    const ano = lerAnoQuery(req, res);
    if (ano === undefined) return;
    try {
      const totalSementes = await database.distribuicao_sementes.sum(
        "qtde_sementes",
        {
          where: {
            pedido_atendido: true,
            ...(ano === null ? {} : { ano_distribuicao: ano }),
          },
          include: [
            {
              association: "ass_distribuicao_sementes_produtor_rural",
              attributes: [],
              where: { status_farmer: true },
            },
          ],
        }
      );

      return res.status(200).json({
        total_sementes_distribuidas: totalSementes ?? 0,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao somar sementes distribuídas",
      });
    }
  }

  static async sementesPorAno(req, res) {
    try {
      const resultado = await database.sequelize.query(
        `SELECT ds.ano_distribuicao,
                COALESCE(SUM(ds.qtde_sementes), 0) AS total_sementes
         FROM distribuicao_sementes AS ds
         INNER JOIN produtor_rurals AS pr ON pr.id = ds.agricultor_id
         WHERE ds.pedido_atendido = true
           AND ds.ano_distribuicao IS NOT NULL
           AND pr.status_farmer = true
         GROUP BY ds.ano_distribuicao
         ORDER BY ds.ano_distribuicao ASC`,
        { type: QueryTypes.SELECT },
      );

      return res.status(200).json(resultado);
    } catch (error) {
      console.error("Erro ao somar sementes distribuídas por ano:", error);
      return res.status(500).json({
        message: "Erro ao buscar sementes distribuídas por ano",
      });
    }
  }

  static async totalSementesParaDistribuir(req, res) {
    try {
      const resultado = await database.distribuicao_sementes.findOne({
        where: {
          pedido_atendido: false,
        },
        attributes: [
          [
            fn("COALESCE", fn("SUM", col("qtde_sementes")), 0),
            "total_sementes",
          ],
        ],
      });

      return res.status(200).json({
        total_sementes_distribuidas: resultado.get("total_sementes"),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao somar sementes distribuídas",
      });
    }
  }

  static async totalAreaCultivo(req, res) {
    const ano = lerAnoQuery(req, res);
    if (ano === undefined) return;
    try {
      const [resultado] = await database.sequelize.query(
        `SELECT COALESCE(SUM(ds.area_algodao), 0) AS area_algodao
         FROM distribuicao_sementes AS ds
         INNER JOIN produtor_rurals AS pr ON pr.id = ds.agricultor_id
         WHERE pr.status_farmer = true${condicaoAnoDistribuicao(ano)}`,
        opcoesQueryAno(ano),
      );

      return res.status(200).json({
        total_area_cultivo: resultado.area_algodao,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao somar área de cultivo",
      });
    }
  }

  static async totalAreaCultivoTrabalhado(req, res) {
    const ano = lerAnoQuery(req, res);
    if (ano === undefined) return;
    try {
      const [resultado] = await database.sequelize.query(
        `SELECT COALESCE(SUM(ds.area_algodao), 0) AS area_algodao
         FROM distribuicao_sementes AS ds
         INNER JOIN produtor_rurals AS pr ON pr.id = ds.agricultor_id
         WHERE pr.status_farmer = true
           AND ds.pedido_atendido = true${condicaoAnoDistribuicao(ano)}`,
        opcoesQueryAno(ano),
      );

      return res.status(200).json({
        total_area_cultivo: resultado.area_algodao,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao somar área de cultivo",
      });
    }
  }

  static async sementesPorRegiao(req, res) {
    const ano = lerAnoQuery(req, res);
    if (ano === undefined) return;
    try {
      const resultado = await database.sequelize.query(
        `SELECT r.nome AS nome_regiao,
                COALESCE(SUM(ds.qtde_sementes), 0) AS total_sementes
         FROM distribuicao_sementes AS ds
         INNER JOIN produtor_rurals AS pr ON pr.id = ds.agricultor_id
         INNER JOIN cidades AS c ON c.id = pr.cidade
         INNER JOIN regiaos AS r ON r.id = c.regiao_id
         WHERE ds.pedido_atendido = true
           AND pr.status_farmer = true${condicaoAnoDistribuicao(ano)}
         GROUP BY r.nome
         ORDER BY total_sementes DESC
         LIMIT 5`,
        opcoesQueryAno(ano)
      );

      return res.status(200).json(resultado);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao somar sementes distribuidas por região" });
    }
  }

  static async sementesPorMunicipio(req, res) {
    try {
      const resultado = await database.distribuicao_sementes.findAll({
        where: { pedido_atendido: true },
        attributes: [
          [
            col(
              "ass_distribuicao_sementes_produtor_rural.ass_produtor_rural_cidade.nome_municipio"
            ),
            "nome_municipio",
          ],
          [
            fn("COALESCE", fn("SUM", col("qtde_sementes")), 0),
            "total_sementes",
          ],
        ],
        include: [
          {
            association: "ass_distribuicao_sementes_produtor_rural",
            attributes: [],
            where: { status_farmer: true },
            include: [
              {
                association: "ass_produtor_rural_cidade",
                attributes: [],
              },
            ],
          },
        ],
        group: [
          "ass_distribuicao_sementes_produtor_rural.ass_produtor_rural_cidade.nome_municipio",
        ],
        order: [[col("nome_municipio"), "ASC"]],
      });

      return res.status(200).json(resultado);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao somar sementes distribuídas por município" });
    }
  }

  static async countPorTipoCultivo(req, res) {
    try {
      const resultado = await database.produtor_rural.findAll({
        where: { status_farmer: true },
        attributes: [
          ["regime_cultivo", "tipo_cultivo"],
          [fn("COUNT", col("id")), "qtd_agricultores"],
        ],
        group: ["regime_cultivo"],
        order: [["regime_cultivo", "ASC"]],
      });

      return res.status(200).json(resultado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao contar por tipo de cultivo",
      });
    }
  }

  static async sumAreaCultivo(req, res) {
    const ano = lerAnoQuery(req, res);
    if (ano === undefined) return;
    try {
      const resultado = await database.sequelize.query(
        `SELECT c.nome_municipio,
                COALESCE(SUM(ds.area_algodao), 0) AS area_algodao
         FROM distribuicao_sementes AS ds
         INNER JOIN produtor_rurals AS pr ON pr.id = ds.agricultor_id
         INNER JOIN cidades AS c ON c.id = pr.cidade
         WHERE pr.status_farmer = true${condicaoAnoDistribuicao(ano)}
         GROUP BY c.nome_municipio
         ORDER BY area_algodao DESC
         LIMIT 10`,
        opcoesQueryAno(ano),
      );

      return res.status(200).json(resultado);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao contar área de cultivo" });
    }
  }

  static async sumAreaCultivoRegiao(req, res) {
    const ano = lerAnoQuery(req, res);
    if (ano === undefined) return;
    try {
      const resultado = await database.sequelize.query(
        `SELECT r.nome AS nome_regiao,
                COALESCE(SUM(ds.area_algodao), 0) AS total_area_cultivo
         FROM distribuicao_sementes AS ds
         INNER JOIN produtor_rurals AS pr ON pr.id = ds.agricultor_id
         INNER JOIN cidades AS c ON c.id = pr.cidade
         INNER JOIN regiaos AS r ON r.id = c.regiao_id
         WHERE pr.status_farmer = true${condicaoAnoDistribuicao(ano)}
         GROUP BY r.nome
         ORDER BY total_area_cultivo DESC
         LIMIT 5`,
        opcoesQueryAno(ano),
      );

      return res.status(200).json(resultado);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erro ao somar área de cultivo por região" });
    }
  }

  static async dadosMapa(req, res) {
    try {
      const resultado = await database.sequelize.query(
        `WITH agricultores_por_municipio AS (
           SELECT c.nome_municipio,
                  COUNT(pr.id) AS total_agricultores
           FROM produtor_rurals AS pr
           INNER JOIN cidades AS c ON c.id = pr.cidade
           WHERE pr.status_farmer = true
           GROUP BY c.nome_municipio
         ),
         area_por_municipio AS (
           SELECT c.nome_municipio,
                  COALESCE(SUM(ds.area_algodao), 0) AS total_area_algodao
           FROM distribuicao_sementes AS ds
           INNER JOIN produtor_rurals AS pr ON pr.id = ds.agricultor_id
           INNER JOIN cidades AS c ON c.id = pr.cidade
           WHERE pr.status_farmer = true
           GROUP BY c.nome_municipio
         ),
         sementes_por_municipio AS (
           SELECT c.nome_municipio,
                  COALESCE(SUM(ds.qtde_sementes), 0) AS total_sementes
           FROM distribuicao_sementes AS ds
           INNER JOIN produtor_rurals AS pr ON pr.id = ds.agricultor_id
           INNER JOIN cidades AS c ON c.id = pr.cidade
           WHERE pr.status_farmer = true
             AND ds.pedido_atendido = true
           GROUP BY c.nome_municipio
         )
         SELECT a.nome_municipio,
                COALESCE(s.total_sementes, 0) AS total_sementes,
                a.total_agricultores,
                COALESCE(aa.total_area_algodao, 0) AS total_area_algodao
         FROM agricultores_por_municipio AS a
         LEFT JOIN area_por_municipio AS aa
           ON aa.nome_municipio = a.nome_municipio
         LEFT JOIN sementes_por_municipio AS s
           ON s.nome_municipio = a.nome_municipio
         ORDER BY a.nome_municipio ASC`,
        { type: QueryTypes.SELECT },
      );

      return res.status(200).json(resultado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erro ao buscar dados por município",
      });
    }
  }


}

module.exports = StatisticsController;
