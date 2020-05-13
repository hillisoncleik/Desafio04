const Teacher = require('../models/teacher')
const {age , date} = require('../../lib/util')

module.exports = {
    index (req , res) {
        let {filter , page , limit} = req.query

        page = page || 1
        limit = limit || 3

        let offset = limit * (page -1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(professores){
                const pagination = {
                    total: Math.ceil(professores[0].total / limit),
                    page
                }
                return res.render('professores/index' , {professores , pagination , filter})
            }
        }

        Teacher.paginate(params)
        // if (filter){
        //     Teacher.findBy(filter , function (professores) {
        //         return res.render('professores/index' , {professores , filter})
        //     })
        // }
        // else{
        //     Teacher.all(function (professores) {
        //         return res.render('professores/index' , {professores})
        //     })
        // }
    },
    create (req , res) {
        return res.render('./professores/create')
    },
    post (req , res) {
        //validação de todos os dados preenchidos
        const keys = Object.keys(req.body)
    
        for(key of keys){
            if(req.body[key] == ""){
                return res.send('Por favor, preencha todos os campos!')
            }
        }
        
        Teacher.create(req.body , function (professor) {
            return res.redirect(`/professores/${professor.id}`)
        })
        
    },
    show (req , res) {
        
        Teacher.find(req.params.id , function (professor) {
            if (!professor) return res.send("Professor não encontrado!!!")
            professor.age = age(professor.birth)
            professor.created_at = date(professor.created_at).pt_br
            professor.services = professor.services.split(",")
            return res.render("professores/show" , {professor})
        })
        
    },
    edit (req,res) {

        Teacher.find(req.params.id , function (professor) {
            if (!professor) return res.send("Professor não encontrado!!!")
            professor.age = date(professor.birth).iso
            return res.render("professores/edit" , {professor})
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

        Teacher.update( req.body , function () {
            return res.redirect(`/professores/${req.body.id}`)
        })
    
    },
    delete (req , res) {
        Teacher.delete(req.body.id , function () {
            return res.redirect("/professores")
        })
    }
}
