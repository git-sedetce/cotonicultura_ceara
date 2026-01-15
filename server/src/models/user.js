'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.belongsTo(models.profile, { foreignKey: 'profile_id', as: 'ass_user_profile' })
      user.belongsTo(models.secretaria_executiva, { foreignKey: 'sexec_id', as: 'ass_user_sexec' })
      user.hasMany(models.audit, { foreignKey: 'user_id', as: 'ass_users_audit' });
    }
  }
  user.init({
    nome: DataTypes.STRING,
    user_name: DataTypes.STRING,
    user_email: DataTypes.STRING,
    user_active: DataTypes.BOOLEAN,
    user_password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};