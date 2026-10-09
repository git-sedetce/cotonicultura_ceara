'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', "cidade_id", {
      type: Sequelize.DataTypes.INTEGER, // Tipo da coluna
      allowNull: false, // Configuração de NULL permitido
      defaultValue: 59, // Valor padrão (opcional)
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'cidade_id');
  }
};
