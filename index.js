const express = require('express')
const app = express()
const port = 5000
const expressLayout = require('express-ejs-layouts')
const cors = require('cors')
const body = require('body-parser')
const multer = require('multer')
const path = require('path')


// upload image
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets/img/uploads')
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({
    storage: storage
})

const {
    sequelize,
    connectToDB
} = require('./config/Database')

const Car = require('./models/CarModels')

app.set('view engine', 'ejs')

app.use(cors())
app.use(expressLayout)
app.use(express.json())
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded())


app.get('/', (req, res) => {
    res.render('index', {
        title: 'halaman dashboard',
        layout: 'layouts/main-layout'
    })
})

app.get('/cars', async (req, res) => {

    const cars = await Car.findAll()
    // res.status(200).json(cars)

    res.render('cars', {
        title: 'halaman cars',
        layout: 'layouts/main-layout',
        cars
    })
})

app.get('/cars/add', (req, res) => {
    res.render('add', {
        title: 'halaman add car',
        layout: 'layouts/main-layout'
    })
})

app.post('/cars', upload.single('foto'), async (req, res) => {
    try {
        let response = await Car.create({
            nama: req.body.nama,
            harga_sewa: req.body.harga_sewa,
            ukuran: req.body.ukuran,
            foto: req.file.filename,
        }).then((response) => {
            res.redirect('/cars')
        }).catch((err) => {
            console.error(err)
        })


        // res.status(201).json(response)
    } catch (err) {
        console.log(err.message)
    }
})


app.get('/cars/edit/:id', async (req, res) => {
    const car = await Car.findByPk(req.params.id)
    res.render('edit', {
        title: 'halaman update car',
        layout: 'layouts/main-layout',
        car
    })
})

app.post('/cars/update', (req, res) => {
    try {
        let carId = req.body.id
        let car = {
            nama: req.body.nama,
            harga_sewa: req.body.harga_sewa,
            ukuran: req.body.ukuran,
            foto: req.body.foto
        }
        let response = Car.update(car, {
            where: {
                id: carId
            }
        })
        res.redirect('/cars')
        // res.status(201).json(response)
    } catch (err) {
        console.log(err.message)
    }
})
app.get('/cars/delete/:id', async (req, res) => {
    try {
        let response = await Car.destroy({
            where: {
                id: req.params.id
            }
        })
        // res.status(201).json(response)
        res.redirect('/cars')
    } catch (err) {
        console.log(err.message)
    }
})





app.listen(port, async (req, res) => {
    console.log(`App listening on port http://localhost:${port}/`)
    await connectToDB()
})











// import express from 'express'
// import cors from 'cors'
// import CarRoute from '../routes/CarRoute.js'
// import expressLayout from 'express-ejs-layouts'

// const app = express()
// const port = 5000


// app.set('view engine', 'ejs')

// app.use('/public', express.static('public'))
// app.use(expressLayout)
// app.use(express.json())
// app.use(cors())
// app.use(CarRoute)

// app.get('/', (req, res) => {
//     res.render('index', {
//         title: 'halaman dashboard',
//         layout: 'layouts/main-layout'
//     })
// })

// app.get('/cars', (req, res) => {
//     res.render('cars', {
//         title: 'halaman cars',
//         layout: 'layouts/main-layout'
//     })
// })

// app.get('/add', (req, res) => {
//     res.render('add', {
//         title: 'halaman add car',
//         layout: 'layouts/main-layout'
//     })
// })

// app.get('/edit', (req, res) => {
//     res.render('edit', {
//         title: 'halaman update car',
//         layout: 'layouts/main-layout'
//     })
// })