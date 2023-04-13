const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const fs = require('fs')
const app = express()
const port = 5000
const expressLayout = require('express-ejs-layouts')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const {
    body,
    validationResult
} = require('express-validator');
const {
    Op
} = require('sequelize');


// cek nama mobil tersedia
const cekNamaMobilTersedia = (nama) => {
    return Car.findOne({
        where: {
            nama: nama
        }
    })
}


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


// manggil model
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
app.use(express.urlencoded({
    extented: true
}))
app.use(cookieParser('secret'))
app.use(session({
    cookie: {
        maxAge: 6000
    },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())



app.get('/', (req, res) => {
    res.render('index', {
        title: 'halaman dashboard',
        layout: 'layouts/main-layout'
    })
})

app.get('/cars', async (req, res) => {

    const date = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'UTC'
    };

    if (req.query.filter) {
        cars = await Car.findAll({
            where: {
                ukuran: {
                    [Op.substring]: req.query.filter
                }
            },
            order: [
                ['updatedAt', 'DESC']
            ]
        })
    } else {
        cars = await Car.findAll({
            order: [
                ['updatedAt', 'DESC']
            ]
        })
    }

    const {
        search
    } =
    req.query

    if (search) {
        cars = await Car.findAll({
            where: {
                nama: {
                    [Op.like]: '%' + search + '%'
                }
            }
        })
    }

    res.render('cars', {
        title: 'halaman cars',
        layout: 'layouts/main-layout',
        cars,
        date,
        message: req.flash('message')
    })
    // res.status(200).json(cars)
})

app.get('/cars/add', (req, res) => {
    res.render('add', {
        title: 'halaman add car',
        layout: 'layouts/main-layout'
    })
})

app.post('/cars',
    upload.single('foto'),

    [
        body('nama').custom(async (value) => {
            const namaMobilAda = await cekNamaMobilTersedia(value)

            if (namaMobilAda) {
                throw new Error('Data mobil sudah ada!')
            }

            return true
        })
    ],

    async (req, res) => {

        const result = await validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                errors: result.array()
            });
        }

        let response = await Car.create({
            nama: req.body.nama,
            harga_sewa: req.body.harga_sewa,
            ukuran: req.body.ukuran,
            foto: req.file.filename,
        }).then((response) => {
            req.flash('message', 'Data berhasil ditambahkan!');
            res.redirect('/cars')
        }).catch((err) => {
            console.error(err)
        })


        // res.status(201).json(response)

    })


app.get('/cars/edit/:id', async (req, res) => {
    const car = await Car.findByPk(req.params.id)
    res.render('edit', {
        title: 'halaman update car',
        layout: 'layouts/main-layout',
        car
    })
})

app.post('/cars/update', upload.single('foto'), async (req, res) => {

    // const car = await Car.findOne({
    //     id: req.params.id
    // })
    // if (!car) {
    //     return res.status(404).json({
    //         message: 'Data mobil tidak ditemukan!'
    //     })
    // }

    // const filepath = `./public/assets/img/uploads/${car.foto}`
    // fs.unlinkSync(filepath)


    try {
        let carId = req.body.id
        let nama = req.body.nama
        let harga_sewa = req.body.harga_sewa
        let ukuran = req.body.ukuran
        let foto = req.file.filename

        await Car.update({
            nama: nama,
            harga_sewa: harga_sewa,
            ukuran: ukuran,
            foto: foto
        }, {
            where: {
                id: carId
            }
        })

        req.flash('message', 'Data berhasil diubah!');
        res.redirect('/cars')
    } catch (err) {
        console.log(err.message)
    }
})
app.get('/cars/delete/:id', async (req, res) => {
    const car = await Car.findOne({
        where: {
            id: req.params.id
        }
    })

    if (!car) {
        return res.status(404).json({
            message: 'Data mobil tidak ditemukan!'
        })
    }

    try {
        const filepath = `./public/assets/img/uploads/${car.foto}`
        fs.unlinkSync(filepath)

        await Car.destroy({
            where: {
                id: req.params.id
            }
        })
        res.redirect('/cars')
    } catch (err) {
        console.log(err.message)
    }

})


app.listen(port, async (req, res) => {
    console.log(`App listening on port http://localhost:${port}/`)
    await connectToDB()
})