const express = require('express')
const agricultor = require('./agroRoutes')
const user = require('./userRoutes')
const audit = require('./auditRoutes')
const statistics = require('./statisticsRoutes')
const anexo = require('./anexoRoutes')


module.exports = app => {
    app.use(express.json(),
            express.urlencoded({ extended: false }),
            agricultor,
            user,
            audit,
            statistics, 
            anexo
            )
}