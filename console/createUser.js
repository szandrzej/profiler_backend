/**
 * Created by andrzej on 11.12.15.
 */
var prompt = require('prompt');
var models = require("../models");
var User  = models.User;
var Token  = models.Token;

models.sequelize.sync({ logging: false}).then(function(){
    main();
});


function main() {
    prompt.message = "Podaj: ".green;

    prompt.start();

    var schema = {
        properties: {
            username: {
                message: 'Username cannot be empty',
                type: 'string',
                required: true
            },
            slug: {
                message: 'Slug cannot be empty',
                type: 'string',
                required: true
            },
            password: {
                hidden: true
            },
            passwordConfirm: {
                hidden: true,
                message: 'Passwords are not the same',
                conform: function (confirmPassword) {
                    var password = prompt.history('password').value;
                    return confirmPassword == password;
                }
            }
        }
    };

    prompt.get(schema, function (err, result) {
        if (err) {
            console.log('Dane niepoprawne!');
        } else {
            console.log('Token aplikacji dla slug: ' + result.slug);
            User.create({
                username: result.username,
                password: result.password,
                slug: result.slug,
                role: 'user'
            }).then(function(user){
                Token.create({}).then(function(token){
                    token.setUser(user)
                        .then(function(token) {
                                console.log(token.get('accessToken'));
                            }
                        );
                })
            });
        }
    });
}