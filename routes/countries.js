const express = require('express')
const router = express.Router()

const databaseName = 'corona-overview-app'
const databaseUser = 'Raphael:coroverview123'
const url = `mongodb+srv://${databaseUser}@corona-overview-app.cgz9f.mongodb.net/${databaseName}?retryWrites=true&w=majority`
const mongoClient = require('mongodb').MongoClient

const country_codes_package = require('country-calling-code');

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

router.get('/countryViaDialcode', (req, res, next) => {
    const dialCode = req.query.dialcode
    const dialCodeTrimmed = dialCode.substring(1, dialCode.length)

    const codes = country_codes_package.codes

    let codeIsCorrect = false

    for (let i = 0; i < codes.length; i++) {
        for (let j = 0; j < codes[i].countryCodes.length; j++) {
            if (codes[i].countryCodes[j] === dialCodeTrimmed) {
                codeIsCorrect = true
            }
        }
        if (codeIsCorrect) {
            mongoClient.connect(url, (error, client) => {
                const db = client.db('coroverview_db')
                db.collection('country_full').findOne({country_code: codes[i].isoCode3}, (err, result) => {
                    if (err) res.send(err)
                    res.send(result)
                })
            })
            break
        }
    }
})

router.get('/countryIsoCode2', (req, res, next) => {
    const dialCode = req.query.dialcode
    const dialCodeTrimmed = dialCode.substring(1, dialCode.length)

    let codeCorrect = false;

    const codes = country_codes_package.codes

    for (let i = 0; i < codes.length; i++) {
        for (let j = 0; j < codes[i].countryCodes.length; j++) {
            if (codes[i].countryCodes[j] === dialCodeTrimmed) {
                codeCorrect = true
            }
        }
        if (codeCorrect) {
            res.send(codes[i].isoCode2)
            break
        }
    }
})

router.post('/createHistory', (req, res, next) => {
    const country = req.body.country
    const country_code = req.body.country_code
    const date = req.body.date
    const population = req.body.population
    const cases = req.body.cases
    const deaths = req.body.deaths
    const hospital = req.body.hospital
    const icu = req.body.icu


    mongoClient.connect(url, (error, client) => {
        const db = client.db('coroverview_db')
        db.collection('country_history').insertOne({country, country_code, date, population, cases, deaths, hospital, icu} ,(err, result) => {
            if (err) console.log(err)
            console.log(result);
            //res.send("Successful insertion")
        })
    })
})

module.exports = router;