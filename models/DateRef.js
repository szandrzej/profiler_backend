"use strict";

module.exports = function (sequelize, DataTypes) {
    var DateRef = sequelize.define("DateRef", {
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        timestamps: false,
        hooks: {
            beforeCreate: function (entity, option) {
                entity.date.setSeconds(0);
            }
        }
    });
    return DateRef;
};