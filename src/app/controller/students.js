const Student = require('../models/student')
const {age , date} = require('../../lib/util')

module.exports = {
    index (req , res) {

        Student.all(function (estudantes) {
            return res.render('estudantes/index' , {estudantes})
        })
    },
    create (req , res) {
        Student.teacherSelect(function (options) {
            
            return res.render('./estudantes/create' , {teacherOpt: options})
        })
    },
    post (req , res) {
        //validação de todos os dados preenchidos
        const keys = Object.keys(req.body)
    
        for(key of keys){
            if(req.body[key] == ""){
                return res.send('Por favor, preencha todos os campos!')
            }
        }
        
        Student.create(req.body , function (estudante) {
            return res.redirect(`/estudantes/${estudante.id}`)
        })
        
    },
    show (req , res) {
        
        Student.find(req.params.id , function (estudante) {
            if (!estudante) return res.send("Estudante não encontrado!!!")
            estudante.age = age(estudante.birth)
            estudante.birthDay = date(estudante.birth).birthDay
            return res.render("estudantes/show" , {estudante})
        })
        
    },
    edit (req,res) {

        Student.find(req.params.id , function (estudante) {
            if (!estudante) return res.send("Estudante não encontrado!!!")

            estudante.birth = date(estudante.birth).iso
            Student.teacherSelect(function (options) {
            
                return res.render("estudantes/edit" , {estudante , teacherOpt: options})
            })

        })

    },
    put (req , res) {
        //validação de todos os dados preenchidos
        const keys = Object.keys(req.body)
    
        for(key of keys){
            if(req.body[key] == ""){
                return res.send('Por favor, preencha todos os campos!')
            }
        }

        Student.update( req.body , function () {
            return res.redirect(`/estudantes/${req.body.id}`)
        })
    
    },
    delete (req , res) {
        Student.delete(req.body.id , function () {
            return res.redirect("/estudantes")
        })
    }
}