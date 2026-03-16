'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('produtor_rurals', 'uso_dados', {
      type: Sequelize.DataTypes.BOOLEAN, // Tipo da coluna
      allowNull: false,                // Configuração de NULL permitido
      defaultValue: false,                // Valor padrão (opcional)
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('produtor_rurals', 'uso_dados');
  }
};
