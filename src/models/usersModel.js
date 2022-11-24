let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss"],
        required: "true"
    },

    fname: {
        type: String,
        required: "true", 
        trim: true
    },

    lname: {
        type: String,
        trim: true
    },

    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: "true"
    },

    email: {
        type: String,
        required: "true",
        unique: true,
        trim: true,
        lowercase: true,      
    },

    password: {
        type: String,
        required: 'true',
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Dharam_user", userSchema); 