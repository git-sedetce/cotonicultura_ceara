'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', "matricula_prefeitura", {
      type: Sequelize.DataTypes.STRING, // Tipo da coluna
      allowNull: true, // Configuração de NULL permitido
      defaultValue: null, // Valor padrão (opcional)
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', "matricula_prefeitura");
  }
};
