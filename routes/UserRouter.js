const express = require("express");
const {withValidator} = require("../middleware")

const {userController: uc} = require('../controller')
const {SchemaCredentials} = require("../model");

const router = express()

router.post('/sign-up', withValidator(SchemaCredentials), uc.register)
router.post('/sign-in', withValidator(SchemaCredentials), uc.login)

module.exports = router