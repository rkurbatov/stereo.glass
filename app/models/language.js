module.exports = function (mongoose) {
    'use strict';

    var Schema = mongoose.Schema;

    var Translation = new Schema({
        hash: Number,
        tr: String,
        status: String
    });

    var LanguageSchema = new Schema({
        code: String,
        name: String,
        data: [Translation]
    });

    return mongoose.model('Language', LanguageSchema);
};
