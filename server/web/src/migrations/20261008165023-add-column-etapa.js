'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('produtor_rurals', "etapa", {
      type: Sequelize.DataTypes.INTEGER, // Tipo da coluna
      allowNull: false, // Configuração de NULL permitido
      defaultValue: 1, // Valor padrão (opcional)
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('produtor_rurals', 'etapa');
  }
};
