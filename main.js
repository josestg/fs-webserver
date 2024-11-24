const express = require('express')
const config = require("./config")
const router = require("./routes")

const morgan = require('morgan')
const logger = morgan(config.logFormat());

const app = express()
app.use(express.json())
app.use(logger)
app.use('/api/v1', router)
app.use((err, req, res, _) => {
    console.log(err)
    res.json({message: "Something going wrong!"})
})
app.listen(config.port(), () => {
    console.log(`server is listening on port ${config.port()}`)
})