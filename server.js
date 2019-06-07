const express = require('express');
const bodyParser = require('body-parser');
const product = require('./routes/product.route');
const user = require('./routes/user.route');
const auth = require('./routes/auth.route');
const leftNav = require('./routes/leftNav.route');
const passport = require('passport');
const cors = require('cors')
const app = express();
app.use(passport.initialize());
app.use(cors());

require('./controllers/auth.controller');

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://localhost:27017/wedding_dress';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Config route
app.use('/users', user);
app.use('/products', passport.authenticate('jwt', { session : false }), product);
app.use('/leftnav', passport.authenticate('jwt', { session : false }), leftNav);
app.use('/auth', auth);

//Handle 404
app.use(function(req, res, next){
    let err = new Error('Not Found');
    err.status=404;
    next();
});

//Handle error
app.use(function(err, req, res, next){
    console.log(err);
    switch(err.status){
        case 401:
            res.status(401).json({message: err.message || '', code: err.code || ''});
            break;
        case 404:
            res.status(404).json({message: 'Not Found'});
            break;
        default:
            res.status(500).json({message: 'Something went wrong'});
            break;
    }
})

//Config port
let port = 1234;
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});