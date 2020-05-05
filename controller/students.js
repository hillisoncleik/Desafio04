const fs = require('fs')
const data = require('../data.json')
const {age , date} = require('../util')
//INDEX
exports.index = function (req , res) {
    return res.render('./estudantes/index' , {estudantes: data.estudantes})
}

//CREATE
exports.create = function (req , res) {
    return res.render('./estudantes/create')
}

exports.post = function (req , res) {
    //validação de todos os dados preenchidos
    const keys = Object.keys(req.body)

    for(key of keys){
        if(req.body[key] == ""){
            return res.send('Por favor, preencha todos os campos!')
        }
    }

    let{avatar_url , name , birth , email , escolaridade , ch } = req.body

    birth = Date.parse(birth)
    ch = Number(ch)
    let id = 1
    const ultimoEstudante = data.estudantes[data.estudantes.length - 1]
    if (ultimoEstudante){
        id = ultimoEstudante.id +1
    }


    data.estudantes.push({
        id,
        avatar_url ,
        name ,
        birth ,
        email,
        escolaridade ,
        ch
    })

    fs.writeFile("data.json", JSON.stringify(data , null , 2), function (err) {
        if (err) return res.send("Falha na gravação do arquivo!")

        return res.redirect("/estudantes")
    })

}

//SHOW
exports.show = function (req , res) {
    const  {id} = req.params

    const foundStudent = data.estudantes.find(function (estudante) {
        return estudante.id == id
    })

    if (!foundStudent) return res.send("Estudante não encontrado!!!")

    const estudante = {
        ...foundStudent,
        age: age(foundStudent.birth),
        birthDay: date(foundStudent.birth).birthDay
    }

    return res.render("estudantes/show" , {estudante})
}

//EDIT
exports.edit = function (req,res) {
    const  {id} = req.params

    const foundStudent = data.estudantes.find(function (estudante) {
        return estudante.id == id
    })

    if (!foundStudent) return res.send("Estudante não encontrado!!!")

    const estudante = {
        ...foundStudent,
        birth: date(foundStudent.birth).iso
    }

    return res.render("estudantes/edit" , {estudante})
}

//PUT
exports.put = function (req , res) {
    const  {id} = req.body
    let index = 0

    const foundStudent = data.estudantes.find(function (estudante , foundIndex) {
        if (id == estudante.id){
            index = foundIndex
            return true
        }
    })

    if (!foundStudent) return res.send("Estudante não encontrado!!!")

    const estudante = {
        ...foundStudent,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.estudantes[index] = estudante

    fs.writeFile("data.json", JSON.stringify(data , null , 2), function (err) {
        if (err) return res.send("Falha na gravação do arquivo!")

        return res.redirect(`/estudantes/${id}`)
    })

}

//DELETE
exports.delete = function (req , res) {
    const {id} = req.body

    const filterStudent = data.estudantes.filter(function (estudante) {
        return estudante.id != id
    })

    data.estudantes = filterStudent

    fs.writeFile("data.json" , JSON.stringify(data , null , 2) , function (err) {
        if (err) return res.send("Falha na exclusão do arquivo!")

        return res.redirect("/estudantes")
    })
}