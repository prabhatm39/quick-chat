
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const dbconfig = require('./config/dbConfig.js')


let server = require('./app.js');
const port = process.env.PORT_NUMBER || 5000;


server.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})
