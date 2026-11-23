'use strict';

const { randomInt } = require('node:crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const [produtores] = await queryInterface.sequelize.query(`
      SELECT "id"
      FROM "produtor_rurals"
      WHERE "pin_trabalhador" LIKE '$2%'
    `);

    for (const produtor of produtores) {
      const pin = String(randomInt(0, 1_000_000)).padStart(6, '0');
      await queryInterface.bulkUpdate(
        'produtor_rurals',
        { pin_trabalhador: pin },
        { id: produtor.id },
      );
    }
  },

  async down() {},
};
