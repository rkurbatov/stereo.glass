module.exports = function (mongoose) {
	'use strict';

    var Schema = mongoose.Schema;

    var LayoutSchema = new Schema({
    	name: {type: String, unique: true},
    	urlDir: String,
        url2d: String,
        //url3d: String,
        //urlLayout: [String],
        urlThumb: String,
        createdBy: String,
    	createdAt: Date,
    	catColors: [String],
    	catPlots: [String],
    	catAssortment: [String],
    	catCountries: [String],
    	designerComment: String
    });

    LayoutSchema.pre('save', function (next) {
        if (!this.createdAt) {
            this.createdAt = new Date();
        }
        next();
    });

    var Layout = mongoose.model('Layout', LayoutSchema);
    return Layout;
};
