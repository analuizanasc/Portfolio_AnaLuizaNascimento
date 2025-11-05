const request = require("supertest");
const { faker } = require('@faker-js/faker')
require("dotenv").config();

const registerValidUser = async (overrides = {}) => {
    let name = faker.person.fullName();
    let cpf = faker.string.numeric(11)
    let cep = faker.string.numeric(8)
    let address = faker.location.streetAddress();
    let number = faker.number.int({ min: 1, max: 9999 });
    let complement = faker.internet.username();
    let householdCount = faker.number.int({ min: 1, max: 10 });
    let email = faker.internet.email();
    let password = '123456'

    const registerUser = {
        name,
        cpf,
        cep,
        address,
        number,
        complement,
        householdCount,
        email,
        password,
        ...overrides
    };

    const response = await request(process.env.BASE_URL)
        .post('/residents')
        .set('Content-Type', 'application/json')
        .send(registerUser)

    return { response, registerUser };
}

module.exports = {
    registerValidUser
}