var models = require("../models");

models.sequelize.sync({ force: true ,logging: true}).then(function() {

});