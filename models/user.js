const mongoose = require('mongoose');

// Creating Schema
const userSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        dob: {type: Date, required: true},
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        journals: [
            {
                heading: {type: String},
                body: {type: String}
            }
        ]
    }
);

// Creating Model
const User = mongoose.model('User', userSchema);

module.exports = User;