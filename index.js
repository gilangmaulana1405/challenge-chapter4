const express = require('express')
const app = express()
const port = 5000
const expressLayout = require('express-ejs-layouts')
const cors = require('cors')
const body = require('body-parser')

const {
    sequelize,
    connectToDB
} = require('./config/Database')

const Car = require('./models/CarModels')

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

app.use(cors())
app.use(expressLayout)
app.use(express.json())


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

app.post('/cars', async (req, res) => {
    try {
        let response = await Car.create(req.body)
        res.status(201).json(response)
    } catch (err) {
        console.log(err.message)
    }
})
app.put('/cars/:id', async (req, res) => {
    try {
        let response = await Car.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.status(201).json(response)
    } catch (err) {
        console.log(err.message)
    }
})
app.delete('/cars/:id', async (req, res) => {
    try {
        let response = await Car.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(201).json(response)
    } catch (err) {
        console.log(err.message)
    }
})



// form
app.get('/cars/add', (req, res) => {
    res.render('add', {
        title: 'halaman add car',
        layout: 'layouts/main-layout'
    })
})

app.get('/cars/edit', (req, res) => {
    res.render('edit', {
        title: 'halaman update car',
        layout: 'layouts/main-layout'
    })
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