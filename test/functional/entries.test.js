process.env.NODE_ENV = 'test';

var seqFixtures = require('sequelize-fixtures');
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../../app.js');
var models = require("../../models/index");

describe('Entry', function () {

    var prefix = '/api/entries';

    before(function (done) {
        models.sequelize.sync({force: true}).then(function () {
            seqFixtures.loadFixtures(require('../fixtures/fixtures'), models)
                .then(function () {
                    done();
                });
        });
    });

    describe('[/api/entries/list]', function (done) {
        it('should return 200 with authorization', function (done) {
            request(app)
                .get(prefix + '/list')
                .set('Content-Type', 'application/json')
                .set('Authorization',' Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(200)
                .end(done);
        });
    });

    describe('[/api/entries/dashboard]', function (done) {
        it('should return 200 with authorization', function (done) {
            request(app)
                .get(prefix + '/dashboard')
                .set('Content-Type', 'application/json')
                .set('Authorization',' Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send()
                .expect(function(res){
                    var array = res.body.extras;
                    expect(array).to.contain.all.keys(['open', 'procent', 'endpoints', 'code500s']);
                })
                .end(done);
        });
    });

    describe('[/api/entries/endpoint/info]', function (done) {

        it('should return entry in extras', function (done) {
            request(app)
                .post(prefix + '/endpoint/info')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9')
                .send({
                    code: 204,
                    path: '/auth/:id/:code',
                    method: 'POST'
                })
                .expect(function(res){
                    var array = res.body.extras;
                    expect(array).to.contain.all.keys(['open', 'average']);
                })
                .end(done);
        });
    });

    describe('[/api/entries/:slug]', function (done) {

        it('should return 401 without authorization', function (done) {
            request(app)
                .post(prefix + '/geocoach_api2')
                .set('Content-Type', 'application/json')
                .send({
                    processTime: 15,
                    path: '/v1/api/:id/:nanana',
                    code: 401,
                    method: 'PUT'
                })
                .expect(401)
                .end(done);
        });

        it('should return 401 with wrong token', function (done) {
            request(app)
                .post(prefix + '/geocoach_api2')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSY32154')
                .send({
                    procesTime: 15,
                    pth: '/v1/api/:id/:nanana',
                    code: 401,
                    method: 'PUT'
                })
                .expect(401)
                .end(done);
        });

        it('should return 400 with disallowed values', function (done) {
            request(app)
                .post(prefix + '/geocoach_api2')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer AjsB0J5NTmSqSGy3fHmkgODlJJZXgTwf7LmOsh5gZigO77UvzjyGCXwVMyQsuEgts3xGif1GOiuRJu4jcN8mKPwKKc5B55adc8oS3FNYSNiRtVbm1ujp4kOFUFWiDH10')
                .send({
                    processTime: 15,
                    path: '/v1/api/:id/:nanana',
                    code: 350,
                    method: 'PUT'
                })
                .expect(400)
                .end(done);
        });

        it('should return 400 with wrong fields', function (done) {
            request(app)
                .post(prefix + '/geocoach_api2')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer AjsB0J5NTmSqSGy3fHmkgODlJJZXgTwf7LmOsh5gZigO77UvzjyGCXwVMyQsuEgts3xGif1GOiuRJu4jcN8mKPwKKc5B55adc8oS3FNYSNiRtVbm1ujp4kOFUFWiDH10')
                .send({
                    pressTime: 15,
                    path: '/v1/api/:id/:nanana',
                    code: 350,
                    method: 'PUT'
                })
                .expect(400)
                .end(done);
        });


        it('should return 403 with slug not own by user', function (done) {
            request(app)
                .post(prefix + '/geocoach_api')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer AjsB0J5NTmSqSGy3fHmkgODlJJZXgTwf7LmOsh5gZigO77UvzjyGCXwVMyQsuEgts3xGif1GOiuRJu4jcN8mKPwKKc5B55adc8oS3FNYSNiRtVbm1ujp4kOFUFWiDH10')
                .send({
                    processTime: 15,
                    path: '/v1/api/:id/:nanana',
                    code: 401,
                    method: 'PUT'
                })
                .expect(403)
                .end(done);
        });

        it('should return 201 with correct fields and correct slug', function (done) {
            request(app)
                .post(prefix + '/geocoach_api2')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer AjsB0J5NTmSqSGy3fHmkgODlJJZXgTwf7LmOsh5gZigO77UvzjyGCXwVMyQsuEgts3xGif1GOiuRJu4jcN8mKPwKKc5B55adc8oS3FNYSNiRtVbm1ujp4kOFUFWiDH10')
                .send({
                    processTime: 15,
                    path: '/v1/api/:id/:nanana',
                    code: 401,
                    method: 'PUT'
                })
                .expect(201)
                .end(done);
        });

        it('should return entry in extras', function (done) {
            request(app)
                .post(prefix + '/geocoach_api2')
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer AjsB0J5NTmSqSGy3fHmkgODlJJZXgTwf7LmOsh5gZigO77UvzjyGCXwVMyQsuEgts3xGif1GOiuRJu4jcN8mKPwKKc5B55adc8oS3FNYSNiRtVbm1ujp4kOFUFWiDH10')
                .send({
                    processTime: 15,
                    path: '/v1/api/:id/:nanana',
                    code: 401,
                    method: 'PUT'
                })
                .expect(function(res){
                    var array = res.body.extras;
                    expect(array).to.have.key('entry');
                })
                .end(done);
        });
    });
});

