'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('produtor_rurals', 'email_trabalhador', {
      type: Sequelize.DataTypes.STRING, // Tipo da coluna
      allowNull: true,                // Configuração de NULL permitido
      defaultValue: '',                // Valor padrão (opcional)
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('produtor_rurals', 'email_trabalhador');
  }
};
