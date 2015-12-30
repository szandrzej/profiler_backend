var express = require('express');
var router = express.Router();

var async       = require('async');
var Validator   = require('../helpers/requestValidator');
var Error       = require('../helpers/errorCreator');
var Users       = require('../models').User;
var Tokens      = require('../models').Token;

/* GET home page. */

router.post('/login', loginUser);

function loginUser(req, res, next) {
    async.waterfall([
        function (next) {
            Validator.checkRequiredFields(req.body, ['username', 'password'], next);
        },
        function (result, next) {
            Users.find({
                attributes: [
                    'username', 'password', 'slug'
                ],
                where: {
                    username: result.username
                },
                include: [
                    {
                        model: Tokens
                    }
                ]
            }).then(function (user) {
                if (!user) {
                    next(Error.createError({}, 'error.user_not_found', 404));
                } else {
                    next(null, result, user);
                }
            });
        },
        function (result, user, next) {
            user.verifyPassword(result.password, function (err, correct) {
                if (err) {
                    next(Error.createError({}, 'error.bad_request', 400));
                } else {
                    if (!correct) {
                        next(Error.createError({}, 'error.wrong_credentials', 401));
                    } else {
                        next(null, user);
                    }
                }
            });
        }
    ], function (err, result) {
        if (err) {
            if (err.errors) {
                next(Error.createError({}, 'error.bad_request', 400));
            } else {
                next(err);
            }
        } else {
            res.body = {
                user: {
                    token: result.get('Token').get('accessToken'),
                    username: result.get('username'),
                    slug: result.get('slug')
                }
            };
            res.resCode = 200;
            next();
        }
    });
};

module.exports = router;