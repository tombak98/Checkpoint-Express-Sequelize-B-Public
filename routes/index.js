const express = require('express');
const app = require('../app');
const router = express.Router();
const todos = require('../models/express-models/todos');

// write your routes here. Feel free to split into multiple files if you like.

router.use(express.urlencoded({extended: false}))
router.use(express.json())

router.get('/users', (req,res,next) => {
    res.send(todos.listPeople())
})

router.get('/users/:name/tasks', (req,res,next) => {
    if (todos.listPeople().includes(req.params.name)) {
        let personName = req.params.name;
        let urlParams = req.query.status
        let todoList = todos.list(personName)
        let toSend = []
        if (urlParams) {
            for (let i = 0; i < todoList.length; i++) {
                if (urlParams === 'complete' && todoList[i].complete === true) {
                    toSend.push(todoList[i])
                } else if (urlParams === 'active' && todoList[i].complete === false) {
                    toSend.push(todoList[i])
                }
            }
            res.send(toSend)
        } else {
            res.send(todoList)
        }
    } else {
        let error = new Error("User not found!")
        res.status(404).send(error)
    }
})

router.post('/users/:name/tasks', (req,res,next) => {
    if (req.body.content) {
        let personName = req.params.name
        todos.add(personName, req.body)
        res.status(201)
        res.send(todos.list(personName)[todos.list(personName).length - 1])
    } else {
        let error = new Error("Bad Request")
        res.status(400).send(error)
    }
})

router.put('/users/:name/tasks/:index', (req,res,next) => {
    let personName = req.params.name
    let idx = req.params.index
    todos.complete(personName, idx)
    res.status(200).send("Task Complete")
})

router.delete('/users/:name/tasks/:index', (req,res,next) => {
    let personName = req.params.name
    let idx = req.params.index
    todos.remove(personName, idx)
    res.status(204).send("No Content")
})

module.exports = router;