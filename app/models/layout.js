module.exports = function (mongoose) {
    'use strict';

    var Schema = mongoose.Schema;

    var Rating = new Schema({
        value: Number,
        assignedBy: String,
        assignedAt: Date
    });

    var Comment = new Schema({
        postedBy: String,
        postedAt: Date,
        text: String
    });

    var LayoutSchema = new Schema({
        name: {type: String, unique: true},
        urlDir: String,
        url2d: String,
        urlThumb: String,
        urlThumbLoRes: String,
        urlStaticHiRes: String,
        urlVideoHiRes: String,
        urlGifHiRes: String,
        urlGifLoRes: String,
        urlPsdLayout: String,
        urlTifLayout: String,
        urlTxtProject: String,

        createdBy: String,
        createdAt: Date,
        ratings: [Rating],
        comments: [Comment],
        average: Number,

        catColors: [String],
        catPlots: [String],
        catAssortment: [String],
        catCountries: [String],

        isHidden: Boolean,
        isPublished: Boolean,
        status: String,

        designerComment: String,
        assignedTo: String,
        assignedBy: String,
        assignedAt: Date,
        assignedComment: String,
        acceptedAt: Date,
        acceptedComment: String,
        rejectedAt: Date,
        rejectedComment: String,
        dismissedAt: Date,
        dismissedComment: String,
        finishedAt: Date,
        finishedComment: String,
        approvedBy: String,
        approvedAt: Date,
        approvedComment: String,

        reference: Number
    });

    Rating.pre('save', function (next) {
        var self = this;

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
