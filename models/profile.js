var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var profileSchema = new Schema({
}, {
    strict: false,
    timestamps: true,
    usePushEach: true
});

var Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;