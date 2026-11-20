'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('produtor_rurals', 'login_ativado', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.bulkUpdate('produtor_rurals', { login_ativado: true }, {});
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('produtor_rurals', 'login_ativado');
  },
};
