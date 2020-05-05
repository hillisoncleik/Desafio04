module.exports = {
    age: function (timestamp) {
        const today = new Date()
        const birthDate = new Date(timestamp)
        
        let age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth()
        
        if (month < 0 || month == 0 && today.getDate() < birthDate.getDate()){
            age = age - 1
        }
        return age
    },
    date: function (timestamp) {
        const date = new Date(timestamp)

        const yyyy = date.getUTCFullYear()
        const mm = `0${date.getUTCMonth()+1}`.slice(-2)
        const dd = `0${date.getUTCDate()}`.slice(-2)

        return{
            pt_br: `${dd}/${mm}/${yyyy}`,
            iso: `${yyyy}-${mm}-${dd}`,
            birthDay: `${dd}/${mm}`
        }
    }
}