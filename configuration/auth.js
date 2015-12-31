var passport        = require('passport');
var BearerStrategy  = require('passport-http-bearer').Strategy;
var User            = require('../models').User;
var Token           = require('../models').Token;
var Error           = require('../helpers/errorCreator');


module.exports = {
    init: function(app){

        app.use(passport.initialize());
        app.use('/api/', passport.authenticate('bearer', { session: false }),
            function(req, res, next) {
                next();
            }
        );
        passport.use(new BearerStrategy(
                function(token, done) {
                    Token.findOne({
                        where: { accessToken: token },
                        include: [{
                            model: User
                        }]
                    })
                        .then(function (result) {
                            if(!result){
                                done(Error.createError({}, 'error.invalid_token', 401), false);
                            }
                            else {
                                var token = result;
                                if (!token) {
                                    done(null, false);
                                }
                                done(null, token.User);
                            }
                        })
                        .catch(function(err){
                            console.log(err);
                        })
                }
            )
        );
    }
};