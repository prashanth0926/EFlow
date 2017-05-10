/**
 * Created by pmolakala on 5/9/17.
 */

/**
 * Created by Prashanth Molakala on 7/19/2016.
 */

var express = require('express');
var bodyParser = require('body-parser');
var qaRouter = express.Router();
var QAs = require('../models/qas');
var verify = require('../verify');

qaRouter.use(bodyParser.json());

qaRouter.route('/')
    .get(verify.verifyOrdinaryUser, function (req, res, next) {
        QAs.find({})
            .populate('answers.userId')
            .populate('userId')
            .exec(function (err, out) {
                if (err)    throw err;
                res.json(out);
            });
    })
    .post(verify.verifyOrdinaryUser, function (req, res, next) {
        req.body.userId = req.decoded._id;
        QAs.create(req.body, function (err, out) {
            if (err)    throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.json(out);
        });
    })
    .delete(verify.verifyOrdinaryUser, verify.verifyAdmin, function (req, res, next) {
        QAs.remove(function (err, out) {
            if (err)    throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Cleared all QAs');
        });
    });

qaRouter.route('/:Id')
    .get(verify.verifyOrdinaryUser, function (req, res, next) {
        QAs.findById(req.params.Id)
            .populate('answers.userId')
            .populate('userId')
            .exec(function (err, out) {
                if (err)    throw err;
                res.json(out);
            });
    })
    .put(verify.verifyOrdinaryUser, function (req, res, next) {
        QAs.findByIdAndUpdate(req.params.Id, {
            $set : req.body
        }, {
            new : true
        }, function (err, out) {
            if (err)    throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.json(out);
        });
    })
    .delete(verify.verifyOrdinaryUser, verify.verifyAdmin, function (req, res, next) {
        QAs.findByIdAndRemove(req.params.Id, function (err, out) {
            if (err)    throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Removed QA ' + out.title);
        });
    });

qaRouter.route('/:Id/answers')
    .get(verify.verifyOrdinaryUser, function (req, res, next) {
        QAs.findById(req.params.Id)
            .populate('answers.userId')
            .populate('userId')
            .exec(function (err, out) {
                if (err)    throw err;
                res.json(out.answers);
            });
    })
    .post(verify.verifyOrdinaryUser, function (req, res, next) {
        QAs.findById(req.params.Id, function (err, out) {
            if (err)    throw err;
            req.body.userId = req.decoded._id;
            out.answers.push(req.body);
            out.save(function (err, out) {
                if (err)    throw err;
                QAs.findById(out._id)
                    .populate('answers.userId')
                    .exec(function (err, out) {
                        if (err)    throw err;
                        res.json(out.answers);
                    });
            });
        });
    })
    .delete(verify.verifyOrdinaryUser, verify.verifyAdmin, function (req, res, next) {
        QAs.findById(req.params.Id, function (err, out) {
            if (err)    throw err;
            out.answers = [];
            out.save(function (err, out) {
                if (err)    throw err;
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Removed all answers for '+out.title);
            });
        });
    });

qaRouter.route('/:Id/answers/:answerId')
    .get(verify.verifyOrdinaryUser, function (req, res, next) {
        QAs.findById(req.params.Id)
            .populate('answers.userId')
            .exec(function (err, out) {
                if (err)    throw err;
                res.json(out.answers.id(req.params.answerId));
            });
    })
    .put(verify.verifyOrdinaryUser, function (req, res, next) {
        QAs.findById(req.params.Id, function (err, out) {
            if (err)    throw err;
            if (out.answers.id(req.params.answerId).userId
                != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            out.answers.id(req.params.answerId).remove();
            req.body.userId = req.decoded._id;
            out.answers.push(req.body);
            out.save(function (err, out) {
                if (err)    throw err;
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Updated answer');
            });
        });
    })
    .delete(verify.verifyOrdinaryUser, function (req, res, next) {
        QAs.findById(req.params.Id, function (err, out) {
            if (err)    throw err;
            if (out.answers.id(req.params.answerId).userId
                != req.decoded._id) {
                var err = new Error('You are not authorized to perform this operation!');
                err.status = 403;
                return next(err);
            }
            out.answers.id(req.params.answerId).remove();
            out.save(function (err, out) {
                if (err)    throw err;
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted answer');
            });
        });
    });

module.exports = qaRouter;