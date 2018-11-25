var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HenquirySchema = new Schema({
    aide: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    potentialAide: [{type: Schema.Types.ObjectId, ref: 'User'}], // muss getestet werden
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
    postalcode: { type: String, required: true },
    creationTime: { type: Date, required: true},
    startTime: { type: Date, required: true},
    endTime: { type: Date, required: true},
    amountAide: { type: Number, default: 1},
    closed: {type: Boolean, default: false},
    removed: {type: Boolean, default: false},
    happened: {type: Boolean, default: false},
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    distance: {type: Number}
}, {versionKey: false});

var Henquiry = mongoose.model('Henquiry', HenquirySchema);
module.exports = Henquiry;