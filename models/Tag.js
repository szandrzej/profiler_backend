"use strict";

var bcrypt = require('bcrypt');
var randomString = require('random-string');

module.exports = function(sequelize, DataTypes) {
    var Tag = sequelize.define("Tag", {
            name:
            {
                type: DataTypes.STRING(24),
                allowNull: false,
                validate: {
                    len: {
                        args: [3, 24],
                        msg: "First name is too short!"
                    }
                }
            },
            description:
            {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            slug:
            {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            indexes: [
                {
                    fields: ['slug'],
                    order: 'ASC'
                },
                {
                    fields: ['name'],
                    order: 'ASC'
                }
            ],
        });

    return Tag;
};