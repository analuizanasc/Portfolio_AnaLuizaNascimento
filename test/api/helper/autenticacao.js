const request = require('supertest')
const { assert, expect } = require('chai')
const postLoginAdm = require('../fixtures/postLoginAdm.json')

require("dotenv").config()

const obtertoken = async (username, password) => {

    const response = await request(process.env.BASE_URL)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send({username, password})

        return response.body.token

}

module.exports = {
    obtertoken
}