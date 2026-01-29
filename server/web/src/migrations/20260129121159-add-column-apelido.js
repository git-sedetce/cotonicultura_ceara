'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('produtor_rurals', 'apelido_trabalhador', {
      type: Sequelize.DataTypes.STRING, // Tipo da coluna
      allowNull: true,                // Configuração de NULL permitido
      defaultValue: false,                // Valor padrão (opcional)
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('produtor_rurals', 'apelido_trabalhador');
  }
};
