const express = require('express')
const router = express.Router()

const databaseName = 'corona-overview-app'
const databaseUser = 'Raphael:coroverview123'
const url = `mongodb+srv://${databaseUser}@corona-overview-app.cgz9f.mongodb.net/${databaseName}?retryWrites=true&w=majority`
const mongoClient = require('mongodb').MongoClient

const countryModel = require('../models/country')

router.get('/countries', (req, res, next) => {
    mongoClient.connect(url, (error, client) => {
        const db = client.db('coroverview_db')
        db.collection('country_full').find({}).toArray((err, result) => {
            if (err) res.send(err)
            res.send(result)
        })
    })
})

router.get('/countryViaCode', (req, res, next) => {
    const countryCode = req.query.code
    mongoClient.connect(url, (error, client) => {
        const db = client.db('coroverview_db')
        db.collection('country_full').findOne({country_code: countryCode}, (err, result) => {
            if (err) res.send(err)
            res.send(result)
        })
    })
})

module.exports = router;