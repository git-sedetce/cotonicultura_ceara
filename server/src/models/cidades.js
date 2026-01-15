'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cidades extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      cidades.belongsTo(models.regiao, { foreignKey: 'regiao_id', as: 'ass_municipio_regiao' })
      cidades.hasMany(models.produtor_rural, { foreignKey: 'cidade', as: 'ass_cidades_produtor_rural' })
    }
  }
  cidades.init({
    nome_municipio: DataTypes.STRING,
    cod_ibge: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'cidades',
  });
  return cidades;
};