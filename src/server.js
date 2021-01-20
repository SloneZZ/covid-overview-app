const express = require('express')
const bodyParser = require('body-parser')
const countries = require('../routes/countries')

const databaseName = 'corona-overview-app'
const databaseUser = 'Raphael:coroverview123'
const connectionURL = `mongodb+srv://${databaseUser}@corona-overview-app.cgz9f.mongodb.net/${databaseName}?retryWrites=true&w=majority` || `mongodb://127.0.0.1:27017/${databaseName}`

const app = express()

app.use(bodyParser.urlencoded({
    extended: true,
}))

app.use(bodyParser.json())

app.use("/countries", countries);

app.listen(port = (process.env.PORT || 3000), function () {
    console.log(`App listening on port ${port}, Database: ${databaseName}`);
});