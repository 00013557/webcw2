const express = require('express')
const req = require('express/lib/request')

const app = express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))

app.use(express.urlencoded({ extended: false}))

// localhost:10000
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    const full_name = req.body.full_name
    const phone_number = req.body.phone_number
    const table_number = req.body.table_number
    const datetime = req.body.datetime
    const information = req.body.information

    if (full_name.trim() == '' && phone_number.trim() == '' && table_number.trim() == '' && datetime.trim() == '' && information.trim() == '' ) {
        res.render('create', { error: true })
    } else {
        fs.readFile('./data/bookings.json', (err, data) => {
            if (err) throw err

            const bookings = JSON.parse(data)

            bookings.push({
                id: id (),
                full_name: full_name, 
                phone_number: phone_number,
                table_number: table_number,
                datetime: datetime,
                information: information,
            })

            fs.writeFile('./data/bookings.json', JSON.stringify(bookings), err => {
                if (err) throw err

                res.render('create', { success: true })
            })
        })
    }

})

app.get('/api/v1/bookings', (req, res) => {
    fs.readFile('./data/bookings.json', (err, data) => {
        if (err) throw err

        const bookings = JSON.parse(data)

        res.json(bookings)
    })
})

app.get('/bookings', (req, res) => {
    fs.readFile('./data/bookings.json', (err, data) => {
        if (err) throw err

        const bookings = JSON.parse(data)

        res.render('bookings', { bookings: bookings })
    })
})

app.get('/booking/:id', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/bookings.json', (err, data) => {
        if (err) throw err

        const bookings = JSON.parse(data)

        const booking = bookings.filter(booking => booking.id == id)[0]

        res.render('detail', { booking: booking })
    })
})

app.get('/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/bookings.json', (err, data) => {
        if (err) throw err 

        const bookings = JSON.parse(data)

        const filteredBookings = bookings.filter(booking => booking.id != id)

        fs.writeFile('./data/bookings.json', JSON.stringify(filteredBookings), (err) => {
            if (err) throw err 

            res.render('bookings', { bookings: filteredBookings, deleted: true})
        })
    })
})

/*app.get('/:id/update', (req,res) => {
    const id = req.params.id
    const full_name = req.params.full_name
            if (err) throw err
            const bookings = JSON.parse(data)
            const booking = bookings.filter(booking => booking.id === id)[0]
            res.render('detail', {booking: booking, error:true })
        })
    } else {
        fs.readFile('./data/bookings.json', (err, data) => {
            if (err) throw err
            const bookings = JSON.parse(data)
            const booking = bookings.filter(booking => booking.id === id)[0]
            const bookingId = bookings.IndexOf(booking)
            const splicedBooking = bookings.splice(BookingId, 1)[0]
            splicedBooking.full_name = full_name


            bookings.push(splicedBooking)
            fs.readFile('./data/bookings.json', JSON.stringify(bookings), err => {
                if (err) throw err
            })

        })
    }
})*/

app.listen(10000, err => {
    if (err) console.log(err)

    console.log('Server is running on port 10000...')
})

function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
};