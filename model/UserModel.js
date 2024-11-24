const {randomUUID} = require('node:crypto')
const {z} = require('zod')
const bcrypt = require('bcrypt')

const SchemaCredentials = z.object({
    email: z.string().email(),
    password: z.string().min(4).max(64)
})

class UserRepository {
    #users = []
    #saltRounds = 10

    findByEmailPassword = (email, password) => {
        email = email.toLowerCase();
        const usr = this.#users.find(u => u.email === email);
        if (usr === undefined) {
            return {ok: false, data: null}
        }

        const matched = bcrypt.compareSync(password, usr.password)
        if (!matched) {
            return {ok: false, data: null}
        }

        return {ok: true, data: {id: usr.id, email: usr.email}}
    }

    add = (email, password) => {
        email = email.toLowerCase();
        const emailTaken = this.#users.some(u => u.email === email);
        if (emailTaken) {
            return {ok: false, reason: 'email already taken'}
        }

        const salt = bcrypt.genSaltSync(this.#saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        const userId = randomUUID();
        this.#users.push({
            id: userId, email, password: hash
        })
        return {ok: true, data: {id: userId}}
    }
}

module.exports = {
    UserRepository,
    SchemaCredentials
}