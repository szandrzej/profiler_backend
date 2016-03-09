process.env.NODE_ENV = 'test';

var seqFixtures = require('sequelize-fixtures');
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../../app.js');
var models = require("../../models/index");

describe('AUTH', function () {

    var prefix = '/auth';

    before(function (done) {
        models.sequelize.sync({force: true}).then(function () {
            seqFixtures.loadFixtures(require('../fixtures/fixtures'), models)
                .then(function () {
                    done();
                });
        });
    });

    describe('[/auth/register', function(done){
       it('should return 400 without all fields', function (done){
           request(app)
               .post(prefix + '/register')
               .set('Content-Type', 'application/json')
               .send({
                   username: 'testapi2',
                   pssword: 'qwerty'
               })
               .expect(400)
               .end(done);
       });

        it('should return 201 with all fields', function (done){
            request(app)
                .post(prefix + '/register')
                .set('Content-Type', 'application/json')
                .send({
                    username: 'testapi2',
                    password: 'qwerty',
                    slug: 'test.api.2'
                })
                .expect(201)
                .end(done);
        })
    });

    describe('[/auth/login]', function (done) {

        it('should return 400 without password or username', function (done) {
            request(app)
                .post(prefix + '/login')
                .set('Content-Type', 'application/json')
                .send({
                    usernme: 'geocoach_api',
                    pssword: 'qwerty'
                })
                .expect(400)
                .end(done);
        });

        it('should return 401 without bad credentials', function (done) {
            request(app)
                .post(prefix + '/login')
                .set('Content-Type', 'application/json')
                .send({
                    username: 'geocoach_api',
                    password: 'qwert'
                })
                .expect(401)
                .end(done);
        });

        it('should return 404 with not existing user', function (done) {
            request(app)
                .post(prefix + '/login')
                .set('Content-Type', 'application/json')
                .send({
                    username: 'geoch_api',
                    password: 'qwerty'
                })
                .expect(404)
                .end(done);
        });

        it('should return 200 when everything okey', function (done) {
            request(app)
                .post(prefix + '/login')
                .set('Content-Type', 'application/json')
                .send({
                    username: 'geocoach_api',
                    password: 'qwerty'
                })
                .expect(200)
                .end(done);
        });

        it('should return token and user object', function (done) {
            request(app)
                .post(prefix + '/login')
                .set('Content-Type', 'application/json')
                .send({
                    username: 'geocoach_api',
                    password: 'qwerty'
                })
                .expect(function(res){
                    var extras = res.body.extras.user;
                    expect(extras).to.have.all.keys(['token', 'username', 'slug']);
                })
                .end(done);
        });
    });
});

