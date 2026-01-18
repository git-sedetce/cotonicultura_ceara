const database = require("../models");
const { Op } = require("sequelize");

class AgroControllers {
  static async registerAgro(req, res) {
    const newRegister = req.body;
    // console.log('newRegister', newRegister);
    try {
      const novoProdutor = await database.produtor_rural.create(newRegister);
      return res.status(200).json(novoProdutor);
    } catch (error) {
      return res.status(500).json(error.message);
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
          return res.status(200).json({ mensagem: `Cadastro ADAGRI já cadastrado!` });
        }
      } catch (error) {
        return res.status(500).json(error.message);
      }
    }

    static async pegaFarmers(req, res) {
      try {
        const getFarmer = await database.produtor_rural.findAll({
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
            
          ],
          include: [
            {
              association: "ass_produtor_rural_cidade",
              attributes: ["id", "nome_municipio"],
              include:[
                {
                  association: "ass_municipio_regiao",
                  attributes: ["id", "nome"],
                },

              ]
            },
            
          ],
        });
    
        return res.status(200).json(getFarmer);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar agricultores" });
      }
    }

    static async atualizaFarmer(req, res) {
        const { id } = req.params;
        const produtor = req.body;
        // console.log('user', user)
        try {
          await database.produtor_rural.update(produtor, { where: { id: Number(id) } });
          const updateFarmer = await database.produtor_rural.findOne({
            where: { id: Number(id) },
          });
          return res.status(200).json(updateFarmer);
        } catch (error) {
          return res.status(500).json(error.message);
        }
      }

      static async deletaFarmer(req, res) {
          const { id } = req.params;
          const apaga = req.body;
      
          try {
            await database.produtor_rural.destroy({ where: { id: Number(id) } });
            return res.status(200).json({
              mensagem: `O Produtor ${apaga.nome} foi excluido com sucesso!!`,
            });
          } catch (erro) {
            return res.status(500).json(error.message);
          }
        }
}

module.exports = AgroControllers;
