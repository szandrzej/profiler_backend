var models = require("../models");
var DateRefs = models.DateRef;
var sequelize = require('../models').sequelize;

var date = new Date();

sequelize.query("DELETE FROM DateRefs")
    .then(function () {
            var arrayu = [];
            for (i = 0; i < 52560; i++) {
                var time = new Date(date.getTime() - i * 1000 * 60);
                time.setSeconds(0);
                arrayu.push({date: time});
            }
            DateRefs.bulkCreate(arrayu);
        }
    );

