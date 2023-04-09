const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('binarcar', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})


const connectToDB = async () =>{
    try{
        await sequelize.authenticate()
        console.log('Successfully connect to database')
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    sequelize,
    connectToDB
}