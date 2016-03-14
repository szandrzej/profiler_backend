"use strict";

var bcrypt = require('bcrypt');
var randomString = require('random-string');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
            username: {
                type: DataTypes.STRING(24),
                allowNull: false,
                unique: true,
                validate: {
                    len: {
                        args: [3, 24],
                        msg: "First name is too short!"
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            apiKey: {
                type: DataTypes.STRING(140),
                allowNull: false
            },
            expirationDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            role: {
                type: DataTypes.ENUM('admin', 'user'),
                allowNull: false
            }
        },
        {
            defaultScope: {
                where: {
                    expirationDate: {
                        $gt: new Date()
                    }
                }
            },
            scopes: {
                login: {
                    attributes: ['id', 'password', 'username']
                }
            },
            hooks: {
                beforeValidate: function (user) {
                    if (user.password) {
                        var plainPwd = user.password;
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(plainPwd, salt);

                        user.password = hash;

                        if (user.role === undefined) {
                            user.role = 'user';
                        }
                    }

                    if (!user.apiKey) {
                        var date = new Date();
                        user.apiKey = randomString({length: 128});
                        user.expirationDate = new Date(date.getTime() + 60 * 60 * 24 * 365 * 1000);
                    }
                }
            },
            instanceMethods: {
                verifyPassword: function (password, callback) {
                    bcrypt.compare(password, this.password, callback);
                },
                isAdmin: function () {
                    return this.role === 'admin';
                }
            },
            classMethods: {
                associate: function (models) {
                    User.hasMany(models.Token, {
                        foreignKey: 'UserId',
                        as: 'user'
                    });
                }
            }
        });

    return User;
};