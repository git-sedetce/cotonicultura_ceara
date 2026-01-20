'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class anexo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      anexo.belongsTo(models.produtor_rural, { foreignKey: 'agricultor_id', as: 'ass_anexo_agricultor' })
    }
  }
  anexo.init({
    tipo_anexo: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    filename: DataTypes.STRING,
    path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'anexo',
  });
  return anexo;
};