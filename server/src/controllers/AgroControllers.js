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
        attributes: ["id", "nome_municipio"],
        where: {
          nome_municipio: {
            [Op.in]: [
              "Aiuaba",
              "Arneiroz",
              "Parambu",
              "Quiterianópolis",
              "Tauá",
              "Novo Oriente",
              "Pedra Branca",
              "Catarina",
              "Independência",
            ],
          },
        },
      });

      return res.status(200).json(cidadesFiltradas);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

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
}

module.exports = AgroControllers;
