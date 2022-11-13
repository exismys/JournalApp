const mongoose = require('mongoose');

async function connect() {
    const uri = process.env.uri;
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
}

module.exports = connect;