'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('distribuicao_sementes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      agricultor_id:{
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'produtor_rurals', key: 'id'}
      },
      pedido: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      qtde_sementes: {
        type: Sequelize.DOUBLE
      },      
      pedido_atendido: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      ano_distribuicao: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('distribuicao_sementes');
  }
};