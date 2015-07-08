module.exports = function (mongoose) {
    'use strict';

    var Schema = mongoose.Schema;

    var Ratings = new Schema({
        value: Number,
        assignedBy: String,
        assignedAt: Date
    });

    var LayoutSchema = new Schema({
        name: {type: String, unique: true},
        urlDir: String,
        url2d: String,
        urlThumb: String,
        createdBy: String,
        createdAt: Date,
        ratings: [Ratings],
        average: Number,
        catColors: [String],
        catPlots: [String],
        catAssortment: [String],
        catCountries: [String],
        designerComment: String,
        isHidden: Boolean,
        status: String,
        assignedTo: String,
        assignedBy: String,
        assignedAt: Date,
        assignedComment: String,
        acceptedAt: Date,
        acceptedComment: String,
        finishedAt: Date,
        finishedComment: String,
        reference: Number
    });

    Ratings.pre('save', function (next) {
        var self  = this;

        if (!self.assignedAt) {
            self.assignedAt = new Date();
        }
        next();
    });

    LayoutSchema.pre('save', function (next) {
        var self = this;

        if (!self.createdAt) {
            self.createdAt = new Date();
        }

        next();
    });

    var Layout = mongoose.model('Layout', LayoutSchema);
    return Layout;
};
