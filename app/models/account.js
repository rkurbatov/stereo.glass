module.exports = function (mongoose) {
    'use strict';

    var Schema = mongoose.Schema;
    var passportLocalMongoose = require('passport-local-mongoose');

    var AccountSchema = new Schema({
        username: String,
        usermail: String,
        password: String,
        avatar: String,
        role: {
            type: String,
            default: "user"
        },
        borderColor: String,
        createdAt: Date,
        activeAt: Date
    });

    AccountSchema.pre('save', function (next) {

        if (!this.createdAt) {
            this.createdAt = new Date;
        }

        next();
    });

    AccountSchema.plugin(passportLocalMongoose, {usernameField: 'usermail'});              //TODO: internationalize!
    var Account = mongoose.model('Account', AccountSchema);
    return Account;
};
