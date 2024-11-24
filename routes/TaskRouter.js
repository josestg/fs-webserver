const express = require("express");
const {withValidator, withAuth} = require("../middleware")
const config = require("../config")
const {taskController} = require('../controller')
const {SchemaAddTask, SchemaUpdateStatusTask, SchemaTaskId} = require("../model")

const router = express()

const authenticated = withAuth(config.tokenSecret());
router.get('/', authenticated, taskController.getAll)
router.post('/', withValidator(SchemaAddTask), authenticated, taskController.create)
router.put('/:taskId', withValidator(SchemaUpdateStatusTask), withValidator(SchemaTaskId, true), authenticated, taskController.update)
router.delete('/:taskId', withValidator(SchemaTaskId, true), authenticated, taskController.remove)

module.exports = router