const users = require("./UserModel")
const tasks = require("./TaskModel")

module.exports = {
    ...users,
    ...tasks
}