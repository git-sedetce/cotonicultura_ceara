const database = require("../models");
const { Sequelize, QueryTypes, Op, fn, col } = require("sequelize");
const dbConfig = require('../config/config').development;

class StatisticsController {
  
    static async countProdutores(req, res) {
  try {
    const totalAgricultores = await database.produtor_rural.count();

    return res.status(200).json({
      total: totalAgricultores
    });
  } catch (error) {
    console.error('Erro ao contar agricultores:', error);
    return res.status(500).json({
      message: 'Erro ao contar agricultores'
    });
  }
}

static async countPorMunicipio(req, res) {
  try {
    const resultado = await database.produtor_rural.findAll({
      attributes: [
        [col('ass_produtor_rural_cidade.nome_municipio'), 'nome_municipio'],
        [fn('COUNT', col('produtor_rural.id')), 'qtd_agricultores']
      ],
      include: [
        {
          association: "ass_produtor_rural_cidade",
          attributes: []
        }
      ],
      group: ['ass_produtor_rural_cidade.nome_municipio'],
      order: [[col('ass_produtor_rural_cidade.nome_municipio'), 'ASC']]
    });

    return res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao contar agricultores por município' });
  }
}

static async countPorRegiao(req, res) {
  try {
    const resultado = await database.produtor_rural.findAll({
      attributes: [
        [col('ass_produtor_rural_cidade.ass_municipio_regiao.nome'), 'nome_regiao'],
        [fn('COUNT', col('produtor_rural.id')), 'qtd_agricultores']
      ],
      include: [
        {
          association: "ass_produtor_rural_cidade",
          attributes: [],
          include: [
            {
              association: "ass_municipio_regiao",
              attributes: []
            }
          ]
        }
      ],
      group: ['ass_produtor_rural_cidade.ass_municipio_regiao.nome'],
      order: [[col('ass_produtor_rural_cidade.ass_municipio_regiao.nome'), 'ASC']]
    });

    return res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao contar agricultores por região' });
  }
}

static async countAgricultoresAtendidos(req, res) {
  try {
    const total = await database.produtor_rural.count({
      where: {
        pedido_atendido: true
      }
    });

    return res.status(200).json({
      agricultores_atendidos: total
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Erro ao contar agricultores atendidos'
    });
  }
}

static async totalSementesDistribuidas(req, res) {
  try {
    const resultado = await database.produtor_rural.findOne({
      attributes: [
        [fn('COALESCE', fn('SUM', col('sementes_recebidas')), 0), 'total_sementes']
      ]
    });

    return res.status(200).json({
      total_sementes_distribuidas: resultado.get('total_sementes')
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Erro ao somar sementes distribuídas'
    });
  }
}

static async sementesPorRegiao(req, res) {
  try {
    const resultado = await database.produtor_rural.findAll({
      attributes: [
        [col('ass_produtor_rural_cidade.ass_municipio_regiao.nome'), 'nome_regiao'],
        [fn('COALESCE', fn('SUM', col('sementes_recebidas')), 0), 'total_sementes']
      ],
      include: [
        {
          association: "ass_produtor_rural_cidade",
          attributes: [],
          include: [
            {
              association: "ass_municipio_regiao",
              attributes: []
            }
          ]
        }
      ],
      group: ['ass_produtor_rural_cidade.ass_municipio_regiao.nome'],
      order: [[col('ass_produtor_rural_cidade.ass_municipio_regiao.nome'), 'ASC']]
    });

    return res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao somar sementes distribuidas por região' });
  }
}

static async sementesPorMunicipio(req, res) {
  try {
    const resultado = await database.produtor_rural.findAll({
      attributes: [
        [col('ass_produtor_rural_cidade.nome_municipio'), 'nome_municipio'],
        [fn('COALESCE', fn('SUM', col('sementes_recebidas')), 0), 'total_sementes']
      ],
      include: [
        {
          association: "ass_produtor_rural_cidade",
          attributes: []
        }
      ],
      group: ['ass_produtor_rural_cidade.nome_municipio'],
      order: [[col('ass_produtor_rural_cidade.nome_municipio'), 'ASC']]
    });

    return res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao contar agricultores por município' });
  }
}

static async countPorTipoCultivo(req, res) {
  try {
    const resultado = await database.produtor_rural.findAll({
      attributes: [
        ['regime_cultivo', 'tipo_cultivo'],
        [fn('COUNT', col('id')), 'qtd_agricultores']
      ],
      group: ['regime_cultivo'],
      order: [['regime_cultivo', 'ASC']]
    });

    return res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Erro ao contar por tipo de cultivo'
    });
  }
}










  static async projetoCoordSt2(req, res) {
    try {
      const qtv = await database.Projeto.findAll({
        where: { status_id: 2 },
        attributes: [
          "coord_id",
          "status_id",
          [Sequelize.fn("COUNT", Sequelize.col("status_id")), "qtd_status"],
        ],
        include: [
          {
            association: "ass_project_status",
            // where:(database.Projeto.status_id = database.Status.id),
            attributes: ["name"],
          },
          {
            association: "ass_project_coordenadoria",
            // where:(database.Projeto.coord_id = database.Coordenadorias.id),
            attributes: ["sigla"],
          },
        ],
        group: [
          "coord_id",
          "status_id",
          "ass_project_status.id",
          "ass_project_status.name",
          "ass_project_coordenadoria.id",
          "ass_project_coordenadoria.sigla",
        ],
      });
      return res.status(200).json(qtv);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }  

  static async tarefaCoordSt1(req, res) {
    const sequelize = new Sequelize({...dbConfig, logging: false});
    try {
      const resultado = await sequelize.query(
        `SELECT 
    coord.sigla AS sigla,
    COUNT(r.id) AS qtd_task
FROM 
   public."Reportars" r
INNER JOIN 
    public."Compromissos" c ON r.compromisso_id = c.id
INNER JOIN 
    public."Coordenadorias" coord ON c.coord_id = coord.id
GROUP BY 
    coord.sigla;`,
        {
          type: QueryTypes.SELECT,
        }
      );

      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async tarefaSexecSt1(req, res) {
    const sequelize = new Sequelize({...dbConfig, logging: false});
    try {
      const resultado = await sequelize.query(
        `SELECT 
    sexec.sigla AS sigla,
    COUNT(r.id) AS qtd_task
FROM 
   public."Reportars" r
INNER JOIN 
    public."Compromissos" c ON r.compromisso_id = c.id
INNER JOIN 
    public."Secretaria_Executivas" sexec ON c.sexec_id = sexec.id
GROUP BY 
    sexec.sigla;`,
        {
          type: QueryTypes.SELECT,
        }
      );

      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = StatisticsController;
