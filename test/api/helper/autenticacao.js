const request = require('supertest')
const { assert, expect } = require('chai')
const postLoginAdm = require('../fixtures/postLoginAdm.json')

require("dotenv").config()

const obterTokenAdm = async () => {
    const bodyLogin = {...postLoginAdm}

    const response = await request(process.env.BASE_URL)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send(bodyLogin)

        return response.body.token

}

module.exports = {
    obterTokenAdm
}