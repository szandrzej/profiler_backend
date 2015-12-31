"use strict";

var now = new Date();

module.exports = function(sequelize, DataTypes) {
    var EndpointEntry = sequelize.define("EndpointEntry", {
            slug:
            {
                type: DataTypes.STRING(24),
                allowNull: false
            },
            path:
            {
                type: DataTypes.STRING(24),
                allowNull: false
            },
            method:
            {
                type: DataTypes.STRING(10),
                allowNull: false,
                validate: {
                    isIn: [
                        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
                    ]
                }
            },
            code:
            {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isIn: [
                        [200, 201, 204, 400, 401, 402, 403, 404, 405, 409, 415, 500, 501, 502, 503]
                    ]
                }
            },
            processTime:
            {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            defaultScope: {
                where:{
                    createdAt: {
                        $gt: now.setDate(now.getDate() - 180)
                    }
                }
            },
            indexes: [
                {
                    fields: ['slug'],
                    order: 'ASC'
                },
                {
                    fields: ['path'],
                    order: 'ASC'
                }
            ],
        }
    );
    return EndpointEntry;
};