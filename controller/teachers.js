const fs = require('fs')
const data = require('../data.json')
const {age , date} = require('../util')
//INDEX
exports.index = function (req , res) {
    return res.render('./professores/index' , {professores: data.professores})
}

//CREATE
exports.create = function (req , res) {
    return res.render('./professores/create')
}

exports.post = function (req , res) {
    //validação de todos os dados preenchidos
    const keys = Object.keys(req.body)

    for(key of keys){
        if(req.body[key] == ""){
            return res.send('Por favor, preencha todos os campos!')
        }
    }

    let{avatar_url , name , birth , escolaridade , aula , services } = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    let id = 1
    const ultimoProfessor = data.professores[data.professores.length - 1]
    if (ultimoProfessor){
        id = ultimoProfessor.id +1
    }


    data.professores.push({
        id,
        avatar_url ,
        name ,
        birth ,
        escolaridade ,
        aula ,
        services,
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(data , null , 2), function (err) {
        if (err) return res.send("Falha na gravação do arquivo!")

        return res.redirect("/professores")
    })

}

//SHOW
exports.show = function (req , res) {
    const  {id} = req.params

    const foundTeacher = data.professores.find(function (professor) {
        return professor.id == id
    })

    if (!foundTeacher) return res.send("Professor não encontrado!!!")

    const professor = {
        ...foundTeacher,
        age: age(foundTeacher.birth),
        services: foundTeacher.services.split(","),
        created_at: date(foundTeacher.created_at).pt_br,
        //created_at: new Intl.DateTimeFormat('default' , {year: 'numeric', month: '2-digit', day:'2-digit' }).format(foundTeacher.created_at),
    }

    return res.render("professores/show" , {professor})
}

//EDIT
exports.edit = function (req,res) {
    const  {id} = req.params

    const foundTeacher = data.professores.find(function (professor) {
        return professor.id == id
    })

    if (!foundTeacher) return res.send("Professor não encontrado!!!")

    const professor = {
        ...foundTeacher,
        birth: date(foundTeacher.birth).iso
    }

    return res.render("professores/edit" , {professor})
}

//PUT
exports.put = function (req , res) {
    const  {id} = req.body
    let index = 0

    const foundTeacher = data.professores.find(function (professor , foundIndex) {
        if (id == professor.id){
            index = foundIndex
            return true
        }
    })

    if (!foundTeacher) return res.send("Professor não encontrado!!!")

    const professor = {
        ...foundTeacher,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.professores[index] = professor

    fs.writeFile("data.json", JSON.stringify(data , null , 2), function (err) {
        if (err) return res.send("Falha na gravação do arquivo!")

        return res.redirect(`/professores/${id}`)
    })

}

//DELETE
exports.delete = function (req , res) {
    const {id} = req.body

    const filterTeachers = data.professores.filter(function (professor) {
        return professor.id != id
    })

    data.professores = filterTeachers

    fs.writeFile("data.json" , JSON.stringify(data , null , 2) , function (err) {
        if (err) return res.send("Falha na exclusão do arquivo!")

        return res.redirect("/professores")
    })
}