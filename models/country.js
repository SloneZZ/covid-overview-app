const mongoose = require("mongoose");
const schema = mongoose.Schema;
const countrySchema = new schema({
    country: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    population: {
        type: Number,
        required: true
    },
    cases: {
        type: Number,
        required: true
    },
    deaths: {
        type: Number,
        required: true
    },
    hospital: {
        type: Number,
    },
    icu: {
        type: Number,
    }
});

module.exports = country = mongoose.model("countries", countrySchema);