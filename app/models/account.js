module.exports = function (mongoose) {
    'use strict';

    var Schema = mongoose.Schema;
    var passportLocalMongoose = require('passport-local-mongoose');

    var AccountSchema = new Schema({
        username: {type: String, required: true, unique: true},
        usermail: {type: String, required: true, unique: true},
        password: String,
        resetPasswordToken: String,
        resetPasswordExpires: String,
        avatar: String,
        role: {
            type: String,
            default: "visitor"
        },
        borderColor: String,
        createdAt: Date,
        activeAt: Date
    });

    AccountSchema.pre('save', function (next) {

        var account = this;

        if (!account.createdAt) {
            account.createdAt = new Date;
        }

        if (!account.isModified('password')) return next();

        account.setPassword(account.password, function(err){
            account.password = undefined;
            next(err);
        });

    });

    AccountSchema.plugin(passportLocalMongoose, {usernameField: 'usermail'});
    var Account = mongoose.model('Account', AccountSchema);
    return Account;
};
