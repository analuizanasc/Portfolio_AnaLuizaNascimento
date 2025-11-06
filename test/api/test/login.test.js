const request = require('supertest');
const { assert, expect } = require('chai')
const { autenticacao, obtertoken } = require('../helper/autenticacao')
const { registerUser, registerValidUser } = require('../helper/registerValidUser')
require("dotenv").config()

describe("Login", () => {

    describe("POST/auth/login", () => {
        it('should login with valid data', async () => {
            const { registerUser } = await registerValidUser();

            const responseLogin = await request(process.env.BASE_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: registerUser.email,
                    password: registerUser.password
                });
            expect(responseLogin.status).to.equal(200);
        });

        it('should return property token and rules as string after inserting the valid data', async () => {
            const { registerUser } = await registerValidUser();

            const responseLogin = await request(process.env.BASE_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: registerUser.email,
                    password: registerUser.password
                });
            expect(responseLogin.status).to.equal(200);
        });

        it('should not login user with invalid data', async () => {
            const { registerUser } = await registerValidUser();

            const responseLogin = await request(process.env.BASE_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: registerUser.email,
                    password: 'errado'
                });
            expect(responseLogin.status).to.equal(401);
        });

        it('should not login user with missing fields', async () => {
            const { registerUser } = await registerValidUser();

            const responseLogin = await request(process.env.BASE_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: registerUser.email,
                    password: ''
                });
            expect(responseLogin.status).to.equal(400);
        });

    })
})