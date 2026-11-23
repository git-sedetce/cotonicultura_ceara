'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE "produtor_rurals"
      SET "email_trabalhador" = LOWER(BTRIM("email_trabalhador"))
      WHERE "email_trabalhador" IS NOT NULL
    `);
  },

  async down() {
  }
};
