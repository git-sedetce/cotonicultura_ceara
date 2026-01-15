'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class produtor_rural extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      produtor_rural.belongsTo(models.cidades, { foreignKey: 'cidade', as: 'ass_produtor_rural_cidade' })
    }
  }
  produtor_rural.init({
    nome: DataTypes.STRING,
    cpf_cnpj: DataTypes.STRING,
    rg: DataTypes.STRING,
    endereco: DataTypes.STRING,
    nome_propriedade: DataTypes.STRING,
    area_total: DataTypes.DOUBLE,
    area_algodao: DataTypes.DOUBLE,
    regime_cultivo: DataTypes.STRING,
    cadastro_adagri: DataTypes.STRING,
    confirma_informacao: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'produtor_rural',
  });
  return produtor_rural;
};