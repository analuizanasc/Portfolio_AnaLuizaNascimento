require("dotenv").config();
const request = require('supertest')
const { assert, expect } = require('chai');
const { obterTokenAdm, obterTokenResident } = require('../helper/autenticacao');
const postComplaint = require('../fixtures/postComplaint.json')


describe('Complaints', () => {
    describe('POST/complaints', () => {
        let token;
        let bodyComplaint;

        it('should a Resident be able to create an anonymous complaint', async () => {

            token = await obterTokenResident()
            bodyComplaint = { ...postComplaint }

            const response = await request(process.env.BASE_URL)
                .post('/complaints')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyComplaint)

            expect(response.status).to.be.equal(201);
            expect(response.body.anonymous).to.be.equal(true)
        });

        it('should an Adm be able to create an anonymous complaint', async () => {

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

        it('should a Resident be able to create a non anonymous complaint', async () => {

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

        it('should a Resident be able to create a non anonymous complaint', async () => {

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
        it('should return a list of complaints when giving a valid type', async () => {

            token = await obterTokenAdm()
            bodyComplaint = { ...postComplaint }

            const responseComplaint = await request(process.env.BASE_URL)
                .post('/complaints')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyComplaint)

            const response = await request(process.env.BASE_URL)
                .get('/complaints')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .query({ type: 'violencia domestica' })

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

            expect(response.status).to.be.equal(400);
            expect(response.body).to.have.property('error', 'type query param required')

        });
    });

    describe('GET/admin/complaints/pending', () => {
        it('should return for the Adm a list of complaints for aproove', async () => {

            token = await obterTokenAdm()
            bodyComplaint = { ...postComplaint }

            const responseComplaint = await request(process.env.BASE_URL)
                .post('/complaints')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyComplaint)

            const response = await request(process.env.BASE_URL)
                .get('/admin/complaints/pending')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)

            expect(response.status).to.be.equal(200);
            expect(response.body).to.be.an('array');
        });
    });

    describe('POST/admin/complaints/{id}/aprove', () => {

        it('should aprove complaint successfully for admin', async () => {

            token = await obterTokenAdm()
            bodyComplaint = { ...postComplaint }

            const responseComplaint = await request(process.env.BASE_URL)
                .post('/complaints')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyComplaint)

            const responseAprove = await request(process.env.BASE_URL)
                .post(`/admin/complaints/${responseComplaint.body.id}/approve`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)

            expect(responseAprove.status).to.be.equal(200)
            expect(responseAprove.body.message).to.be.equal('approved')
        });

        it('(residents) should not be able to acesss complaint aproval', async () => {

            token = await obterTokenResident()
            bodyComplaint = { ...postComplaint }

            const responseComplaint = await request(process.env.BASE_URL)
                .post('/complaints')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyComplaint)

            const responseAprove = await request(process.env.BASE_URL)
                .post(`/admin/complaints/${responseComplaint.body.id}/approve`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)

            expect(responseAprove.status).to.be.equal(403)
            expect(responseAprove.body).to.have.property('error', 'Admin access required')
        });
    });

    describe('DELETE/admin/complaints/{id}', () => {

        it('should delete a complaint by the admin', async () => {
            token = await obterTokenAdm()
            bodyComplaint = { ...postComplaint }

            const responseComplaint = await request(process.env.BASE_URL)
                .post('/complaints')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyComplaint)

            const responseAprove = await request(process.env.BASE_URL)
                .post(`/admin/complaints/${responseComplaint.body.id}/approve`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)

            const responseDelete = await request(process.env.BASE_URL)
                .delete(`/admin/complaints/${responseComplaint.body.id}`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
            
            expect(responseDelete.status).to.be.equal(200)
        });
    });
});
