var seqFixtures = require('sequelize-fixtures');
var models = require("../models/index");

seqFixtures.loadFixtures(require('../test/fixtures/dev_entries_fixtures'), models);