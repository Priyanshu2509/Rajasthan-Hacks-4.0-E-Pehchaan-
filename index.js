const express = require('express')
const app = express()
const QRCode = require('qrcode')
const twilio = require('twilio')
require('dotenv').load()
const port = process.env.PORT || 3000
const path = require('path')

const accountSid = 'AC08dcd6278aa9e6e6291ded916e104175';
const authToken = '2990549b06e2ad9a3f9209035c9119e3';

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken)

const bodyParser = require('body-parser')

app.set('views', './src/views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))



app.listen(port, function(err){
    console.log('Server running on port', port)
})

app.get('/', function(req, res) {
    res.render('frontpage')   
})

app.get('/login', function (req, res) {
    res.render('login')
})

let otp
app.post('/sendOtp', function (req, res) {
    let otp;
    console.log(req.body.pno)
    client.messages.create({
        body: 'Hello from Node',
        to: req.body.pno,  // Text this number
        from: '+12062081147' // From a valid Twilio number
    })
    .then((message) => {
        console.log(message.sid);
        otp = message.sid
    })

    res.render('getotp',{ otp: otp})
})

app.post('/validateOtp', function (req, res) {
    if (req.body.otp === otp) {
        const dl = {
            name: 'Pranay',
            dob: '24.11.1985',
            dl: 'M6KUJ780',
            pno: '7838451258'
        }
        const hash = dl.name + dl.dob + dl.dl + dl.pno + 'secret'
        QRCode.toDataURL(hash, function (err, url) {
        console.log("url", url)
        res.render ('edl', { result: url })

    })
}
    else document.alert('Wrong password! Try again.')
    
})

