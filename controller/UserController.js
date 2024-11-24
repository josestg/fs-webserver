const jsonwebtoken = require("jsonwebtoken")
const { randomUUID } = require('node:crypto')
const {STATUS_CODES} = require("node:http");
const {UserRepository} = require("../model/UserModel")

class UserController {
    #repo = null
    #config
    /**
     * Creates a new user controller.
     * @param repo {UserRepository}
     * @param config {Config}
     */
    constructor(repo, config) {
        this.#repo = repo;
        this.#config = config
    }

    register = (req, res) => {
        const {email, password} = req.body
        const {ok, data, reason} = this.#repo.add(email, password)
        if (!ok) {
            res
                .json({
                    status: STATUS_CODES[400],
                    message: reason
                })
                .status(400)
            return
        }
        res.json(data).status(201)
    }

    login = (req, res) => {
        const {email, password} = req.body
        const {ok, data: usr} = this.#repo.findByEmailPassword(email, password)
        if (!ok) {
            this.#unauthorized(res, 'email or password incorrect')
            return
        }

        const token = jsonwebtoken.sign({email: usr.email}, this.#config.tokenSecret(), {
            subject: usr.id,
            audience: 'fs-webserver-client',
            issuer: 'fs-webserver',
            expiresIn: this.#config.tokenExpiresIn(),
            jwtid: randomUUID(),
        })

        res.json({
            type: 'Bearer',
            token
        }).status(200)
    }

    #unauthorized = (res, message) => {
        res
            .json({
                status: STATUS_CODES[401],
                message: message
            })
            .status(401)
    }
}

module.exports = {UserController}