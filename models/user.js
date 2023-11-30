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
                id: {type: Number, required: true},
                heading: {type: String, required: true},
                body: {type: String, required: true},
            }
        ]
    }
);

// Creating Model
const User = mongoose.model('UserData', userSchema);

module.exports = User;