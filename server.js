const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const companyRouter = require('./router/companyRouter')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(companyRouter)


app.listen(3009, err =>{
    if (err) {
        console.log(err);
    }else{
        console.log("connecté");
    }
})


mongoose.connect('mongodb://localhost:27017/rhapi')