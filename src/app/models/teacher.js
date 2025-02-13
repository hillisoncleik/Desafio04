const db = require('../../config/db')
const {age , date} = require('../../lib/util')

module.exports = {
    all(callback){
        db.query(`
            SELECT teachers.* , count(students) AS total_students
            FROM teachers
            LEFT JOIN students ON (teachers.id = students.teacher_id)
            GROUP BY teachers.id
            ORDER BY total_students DESC` , function (err , results) {
            
            if (err) throw `Database error!!! ${err}`
            
            callback(results.rows)
        })
    },
    create(data , callback){
        const query = `
            INSERT INTO teachers(
                avatar_url,
                name,
                birth,
                escolaridade,
                aula,
                services,
                created_at
            )VALUES($1 , $2 , $3 , $4 , $5 , $6 , $7)
            RETURNING id
        `
        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.escolaridade,
            data.aula,
            data.services,
            date(Date.now()).iso
        ]

        db.query(query , values , function (err , results) {
            if (err) throw `Database error!!! ${err}`
            callback(results.rows[0])
        })
    },
    find(id , callback){
        db.query(`
            SELECT * 
            FROM teachers 
            WHERE id=$1`, [id]  , function (err , results) {
            
            if (err) throw `Database error!!! ${err}`
            
            callback(results.rows[0])
        })
    },
    update(data , callback){
        const query = `
            UPDATE teachers SET
                avatar_url=($1),
                name=($2),
                birth=($3),
                escolaridade=($4),
                aula=($5),
                services=($6)
            WHERE id= $7
        `
        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.escolaridade,
            data.aula,
            data.services,
            data.id
        ]

        db.query(query , values , function (err , results) {
            if (err) throw `Database error!!! ${err}`
            callback()
        })
    },
    delete(id , callback){
        db.query(`
            DELETE FROM teachers 
            WHERE id=$1`, [id]  , function (err , results) {
            
            if (err) throw `Database error!!! ${err}`
            
            callback()
        })
    },
    findBy(filter , callback){
        db.query(`
            SELECT teachers.* , count(students) AS total_students
            FROM teachers
            LEFT JOIN students ON (teachers.id = students.teacher_id)
            WHERE teachers.name ILIKE '%${filter}%'
            OR teachers.services ILIKE '%${filter}%'
            GROUP BY teachers.id
            ORDER BY total_students DESC` , function (err , results) {
            
                if (err) throw `Database error!!! ${err}`
                
                callback(results.rows)
            }
        )
    },
    paginate(params){
        const {filter , limit , offset , callback} = params

        let query = "",
            filterQuery = ""
            totalQuery = `(SELECT count(*) FROM teachers) AS total`

        if(filter){
            filterQuery = `
                WHERE teachers.name ILIKE '%${filter}%'
                OR teachers.services ILIKE '%${filter}%'
            `
            totalQuery = `
                (SELECT count(*) FROM teachers
                ${filterQuery}
                ) AS total
            `
        }

        query = `
        SELECT teachers.* , ${totalQuery} , count(students) AS total_students
        FROM teachers
        LEFT JOIN students ON (teachers.id = students.teacher_id)
        ${filterQuery}
        GROUP BY teachers.id
        ORDER BY total_students DESC
        LIMIT $1 OFFSET $2`

        db.query(query , [limit , offset], function (err , results) {
            if (err) throw `DATABASE ERROR: ${err}`

            callback(results.rows)
        })
    }
}