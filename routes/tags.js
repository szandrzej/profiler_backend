var express = require('express');
var async = require('async');

var env = process.env.NODE_ENV || "prod";
var extend = require('extend');

var sequelize = require('../models').sequelize;
var router = express.Router();
var Validator = require('../helpers/requestValidator');
var Error = require('../helpers/errorCreator');
var Tags = require('../models').Tag;

/* GET auth listing. */
router.post('/', addTag);
router.get('/', getAllTag);

function addTag(req, res, next) {
    async.waterfall(
        [
            function (next) {
                Validator.checkRequiredFields(req.body, ['name', 'description'], next);
            },
            function (result, next) {
                extend(result, {slug: req.user.slug});
                next(null, result);
            },
            function (result, next) {
                Tags.create(result)
                    .then(function (result) {
                        next(null, result);
                    }, function (err) {
                        console.log(err);
                        next(Error.createError({}, 'error.database_error', 400));
                    });
            }
        ],
        function (err, result) {
            if (err) {
                if (err.errors) {
                    var error = Error.createError(err.errors, 'error.bad_request', 400);
                    next(error);
                } else {
                    next(err);
                }
            } else {
                res.body = {
                    entry: result
                };
                res.resCode = 201;
                next();
            }
        }
    );
}

function getAllTag(req, res, next) {
    async.waterfall([
        function (next) {
            sequelize.query('SELECT * '
                + 'FROM Tags '
                + 'WHERE slug = :slug '
                + 'ORDER BY createdAt DESC',
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: {
                        slug: req.user.slug
                    }
                }
            ).then(function (result) {
                if (result) {
                    next(null, result);
                } else {
                    next(Error.createError({}, 'error.bad_request'));
                }
            })
        },
    ], function (err, result) {
        if (err) {
            next(err);
        } else {
            res.body = {
                tags: result
            };
            res.resCode = 200;
            next();
        }
    });
}
module.exports = router;
