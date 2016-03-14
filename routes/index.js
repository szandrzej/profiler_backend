var express = require('express');
var router = express.Router();

var async = require('async');
var Validator = require('../helpers/requestValidator');
var Error = require('../helpers/errorCreator');
var Users = require('../models').User;
var Tokens = require('../models').Token;

/* GET home page. */

router.post('/login', loginUser);
router.post('/register', registerApi);

function loginUser(req, res, next) {
    async.waterfall([
        function (next) {
            Validator.checkRequiredFields(req.body, ['username', 'password'], next);
        },
        function (result, next) {
            Users.findOne({
                where: {
                    username: result.username
                }
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
        },
        function (user, next) {
            Tokens.create({}).then(function (token) {
                token.setUser(user).then(function (token) {
                    next(null, {token: token, user: user});
                });
            })
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
                    token: result.token.get('accessToken'),
                    username: result.user.get('username'),
                    slug: result.user.get('slug')
                }
            };
            res.resCode = 200;
            next();
        }
    });
}

function registerApi(req, res, next) {
    async.waterfall([
        function (next) {
            Validator.checkRequiredFields(req.body, ['username', 'password', 'slug'], next);
        },
        function (result, next) {
            Users.create({
                username: result.username,
                password: result.password,
                slug: result.slug,
                role: 'user'
            }).then(function (user) {
                next(null, user.get('apiKey'));
            });
        },
    ], function (err, result) {
        if (err) {
            if (err.errors) {
                next(Error.createError({}, 'error.bad_request', 400));
            } else {
                next(err);
            }
        } else {
            res.body = {
                token: {
                    number: result
                }
            };
            res.resCode = 201;
            next();
        }
    });
}

module.exports = router;