"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "cidades",
      [
        {
          nome_municipio: "Abaiara",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2300101",
        },

        {
          nome_municipio: "Acarape",
          regiao_id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2300150",
        },

        {
          nome_municipio: "Acaraú",
          regiao_id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2300200",
        },

        {
          nome_municipio: "Acopiara",
          regiao_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2300309",
        },

        {
          nome_municipio: "Aiuaba",
          regiao_id: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2300408",
        },

        {
          nome_municipio: "Alcântaras",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2300507",
        },

        {
          nome_municipio: "Altaneira",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2300606",
        },

        {
          nome_municipio: "Alto Santo",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2300705",
        },

        {
          nome_municipio: "Amontada",
          regiao_id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2300754",
        },

        {
          nome_municipio: "Antonina do Norte",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2300804",
        },

        {
          nome_municipio: "Apuiarés",
          regiao_id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2300903",
        },

        {
          nome_municipio: "Aquiraz",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2301000",
        },

        {
          nome_municipio: "Aracati",
          regiao_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2301109",
        },

        {
          nome_municipio: "Aracoiaba",
          regiao_id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2301208",
        },

        {
          nome_municipio: "Ararendá",
          regiao_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2301257",
        },

        {
          nome_municipio: "Araripe",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2301307",
        },

        {
          nome_municipio: "Aratuba",
          regiao_id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2301406",
        },

        {
          nome_municipio: "Arneiroz",
          regiao_id: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2301505",
        },

        {
          nome_municipio: "Assaré",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2301604",
        },

        {
          nome_municipio: "Aurora",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2301703",
        },

        {
          nome_municipio: "Baixio",
          regiao_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2301802",
        },

        {
          nome_municipio: "Banabuiú",
          regiao_id: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2301851",
        },

        {
          nome_municipio: "Barbalha",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2301901",
        },

        {
          nome_municipio: "Barreira",
          regiao_id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2301950",
        },

        {
          nome_municipio: "Barro",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2302008",
        },

        {
          nome_municipio: "Barroquinha",
          regiao_id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2302057",
        },

        {
          nome_municipio: "Baturité",
          regiao_id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2302107",
        },

        {
          nome_municipio: "Beberibe",
          regiao_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2302206",
        },

        {
          nome_municipio: "Bela Cruz",
          regiao_id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2302305",
        },

        {
          nome_municipio: "Boa Viagem",
          regiao_id: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2302404",
        },

        {
          nome_municipio: "Brejo Santo",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2302503",
        },

        {
          nome_municipio: "Camocim",
          regiao_id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2302602",
        },

        {
          nome_municipio: "Campos Sales",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2302701",
        },

        {
          nome_municipio: "Canindé",
          regiao_id: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2302800",
        },

        {
          nome_municipio: "Capistrano",
          regiao_id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2302909",
        },

        {
          nome_municipio: "Caridade",
          regiao_id: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2303006",
        },

        {
          nome_municipio: "Cariré",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2303105",
        },

        {
          nome_municipio: "Caririaçu",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2303204",
        },

        {
          nome_municipio: "Cariús",
          regiao_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2303303",
        },

        {
          nome_municipio: "Carnaubal",
          regiao_id: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2303402",
        },

        {
          nome_municipio: "Cascavel",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2303501",
        },

        {
          nome_municipio: "Catarina",
          regiao_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2303600",
        },

        {
          nome_municipio: "Catunda",
          regiao_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2303659",
        },

        {
          nome_municipio: "Caucaia",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2303709",
        },

        {
          nome_municipio: "Cedro",
          regiao_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2303808",
        },

        {
          nome_municipio: "Chaval",
          regiao_id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2303907",
        },

        {
          nome_municipio: "Choró",
          regiao_id: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2303931",
        },

        {
          nome_municipio: "Chorozinho",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2303956",
        },

        {
          nome_municipio: "Coreaú",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304004",
        },

        {
          nome_municipio: "Crateús",
          regiao_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304103",
        },

        {
          nome_municipio: "Crato",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304202",
        },

        {
          nome_municipio: "Croatá",
          regiao_id: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304236",
        },

        {
          nome_municipio: "Cruz",
          regiao_id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304251",
        },

        {
          nome_municipio: "Deputado Irapuan Pinheiro",
          regiao_id: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304269",
        },

        {
          nome_municipio: "Ereré",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304277",
        },

        {
          nome_municipio: "Eusébio",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304285",
        },

        {
          nome_municipio: "Farias Brito",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304301",
        },

        {
          nome_municipio: "Forquilha",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304350",
        },

        {
          nome_municipio: "Fortaleza",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304400",
        },

        {
          nome_municipio: "Fortim",
          regiao_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304459",
        },

        {
          nome_municipio: "Frecheirinha",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304509",
        },

        {
          nome_municipio: "General Sampaio",
          regiao_id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304608",
        },

        {
          nome_municipio: "Graça",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304657",
        },

        {
          nome_municipio: "Granja",
          regiao_id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304707",
        },

        {
          nome_municipio: "Granjeiro",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304806",
        },

        {
          nome_municipio: "Groaíras",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304905",
        },

        {
          nome_municipio: "Guaiúba",
          regiao_id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2304954",
        },

        {
          nome_municipio: "Guaraciaba do Norte",
          regiao_id: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305001",
        },

        {
          nome_municipio: "Guaramiranga",
          regiao_id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305100",
        },

        {
          nome_municipio: "Hidrolândia",
          regiao_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305209",
        },

        {
          nome_municipio: "Horizonte",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305233",
        },

        {
          nome_municipio: "Ibaretama",
          regiao_id: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305266",
        },

        {
          nome_municipio: "Ibiapina",
          regiao_id: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305308",
        },

        {
          nome_municipio: "Ibicuitinga",
          regiao_id: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305332",
        },

        {
          nome_municipio: "Icapuí",
          regiao_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305357",
        },

        {
          nome_municipio: "Icó",
          regiao_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305407",
        },

        {
          nome_municipio: "Iguatu",
          regiao_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305506",
        },

        {
          nome_municipio: "Independência",
          regiao_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305605",
        },

        {
          nome_municipio: "Ipaporanga",
          regiao_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305654",
        },

        {
          nome_municipio: "Ipaumirim",
          regiao_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305704",
        },

        {
          nome_municipio: "Ipu",
          regiao_id: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305803",
        },

        {
          nome_municipio: "Ipueiras",
          regiao_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2305902",
        },

        {
          nome_municipio: "Iracema",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2306009",
        },

        {
          nome_municipio: "Irauçuba",
          regiao_id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2306108",
        },

        {
          nome_municipio: "Itaiçaba",
          regiao_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2306207",
        },

        {
          nome_municipio: "Itaitinga",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2306256",
        },

        {
          nome_municipio: "Itapajé",
          regiao_id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2306306",
        },

        {
          nome_municipio: "Itapipoca",
          regiao_id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2306405",
        },

        {
          nome_municipio: "Itapiúna",
          regiao_id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2306504",
        },

        {
          nome_municipio: "Itarema",
          regiao_id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2306553",
        },

        {
          nome_municipio: "Itatira",
          regiao_id: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2306603",
        },

        {
          nome_municipio: "Jaguaretama",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2306702",
        },

        {
          nome_municipio: "Jaguaribara",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2306801",
        },

        {
          nome_municipio: "Jaguaribe",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2306900",
        },

        {
          nome_municipio: "Jaguaruana",
          regiao_id: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2307007",
        },

        {
          nome_municipio: "Jardim",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2307106",
        },

        {
          nome_municipio: "Jati",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2307205",
        },

        {
          nome_municipio: "Jijoca de Jericoacoara",
          regiao_id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2307254",
        },

        {
          nome_municipio: "Juazeiro do Norte",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2307304",
        },

        {
          nome_municipio: "Jucás",
          regiao_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2307403",
        },

        {
          nome_municipio: "Lavras da Mangabeira",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2307502",
        },

        {
          nome_municipio: "Limoeiro do Norte",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2307601",
        },

        {
          nome_municipio: "Madalena",
          regiao_id: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2307635",
        },

        {
          nome_municipio: "Maracanaú",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2307650",
        },

        {
          nome_municipio: "Maranguape",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2307700",
        },

        {
          nome_municipio: "Marco",
          regiao_id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2307809",
        },

        {
          nome_municipio: "Martinópole",
          regiao_id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2307908",
        },

        {
          nome_municipio: "Massapê",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2308005",
        },

        {
          nome_municipio: "Mauriti",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2308104",
        },

        {
          nome_municipio: "Meruoca",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2308203",
        },

        {
          nome_municipio: "Milagres",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2308302",
        },

        {
          nome_municipio: "Milhã",
          regiao_id: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2308351",
        },

        {
          nome_municipio: "Miraíma",
          regiao_id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2308377",
        },

        {
          nome_municipio: "Missão Velha",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2308401",
        },

        {
          nome_municipio: "Mombaça",
          regiao_id: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2308500",
        },

        {
          nome_municipio: "Monsenhor Tabosa",
          regiao_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2308609",
        },

        {
          nome_municipio: "Morada Nova",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2308708",
        },

        {
          nome_municipio: "Moraújo",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2308807",
        },

        {
          nome_municipio: "Morrinhos",
          regiao_id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2308906",
        },

        {
          nome_municipio: "Mucambo",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2309003",
        },

        {
          nome_municipio: "Mulungu",
          regiao_id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2309102",
        },

        {
          nome_municipio: "Nova Olinda",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2309201",
        },

        {
          nome_municipio: "Nova Russas",
          regiao_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2309300",
        },

        {
          nome_municipio: "Novo Oriente",
          regiao_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2309409",
        },

        {
          nome_municipio: "Ocara",
          regiao_id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2309458",
        },

        {
          nome_municipio: "Orós",
          regiao_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2309508",
        },

        {
          nome_municipio: "Pacajus",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2309607",
        },

        {
          nome_municipio: "Pacatuba",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2309706",
        },

        {
          nome_municipio: "Pacoti",
          regiao_id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2309805",
        },

        {
          nome_municipio: "Pacujá",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2309904",
        },

        {
          nome_municipio: "Palhano",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2310001",
        },

        {
          nome_municipio: "Palmácia",
          regiao_id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2310100",
        },

        {
          nome_municipio: "Paracuru",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2310209",
        },

        {
          nome_municipio: "Paraipaba",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2310258",
        },

        {
          nome_municipio: "Parambu",
          regiao_id: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2310308",
        },

        {
          nome_municipio: "Paramoti",
          regiao_id: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2310407",
        },

        {
          nome_municipio: "Pedra Branca",
          regiao_id: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2310506",
        },

        {
          nome_municipio: "Penaforte",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2310605",
        },

        {
          nome_municipio: "Pentecoste",
          regiao_id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2310704",
        },

        {
          nome_municipio: "Pereiro",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2310803",
        },

        {
          nome_municipio: "Pindoretama",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2310852",
        },

        {
          nome_municipio: "Piquet Carneiro",
          regiao_id: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2310902",
        },

        {
          nome_municipio: "Pires Ferreira",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2310951",
        },

        {
          nome_municipio: "Poranga",
          regiao_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2311009",
        },

        {
          nome_municipio: "Porteiras",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2311108",
        },

        {
          nome_municipio: "Potengi",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2311207",
        },

        {
          nome_municipio: "Potiretama",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2311231",
        },

        {
          nome_municipio: "Quiterianópolis",
          regiao_id: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2311264",
        },

        {
          nome_municipio: "Quixadá",
          regiao_id: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2311306",
        },

        {
          nome_municipio: "Quixelô",
          regiao_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2311355",
        },

        {
          nome_municipio: "Quixeramobim",
          regiao_id: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2311405",
        },

        {
          nome_municipio: "Quixeré",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2311504",
        },

        {
          nome_municipio: "Redenção",
          regiao_id: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2311603",
        },

        {
          nome_municipio: "Reriutaba",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2311702",
        },

        {
          nome_municipio: "Russas",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2311801",
        },

        {
          nome_municipio: "Saboeiro",
          regiao_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2311900",
        },

        {
          nome_municipio: "Salitre",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2311959",
        },

        {
          nome_municipio: "Santa Quitéria",
          regiao_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2312205",
        },

        {
          nome_municipio: "Santana do Acaraú",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2312007",
        },

        {
          nome_municipio: "Santana do Cariri",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2312106",
        },

        {
          nome_municipio: "São Benedito",
          regiao_id: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2312304",
        },

        {
          nome_municipio: "São Gonçalo do Amarante",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2312403",
        },

        {
          nome_municipio: "São João do Jaguaribe",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2312502",
        },

        {
          nome_municipio: "São Luís do Curu",
          regiao_id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2312601",
        },

        {
          nome_municipio: "Senador Pompeu",
          regiao_id: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2312700",
        },

        {
          nome_municipio: "Senador Sá",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2312809",
        },

        {
          nome_municipio: "Sobral",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2312908",
        },

        {
          nome_municipio: "Solonópole",
          regiao_id: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313005",
        },

        {
          nome_municipio: "Tabuleiro do Norte",
          regiao_id: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313104",
        },

        {
          nome_municipio: "Tamboril",
          regiao_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313203",
        },

        {
          nome_municipio: "Tarrafas",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313252",
        },

        {
          nome_municipio: "Tauá",
          regiao_id: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313302",
        },

        {
          nome_municipio: "Tejuçuoca",
          regiao_id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313351",
        },

        {
          nome_municipio: "Tianguá",
          regiao_id: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313401",
        },

        {
          nome_municipio: "Trairi",
          regiao_id: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313500",
        },

        {
          nome_municipio: "Tururu",
          regiao_id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313559",
        },

        {
          nome_municipio: "Ubajara",
          regiao_id: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313609",
        },

        {
          nome_municipio: "Umari",
          regiao_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313708",
        },

        {
          nome_municipio: "Umirim",
          regiao_id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313757",
        },

        {
          nome_municipio: "Uruburetama",
          regiao_id: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313807",
        },

        {
          nome_municipio: "Uruoca",
          regiao_id: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313906",
        },

        {
          nome_municipio: "Varjota",
          regiao_id: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2313955",
        },

        {
          nome_municipio: "Várzea Alegre",
          regiao_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2314003",
        },

        {
          nome_municipio: "Viçosa do Ceará",
          regiao_id: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
          cod_ibge: "2314102",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("cidades", null, {});
  },
};
