const request = require('supertest')
const { assert, expect } = require('chai')
const postLoginAdm = require('../fixtures/postLoginAdm.json')
const { registerValidUser } = require('./registerValidUser')

require("dotenv").config()

const obterTokenAdm = async () => {
    const bodyLogin = {...postLoginAdm}

    const response = await request(process.env.BASE_URL)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send(bodyLogin)

        return response.body.token

}

const obterTokenResident = async () => {
    //criar um usuario
    const { registerUser } = await registerValidUser();
    
    const bodyLogin = {
        email: registerUser.email,
        password: registerUser.password
    }

    const response = await request(process.env.BASE_URL)
    .post('/auth/login')
    .set('Content-Type', 'application/json')
    .send(bodyLogin)

    return response.body.token
}

module.exports = {
    obterTokenAdm, obterTokenResident
}