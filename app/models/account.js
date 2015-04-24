module.exports = function (mongoose) {
    'use strict';

    var async = require('async');
    var dbAux = require('../helpers/db-aux.js');
    var Schema = mongoose.Schema;
    var passportLocalMongoose = require('passport-local-mongoose');

    var AccountSchema = new Schema({
        username: String,
        password: String,
        avatar: String,
        role: {
            type: String,
            default: "User"
        },
        createdAt: Date,
        activeAt: Date
    });

    AccountSchema.pre('save', function (next) {

        if (!this.createdAt) {
            this.createdAt = new Date;
        }

        next();
    });

    AccountSchema.plugin(passportLocalMongoose);              //TODO: internationalize!
    var Account = mongoose.model('Account', AccountSchema);
    return Account;
};