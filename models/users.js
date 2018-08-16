/**
 * Created by Prashanth Molakala on 7/18/2016.
 */

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var user = new schema({
    username : String,
    password : String,
    fullName: String,
    imageUrl: {
        type: String,
        default: 'https://www.mautic.org/media/images/default_avatar.png'
    },
    admin : {
        type : Boolean,
        default : false
    },
    askedQuestions : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'QA'
        }
    ],
    answerCount : {
        type: Number,
        default: 0
    },
    topicsFollowing : [String],
    details : {}
}, {
    timestamps : true,
    usePushEach: true
});

user.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', user);