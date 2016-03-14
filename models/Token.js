"use strict";

var randomString = require('random-string');
var env = process.env.NODE_ENV || "prod";
var config = require('../configuration/enviroments/conf-' + env).security;

module.exports = function(sequelize, DataTypes) {
    var Token = sequelize.define("Token", {
            accessToken:
            {
                type: DataTypes.STRING(67),
                allowNull: false
            },
            expirationDate:
            {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            hooks:{
              beforeValidate: function(entity){
                  if(!entity.accessToken){
                      var date = new Date();
                      entity.accessToken = randomString({length: 60});
                      entity.expirationDate = new Date(date.getTime() + 60 * 60 * 24 * 365 * 1000);
                  }

              }
            },
            defaultScope: {
                where: {
                    expirationDate: {
                        $gt: new Date()
                    }
                }
            },
            classMethods: {
                associate: function(models) {
                    Token.belongsTo(models.User, {
                        as: 'user',
                        foreignKey: 'UserId'
                    });
                }
            }
        });

    return Token;
};