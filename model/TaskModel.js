const {randomUUID} = require("node:crypto");
const {z} = require('zod')

const TASK_STATUS = ['todo', 'onprogress', 'done']

const SchemaAddTask = z.object({
    title: z.string().min(3)
}).required()

const SchemaUpdateStatusTask = z.object({
    status: z.enum(TASK_STATUS)
}).required()

const SchemaTaskId = z.object({
    taskId: z.string().uuid()
})

class TaskRepository {
    #tasks = [
        {id: randomUUID(), title: 'task a', status: 'todo', userId: randomUUID()},
    ]

    all = (userId) => this.#tasks.filter(t => t.userId === userId)

    add = (userId, title) => {
        const newTask = {id: randomUUID(), title: title, status: 'todo', userId}
        this.#tasks.push(newTask)
        return newTask
    }

    removeById = (userId, id) => {
        const target = this.#tasks.find((task) => task.id === id && task.userId === userId)
        if (target === undefined) {
            return {ok: false, data: null}
        }

        this.#tasks = this.#tasks.filter(task => task.id !== target.id)
        return  {ok: true, data: target}
    }

    updateStatus = (userId, id, status) => {
        const index = this.#tasks.findIndex((task) => task.id === id && task.userId === userId)
        if (index < 0) {
            return {ok: false, data: null}
        }
        this.#tasks[index].status = status
        return {ok: true, data: this.#tasks[index]}
    }
}

module.exports = {
    TaskRepository,
    SchemaAddTask,
    SchemaUpdateStatusTask,
    SchemaTaskId
}