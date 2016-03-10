var models = require("../models");

models.sequelize.sync({ force: false ,logging: true}).then(function() {

});