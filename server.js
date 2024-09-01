const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const companyRouter = require('./router/companyRouter')
const employeeRouter = require('./router/employeeRouter')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("img"))
app.use(companyRouter)
app.use(employeeRouter)


app.listen(3010, err =>{
    if (err) {
        console.log(err);
    }else{
        console.log("connecté");
    }
})


mongoose.connect('mongodb://127.0.0.1:27017/rhapi')