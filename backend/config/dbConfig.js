const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const mongoose = require('mongoose');
// connect mongodb database
mongoose.connect(process.env.CONN_STRING);

const db = mongoose.connection;

db.on('connected',()=> {
    console.log('connected to database');
})

db.on('err', ()=> {
    console.log('error connecting to database');
})

module.exports= db;

