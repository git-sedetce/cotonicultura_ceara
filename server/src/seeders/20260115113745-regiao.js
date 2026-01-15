'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "regiaos",
      [
        {
          nome: "Cariri",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: "Centro Sul",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: "Grande Fortaleza",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: "Litoral leste",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: "Litoral Norte",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: "Litoral Oeste/Vale do Curu",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: "Maciço do Baturité",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: "Serra da Ibiapaba",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: "Sertão Central",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: "Sertão de Canindé",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: "Sertão de Sobral",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: "Sertão do Crateús",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: "Sertão dos Inhamus",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          nome: "Vale do Jaguaribe",
          createdAt: new Date(),
          updatedAt: new Date()
        },        
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("regiaos", null, {});
  }
};
