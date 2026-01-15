const database = require("../models");
const { Op } = require("sequelize");

class AgroControllers {
  static async registerAgro(req, res) {
    const newRegister = req.body;
    // console.log('newRegister', newRegister);
    try {
      const novoRegistro = await database.produtor_rural.create(newRegister);
      return res.status(200).json(novoRegistro);
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
}

module.exports = AgroControllers;
