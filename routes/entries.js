var express = require('express');
var async = require('async');

var env = process.env.NODE_ENV || "prod";
var extend = require('extend');

var sequelize = require('../models').sequelize;
var router = express.Router();
var Validator = require('../helpers/requestValidator');
var Error = require('../helpers/errorCreator');
var Entries = require('../models').EndpointEntry;

/* GET auth listing. */
router.post('/:slug', saveEndpointEntry);
router.get('/list', getAllEntries);
router.get('/dashboard', getDashboard);
router.post('/endpoint/info', getEntryInfo);

function saveEndpointEntry(req, res, next) {
    async.waterfall(
        [
            function (next) {
                var slug = req.params.slug;
                if (slug === req.user.get('slug')) {
                    next();
                } else {
                    next(Error.createError({}, 'error.not_allowed', 403));
                }
            },
            function (next) {
                Validator.checkRequiredFields(req.body, ['code', 'processTime', 'path', 'method'], next);
            },
            function (result, next) {
                extend(result, {slug: req.params.slug});
                next(null, result);
            },
            function (result, next) {
                Entries.create(result)
                    .then(function (result) {
                        next(null, result);
                    }, function (err) {
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

function getDashboard(req, res, next) {
    var queries = {
        requestInTime: function (callback) {
            sequelize.query('SELECT createdAt AS time , count(*) AS quantity ' +
                'FROM EndpointEntries ' +
                'WHERE slug = :slug ' +
                'GROUP BY DAY(createdAt)', {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    slug: req.user.slug
                }
            }).then(function (result) {
                callback(null, result);
            });
        },
        countEndpoints: function (callback) {
            sequelize.query('SELECT count(DISTINCT path) AS endpoints ' +
                'FROM EndpointEntries ' +
                'WHERE slug = :slug', {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    slug: req.user.slug
                }
            }).then(function (result) {
                callback(null, result[0].endpoints);
            });
        },
        count500s: function (callback) {
            sequelize.query('SELECT count(*) AS quantity ' +
                'FROM EndpointEntries ' +
                'WHERE slug = :slug AND code = 500', {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    slug: req.user.slug
                }
            }).then(function (result) {
                callback(null, result[0].quantity);
            });
        },
        codeProcent: function (callback) {
            sequelize.query('SELECT code, COUNT(*) AS quantity ' +
                'FROM EndpointEntries ' +
                'WHERE slug = :slug ' +
                'GROUP BY code', {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    slug: req.user.slug
                }
            }).then(function (result) {
                callback(null, result);
            });
        }
    };

    async.parallel({
        open: queries.requestInTime,
        endpoints: queries.countEndpoints,
        code500s: queries.count500s,
        procent: queries.codeProcent
    }, function (err, results) {
        if (err) {
            console.log(err);
            next(err);
        } else {
            res.body = {
                code500s: results.code500s,
                endpoints: results.endpoints,
                open: results.open,
                procent: results.procent
            };
            res.resCode = 200;
            next();
        }
    });
}

function getAllEntries(req, res, next) {
    async.waterfall([
        function (next) {
            sequelize.query('SELECT path, method, code, COUNT(*) as count '
                + 'FROM EndpointEntries '
                + 'WHERE slug = :slug '
                + 'GROUP BY path, method, code',
                {
                    type: sequelize.QueryTypes.SELECT,
                    replacements: {
                        slug: req.user.slug
                    }
                }
                //Entries.count({
                //    attributes: ['path', 'method', 'code'],
                //    where: {
                //        slug: req.user.slug
                //    },
                //    group: ['path', 'method', 'code' ],
                //    order: ['path ASC', 'method ASC', 'code ASC']
            ).then(function (result) {
                if (result) {
                    next(null, result);
                } else {
                    next(Error.createError({}, 'error.bad_request'));
                }
            })
        },
        function (result, next) {
            console.log(result);
            var paths = {};
            async.map(result, function (object, callback) {
                if (paths.hasOwnProperty(object.path)) {
                    if (!paths[object.path].hasOwnProperty(object.method)) {
                        paths[object.path][object.method] = {};
                    }
                    paths[object.path][object.method][object.code] = object.count;
                } else {
                    paths[object.path] = {};
                    paths[object.path][object.method] = {};
                    paths[object.path][object.method][object.code] = object.count;
                }
                callback(null);
            }, function (err) {
                next(err, paths);
            });
        }
    ], function (err, result) {

        if (err) {
            next(err);
        } else {
            res.body = {
                entries: result
            };
            res.resCode = 200;
            next();
        }
    });
}

function getEntryInfo(req, res, next) {
    var path = req.body.path;
    var code = req.body.code;
    var method = req.body.method;
    var processTimeResolution = req.body.process_resolution || "month";

    if (["day", "month", "hour", "minute"].indexOf(processTimeResolution) != -1) {

    }

    var queries = {
        countAllFor: function (callback) {
            Entries.count({
                where: {
                    path: path,
                    slug: req.user.slug,
                    method: method
                }
            }).then(function (result) {
                callback(null, result);
            });
        },
        openInTime: function (callback) {
            sequelize.query('SELECT createdAt AS time , count(*) AS quantity ' +
                'FROM EndpointEntries ' +
                'WHERE slug = :slug AND path = :path AND method = :method ' + (code ? 'AND code = :code ' : ' ') +
                'GROUP BY DAY(createdAt)', {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    code: code,
                    path: path,
                    slug: req.user.slug,
                    method: method
                }
            }).then(function (result) {
                callback(null, result);
            });
        },
        averageInTime: function (callback) {
            sequelize.query('SELECT createdAt AS time, AVG(processTime) AS averageTime ' +
                'FROM EndpointEntries ' +
                'WHERE slug = :slug AND path = :path AND method = :method ' + (code ? 'AND code = :code ' : ' ') +
                'GROUP BY ' + processTimeResolution + '(createdAt)', {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    code: code,
                    path: path,
                    slug: req.user.slug,
                    method: method
                }
            }).then(function (result) {
                callback(null, result);
            });
        },
        codeProcent: function (quantity, callback) {
            sequelize.query('SELECT code, COUNT(*)/:quantity AS procent, COUNT(*) AS quantity ' +
                'FROM EndpointEntries ' +
                'WHERE slug = :slug AND path = :path AND method = :method ' +
                'GROUP BY code', {
                type: sequelize.QueryTypes.SELECT,
                replacements: {
                    code: code,
                    path: path,
                    slug: req.user.slug,
                    method: method,
                    quantity: quantity
                }
            }).then(function (result) {
                callback(null, result);
            });
        }
    };
    if (code) {
        async.parallel({
            open: queries.openInTime,
            average: queries.averageInTime
        }, function (err, results) {
            if (err) {
                next(err);
            } else {
                res.body = {
                    open: results.open,
                    average: results.average
                };
                res.resCode = 200;
                next();
            }
        });
    } else {
        async.parallel({
                open: queries.openInTime,
                average: queries.averageInTime,
                procent: function (callback) {
                    queries.countAllFor(function (err, all) {
                        queries.codeProcent(all, callback);
                    });
                }
            }, function (err, results) {
                if (err) {
                    next(err);
                } else {
                    res.body = {
                        open: results.open,
                        average: results.average,
                        procent: results.procent
                    };
                    res.resCode = 200;
                    next();
                }
            }
        );
    }
}

module.exports = router;
