const fs = require("fs");
const filepath_cases = '../overview_10012021.json'
const filepath_hospitality = '../hospitality_10012021.json'

// const countryModel = require('../models/country')

const databaseName = 'corona-overview-app'
const databaseUser = 'Raphael:coroverview123'
const url = `mongodb+srv://${databaseUser}@corona-overview-app.cgz9f.mongodb.net/${databaseName}?retryWrites=true&w=majority`
const mongoClient = require('mongodb').MongoClient

let countries = []

const readFile = (filepath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err) {
                reject(err)
            }
            resolve(data)
        });
    });
}

const executeRead = () => {

    readFile(filepath_cases).then((result) => {
        const json = JSON.parse(result)

        let count = 0

        let cases = 0
        let deaths = 0
        let hospital = 0
        let icu = 0

        for (let i = 0; i < json.length; i++) {
            if (json[i].year_week === '2020-53') {
                let country = json[i].country
                let population = json[i].population
                let countryCode = json[i].country_code
                let date = json[i].year_week
                switch (json[i].indicator) {
                    case 'cases':
                        cases = json[i].weekly_count
                        break
                    case 'deaths':
                        deaths = json[i].weekly_count
                        break
                }
                count++
                if (count === 2) {

                    const newCountry = {
                        country: country,
                        country_code: countryCode,
                        date: date,
                        population: population,
                        cases: cases,
                        deaths: deaths,
                        hospital: hospital,
                        icu: icu,
                    }

                    countries.push(newCountry)

                    // console.log(countries)

                    count = 0
                }

            }
        }

        readFile(filepath_hospitality).then((result) => {
            const json = JSON.parse(result)

            let icu = 0
            let hospital = 0
            let country = ''

            for (let i = 0; i < json.length; i++) {
                if (json[i].year_week === '2020-W53' && json[i].indicator === "Daily ICU occupancy") {
                    country = json[i].country
                    icu = json[i].value
                } else if (json[i].year_week === '2020-W53' && json[i].indicator === "Daily hospital occupancy") {
                    country = json[i].country
                    hospital = json[i].value
                }
                for (let j = 0; j < countries.length; j++) {
                    if (countries[j].country === country) {
                        countries[j].hospital = hospital
                        countries[j].icu = icu


                    }
                }
            }

            mongoClient.connect(url, (error, client) => {
                const db = client.db('coroverview_db')
                db.collection('country_full').insertMany(countries).then(r => console.log('successfully added new country'))
                client.close()
            })

            console.log(countries)
            return countries;
        })
    })
}

executeRead()