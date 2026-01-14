const express = require('express')
const evento = require('./eventoRoutes')
const acompanhamento = require('./acompanhamentoRoutes')
const type = require('./typeRoutes')
const statistics = require('./statisticsRoutes')
const user = require('./userRoutes')
const anexo = require('./anexoRoutes')
const audit = require('./auditRoutes')


module.exports = app => {
    app.use(express.json(),
            express.urlencoded({ extended: false }),
            evento,
            acompanhamento,
            type,
            statistics,
            user,
            anexo,
            audit
            )
}