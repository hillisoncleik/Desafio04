const express = require('express')
const teachers = require('./app/controller/teachers')
const students = require('./app/controller/students')

const routes = express.Router()

routes.get('/', function (req , res) {
    return res.redirect("/professores")
})

routes.get('/professores' , teachers.index)
routes.get('/professores/create' , teachers.create)
routes.post('/professores' , teachers.post)
routes.get('/professores/:id' , teachers.show)
routes.get('/professores/:id/edit' , teachers.edit)
routes.put('/professores' , teachers.put)
routes.delete('/professores' , teachers.delete)

routes.get('/estudantes' , students.index)
routes.get('/estudantes/create' , students.create)
routes.post('/estudantes' , students.post)
routes.get('/estudantes/:id' , students.show)
routes.get('/estudantes/:id/edit' , students.edit)
routes.put('/estudantes' , students.put)
routes.delete('/estudantes' , students.delete)

module.exports = routes