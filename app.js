const express = require('express')
var cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const path = require('path');
const url = 'mongodb://localhost:27017/pipes'
const app = express()
const { handleError } = require('./utilities/error');
const createError = require('http-errors');
const morgan = require('morgan')
app.use(morgan('combined'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)))
app.use('/uploads', express.static('uploads'));
// var whitelist = ['http://192.168.1.20:4200', 'http://192.168.1.20', 'http://localhost:4200']
// var corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }, methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
// }
// app.use(cors(corsOptions))
app.use(cors())

mongoose.connect(url, { useNewUrlParser: true, 'useFindAndModify': false, 'useCreateIndex': true, 'useUnifiedTopology': true });
const con = mongoose.connection

con.on('open', function () {
    console.log('mongodb connection made');
});
const productRoute = require('./routers/product');
const userRoute = require('./routers/userRoute');
const cartRoute = require('./routers/cartRoute');
const smsRoutes = require('./routers/smsRoutes')
app.use('/products', productRoute)
app.use('/user', userRoute)
app.use('/cart', cartRoute)
app.use('/sms', smsRoutes)

// error handler
app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    handleError(err, res);
});
app.listen(9000, () => {
    console.log('server started at port 9000');
})
