const express = require('express')
const agricultor = require('./agroRoutes')
const user = require('./userRoutes')
const audit = require('./auditRoutes')


module.exports = app => {
    app.use(express.json(),
            express.urlencoded({ extended: false }),
            agricultor,
            user,
            audit
            )
}