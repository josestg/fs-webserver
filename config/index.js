const { randomUUID } = require('node:crypto')

class Config {
    #port = 8082
    #logFormat = ':method :url :status content_length=:res[content-length] content_type=:res[content-type] - :response-time ms'
    #tokenExpiresIn = '1h'
    #tokenSecret = randomUUID()
    constructor() {
        this.#port = process.env.PORT ?? this.#port
        this.#logFormat = process.env.LOG_FORMAT ?? this.#logFormat
        this.#tokenExpiresIn = process.env.TOKEN_EXPIRES_IN ?? this.#tokenExpiresIn
        this.#tokenSecret = process.env.TOKEN_SECRET ?? this.#tokenSecret
    }

    port = () => this.#port
    logFormat = () => this.#logFormat
    tokenExpiresIn = () => this.#tokenExpiresIn
    tokenSecret =() => this.#tokenSecret
}

module.exports = new Config()