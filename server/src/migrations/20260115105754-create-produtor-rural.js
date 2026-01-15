'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('produtor_rurals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      telefone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cpf_cnpj: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rg: {
        type: Sequelize.STRING
      },
      endereco: {
        type: Sequelize.STRING,
        allowNull: false,
      },      
      cidade: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'cidades', key: 'id' }
      },
      nome_propriedade: {
        type: Sequelize.STRING
      },
      ponto_referencia: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      area_total: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      area_algodao: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      regime_cultivo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cadastro_adagri: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      confirma_informacao: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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
    await queryInterface.dropTable('produtor_rurals');
  }
};