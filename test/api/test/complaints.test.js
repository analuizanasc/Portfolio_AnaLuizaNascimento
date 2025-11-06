require("dotenv").config();
const request = require('supertest')
const { assert, expect } = require('chai');
const { obterTokenAdm } = require('../helper/autenticacao');
const postComplaint = require('../fixtures/postComplaint.json')


describe('Complaints', () => {
    describe('POST/complaints', () => {
        let token;
        let bodyComplaint;

        it('should create an anonymous complaint', async () => {

            token = await obterTokenAdm()
            bodyComplaint = { ...postComplaint }

            const response = await request(process.env.BASE_URL)
                .post('/complaints')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyComplaint)

            expect(response.status).to.be.equal(201);
            expect(response.body.anonymous).to.be.equal(true)
        });

        it('should create an non anonymous complaint', async () => {

            token = await obterTokenAdm()
            bodyComplaint = { ...postComplaint, anonymous: false }

            const response = await request(process.env.BASE_URL)
                .post('/complaints')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyComplaint)

            expect(response.status).to.be.equal(201);
            expect(response.body.anonymous).to.be.equal(false)
        });

        it('should show status 401 after trying to make a complaint without a token', async () => {

            token = await obterTokenAdm()
            bodyComplaint = { ...postComplaint, anonymous: false }

            const response = await request(process.env.BASE_URL)
                .post('/complaints')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer `)
                .send(bodyComplaint)

            expect(response.status).to.be.equal(401);
            expect(response.body).to.have.property('error', 'Token missing or malformed')

        });

        it('should show status 400 after trying to make a complaint with a non existing type', async () => {

            token = await obterTokenAdm()
            bodyComplaint = { ...postComplaint, type: 'nonExistingType' }

            const response = await request(process.env.BASE_URL)
                .post('/complaints')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyComplaint)

            expect(response.status).to.be.equal(400);
        });
    });

    describe('GET/complaints', () => {
        it('*should return a list of complaints when giving a type', async () => {

            token = await obterTokenAdm()
            bodyComplaint = { ...postComplaint }

            const response = await request(process.env.BASE_URL)
                .get('/complaints')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .query({ type: 'resident' })

            console.log(response.body)
            expect(response.status).to.be.equal(200);
            expect(response.body).to.be.an('array');
        });


        it('should show status code 400 for complaints without the type', async () => {

            token = await obterTokenAdm()
            bodyComplaint = { ...postComplaint }

            const response = await request(process.env.BASE_URL)
                .get('/complaints')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .query({ type: '' })

            //console.log(response.body)
            expect(response.status).to.be.equal(400);
            expect(response.body).to.have.property('error', 'type query param required')

        });
    });

    describe('POST/admin/complaints/{id}/aprove', () => {

        it('should aprove complaint successfully', async () => {

            token = await obterTokenAdm()
            bodyComplaint = { ...postComplaint }

            const responseComplaint = await request(process.env.BASE_URL)
                .post('/complaints')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyComplaint)

            const responseAprove = await request(process.env.BASE_URL)
                .post(`/complaints/${responseComplaint.body.id}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyComplaint)

                console.log(responseAprove.body)

            expect(responseAprove.status).to.be.equal(200)



        });
    });
});
