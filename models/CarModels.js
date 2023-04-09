const {
    sequelize
} = require('../config/Database')
const {
    DataTypes
} = require('sequelize')

const Car = sequelize.define('cars', {
    nama: DataTypes.STRING,
    harga_sewa: DataTypes.STRING,
    ukuran: DataTypes.STRING,
    foto: DataTypes.STRING
})

module.exports = Car
// sequelize.sync()





















// import {
//     Sequelize
// } from "sequelize"
// import db from '../config/Database.js'

// const {
//     DataTypes
// } = Sequelize

// const Car = db.define('cars', {
//     nama: DataTypes.STRING,
//     harga_sewa: DataTypes.STRING,
//     ukuran: DataTypes.STRING,
//     foto: DataTypes.STRING
// }, {
//     freezeTableName: true
// })

// export default Car


//     // digunakan untuk menjalankan file CarModels
//     (async () => {
//         await db.sync();
//     })()