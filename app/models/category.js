// TODO: rewrite in modern style
module.exports = function (mongoose) {
    'use strict';

    var async = require('async');
    var dbAux = require('../helpers/db-aux.js');
    var Schema = mongoose.Schema;

    var CategorySchema = new Schema({
        catName: {type: String},
        subCatName: {type: String, default: ''},
        leaves: [{type: Schema.Types.ObjectId, ref: 'CatLeaf'}]
    });

    var CatLeafSchema = new Schema({
        name: String,
        value: {type: String, unique: true},
        subtext: String,
        icon: String
    });

    CategorySchema.statics.addTo = function (catName, subCatName, obj) {
        var selector = {catName: catName, subCatName: subCatName};
        var query = Category.where(selector);

        if (!Array.isArray(obj)) {
            obj = [obj];            // convert obj to array for map even on one object
        }

        async.waterfall([
            // receive document of category with given selector
            function (callback) {
                query.findOne(callback);
            },
            function (result, callback) {
                if (!result) {
                    Category.create(selector, function (err, result) {
                        return callback(err, result);
                    });                               // Create new category with given selector if result is empty
                } else {
                    callback(null, result);
                }                                     // or go further with same result
            },
            function (result, callback) {
                async.map(obj, addLeaf, function onComplete(err, results) {
                    if (err) dbAux.showError;
                    else Category.findByIdAndUpdate(result._id, {$push: {leaves: {$each: results}}}, function () {
                    });
                });
            },
            dbAux.showError // just show an error if any
        ]);

        function addLeaf(leaf, done) {
            CatLeaf.create(leaf, function (err, result) {
                console.log(leaf);
                if (err) {
                    dbAux.showError(err)
                    return done(err);
                } else {
                    console.log(result);
                    return done(err, result._id);
                }
            });
        }
    };

    var Category = mongoose.model('Category', CategorySchema);
    var CatLeaf = mongoose.model('CatLeaf', CatLeafSchema);

    return Category;
};