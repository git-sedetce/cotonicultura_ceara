'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class audit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      audit.belongsTo(models.user, { foreignKey: 'user_id', as: 'ass_audit_users' });
    }
  }
  audit.init({
    tipo_acao: DataTypes.STRING,
    acao: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'audit',
  });
  return audit;
};