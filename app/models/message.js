module.exports = function (mongoose) {
    'use strict';

    var Schema = mongoose.Schema;
    
    var MessageSchema = new Schema({
        from: String,
        to: String,
        toGroup: [String],
        createdAt: Date,
        type: String,
        header: String,
        body: String
    });

    MessageSchema.pre('save', function (next) {

        if (!this.createdAt) {
            this.createdAt = new Date;
        }

        next();
    });

    var Message = mongoose.model('Message', MessageSchema);
    return Message;
};