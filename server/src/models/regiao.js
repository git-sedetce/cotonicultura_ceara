'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class regiao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      regiao.hasMany(models.cidades, { foreignKey: 'regiao_id', as: 'ass_regiao_municipio' })
    }
  }
  regiao.init({
    nome: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'regiao',
  });
  return regiao;
};