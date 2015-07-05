module.exports = function (mongoose) {
    'use strict';

    var Schema = mongoose.Schema;
    
    var MessageSchema = new Schema({
        fromUser: String,
        toUser: String,
        toGroup: [String],
        createdAt: Date,
        type: String,
        subType: String,
        readStatus: String,
        header: String,
        body: String
    });

    MessageSchema.pre('save', function (next) {

        if (!this.createdAt) {
            this.createdAt = new Date;
        }

        if (!this.readStatus) {
            this.readStatus = 'unread';
        }

        next();
    });

    var Message = mongoose.model('Message', MessageSchema);
    return Message;
};