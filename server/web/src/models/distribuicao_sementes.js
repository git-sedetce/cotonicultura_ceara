'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class distribuicao_sementes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      distribuicao_sementes.belongsTo(models.produtor_rural, { foreignKey: 'agricultor_id', as: 'ass_distribuicao_sementes_produtor_rural' });
    }
  }
  distribuicao_sementes.init({
    pedido: DataTypes.STRING,
    qtde_sementes: DataTypes.DOUBLE,
    pedido_atendido: DataTypes.BOOLEAN,
    ano_distribuicao: DataTypes.INTEGER,
    area_algodao: DataTypes.DOUBLE,
  }, {
    sequelize,
    modelName: 'distribuicao_sementes',
  });
  return distribuicao_sementes;
};