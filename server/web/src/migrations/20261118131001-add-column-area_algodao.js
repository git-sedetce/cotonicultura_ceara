'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('distribuicao_sementes', 'area_algodao', {
      type: Sequelize.DataTypes.DOUBLE, // Tipo da coluna
      allowNull: true,                // Configuração de NULL permitido
      defaultValue: 0,                // Valor padrão (opcional)
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('distribuicao_sementes', 'area_algodao');
  }
};
