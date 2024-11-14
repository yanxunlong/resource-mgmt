const { describe, it } = require('mocha');
const { expect } = require('chai');

const { app, server } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let baseUrl;

describe('Resource API', () => {
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address == '::' ? 'localhost' : address}:${port}`;
    });
    after(() => {
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

    let count = 0;
    let resourceId; // Variable to store the ID of the resource
    // Test Suite for viewing resources
    describe('GET /view-resources', () => {
        it('should return all resources', (done) => {
            chai.request(baseUrl)
                .get('/view-resources')
                .end((err, res) => {
                    count = res.body.length;
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });
    // Test Suite for adding resources
    describe('POST /add-resource', () => {
        it('should return 500 for validation errors', (done) => {
            chai.request(baseUrl)
                .post('/add-resource')
                .send({
                    name: 'Test Resource', location: 'Test Location', description:
                        'Short', owner: 'invalid-email'
                })
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.body.message).to.equal('Validation error');
                    done();
                });
        });
        it('should add a new resource', (done) => {
            chai.request(baseUrl)
                .post('/add-resource')
                .send({
                    name: 'Test Resource', location: 'Test Location', description:
                        'A short description', owner: 'test@example.com'
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(count + 1);
                    resourceId = res.body[res.body.length - 1].id; // Store the ID of
                    done();
                });
        });
    });
    describe('PUT /edit-resource/:id', () => {
        it('should update an existing resource', (done) => {
            chai.request(baseUrl)
                .put(`/edit-resource/${resourceId}`)
                .send({ name: 'Updated Resource', location: 'Updated Location', description: 'Updated description'})
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.message).to.equal('Resource modified successfully!');
                    done();
                });
        });
    });
    // Test Suite for deleting resources
    describe('DELETE /delete-resource/:id', () => {
        it('should delete an existing resource', (done) => {
            chai.request(baseUrl)
                .delete(`/delete-resource/${resourceId}`)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.message).to.equal('Resource deleted successfully!');
                    done();
                });
        });
    });
});