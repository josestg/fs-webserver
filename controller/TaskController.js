const {STATUS_CODES} = require("node:http");
const {TaskRepository} = require("../model/TaskModel")

class TaskController {
    #repo

    /**
     * constructor for TaskController.
     * @param taskRepository {TaskRepository}
     */
    constructor(taskRepository) {
        this.#repo = taskRepository;
    }

    #getUserId = req => {
        const {authClaims} = req
        if (!authClaims) {
            return {ok: false}
        }

        const {sub: userId} = authClaims
        if (!userId) {
            return {ok: false}
        }
        return {ok: true, userId}
    }

    getAll = (req, res) => {
        const {ok, userId} = this.#getUserId(req)
        if (!ok) {
            this.#unauthorized(res)
            return
        }
        res.json(this.#repo.all(userId)).status(200)
    }

    create = (req, res) => {
        const {ok, userId} = this.#getUserId(req)
        if (!ok) {
            this.#unauthorized(res)
            return
        }
        const {title} = req.body
        const newTask = this.#repo.add(userId, title)
        res.json(newTask).status(201)
    }

    remove = (req, res) => {
        const {exist, userId} = this.#getUserId(req)
        if (!exist) {
            this.#unauthorized(res)
            return
        }

        const {taskId: id} = req.params
        const {ok, data} = this.#repo.removeById(userId, id)
        if (!ok) {
            req.json({
                status: STATUS_CODES[404],
                message: 'task not found'
            }).status(400)
            return;
        }
        res.json(data).status(200)
    }

    update = (req, res) => {
        const {exist, userId} = this.#getUserId(req)
        if (!exist) {
            this.#unauthorized(res)
            return
        }

        const {taskId: id} = req.params
        const {status} = req.body
        const {ok, data} = this.#repo.updateStatus(userId, id, status)
        if (!ok) {
            res.json({
                status: STATUS_CODES[404],
                message: 'task not found'
            }).status(400)
            return;
        }
        res.json(data).status(200)
    }

    #unauthorized = (res) => {
        res
            .json({
                status: STATUS_CODES[401],
                message: "login required"
            })
            .status(401)
    }
}

module.exports = {TaskController}