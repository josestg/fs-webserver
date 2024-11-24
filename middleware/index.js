const jsonwebtoken = require('jsonwebtoken')
const {ZodError} = require("zod");

function withValidator(schema, isParams = false) {
    return (req, res, next) => {
        try {
            if (isParams) {
                schema.parse(req.params)
            } else {
                schema.parse(req.body)
            }
            next()
        } catch (ex) {
            if (ex instanceof ZodError) {
                const issues = ex.errors.map(({path, message}) => ({path, message}));
                res.json({code: 'validation_error', issues}).status(400)
            } else {
                next(ex)
            }
        }
    }
}

function withAuth(secret) {
    return (req, res, next) => {
        const authorization = req.headers['authorization']
        // Bearer <token>
        if (!authorization) {
            res.json({message: 'login required'}).status(401)
            return
        }


        const parts = authorization.split(' ')
        if (parts.length !== 2) {
            res.json({message: 'bearer token malformed'}).status(401)
            return
        }

        try {
            const token = parts[1]
            req.authClaims = jsonwebtoken.verify(token, secret, {
                audience: 'fs-webserver-client',
                issuer: 'fs-webserver'
            })
            next()
        } catch (ex) {
            if (ex instanceof  jsonwebtoken.JsonWebTokenError || ex instanceof  jsonwebtoken.TokenExpiredError ) {
                res.json({message: 'login required'}).status(401)
                return;
            }
            next(ex)
        }

    }
}

module.exports = {
    withValidator,
    withAuth
}