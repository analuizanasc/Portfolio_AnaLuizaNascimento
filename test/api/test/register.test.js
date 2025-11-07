const request = require("supertest");
const { assert, expect } = require("chai");
const { faker } = require('@faker-js/faker')
const { registerValidUser } = require("../helper/registerValidUser");
require("dotenv").config();


describe("Register", () => {

    describe("POST/residents", () => {
        it("should register a user with all valid data filled", async () => {
            const { response } = await registerValidUser();

            expect(response.status).to.equal(201);
        });

        it("should have property id, name, cpf, cep, address, number, complement, email as string and householdCount as number ", async () => {
            const { response } = await registerValidUser();

            expect(response.body).to.have.property("id").that.is.a("string");
            expect(response.body).to.have.property("name").that.is.a("string");
            expect(response.body).to.have.property("cpf").that.is.a("string");
            expect(response.body).to.have.property("cep").that.is.a("string");
            expect(response.body).to.have.property("address").that.is.a("string");
            expect(response.body).to.have.property("number").that.is.a("string");
            expect(response.body).to.have.property("complement").that.is.a("string");
            expect(response.body).to.have.property("householdCount").that.is.a("number");
            expect(response.body).to.have.property("email").that.is.a("string");

            expect(response.body).to.have.property("coordinates").that.is.an("object");
            expect(response.body.coordinates).to.have.property("lat").that.is.a("number");
            expect(response.body.coordinates).to.have.property("lng").that.is.a("number");
        });

        it("should show an error, after trying to register a new resident with an email that already exists in the system", async () => {

            const { registerUser } = await registerValidUser();
            const duplicateUser = { ...registerUser, name: faker.person.fullName() }

            const response = await request(process.env.BASE_URL)
                .post('/residents')
                .set('Content-Type', 'application/json')
                .send(duplicateUser)

            expect(response.status).to.be.equal(409)
            expect(response.body).to.have.property("error", "Email already registered")
        });

        it("should show an error, after trying to register a new resident with a name and address that already exists in the system", async () => {

            const { registerUser } = await registerValidUser();
            const duplicateUser = { ...registerUser, email: faker.internet.email() }

            const response = await request(process.env.BASE_URL)
                .post('/residents')
                .set('Content-Type', 'application/json')
                .send(duplicateUser)

            expect(response.status).to.be.equal(404)
            expect(response.body).to.have.property("message", "Name already registered")
        });
    });
});
