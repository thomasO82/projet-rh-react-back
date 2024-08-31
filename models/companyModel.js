const mongoose = require("mongoose")
const bcryp = require('bcrypt')
const employeeModel = require('./employeeModel')
require('dotenv').config()


const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "nom requis"],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u.test(v)
            },
            message: "Entrez un nom valide"
        }
    },
    siret: {
        type: String,
        required: [true, "siret requis"],
        validate: {
            validator: function (v) {
                return /^[0-9]{14}$/u.test(v);
            },
            message: "Entrez un numéro de siret valide"
        },
    },
    email: {
        type: String,
        required: [true, "mail requis"],
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v);
            },
            message: "Entrez un mail valide"
        },
    },
    name_director: {
        type: String,
        required: [true, "nom du directeur requis"],
        validate: {
            validator: function (v) {
                return /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/g.test(v);
            },
            message: "Entrez un nom valide"
        },
    },
    employees: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "employees"
        }]
    },
    password: {
        type: String,
        required: [true, "mot de passe requis"],
    }

})

companySchema.pre('save', function (next) {
    try {
        this.password = bcryp.hashSync(this.password, parseInt(process.env.SALT))
        next()
    } catch (error) {
        next(error)
    }
})

const companyModel = mongoose.model("companies", companySchema)
module.exports = companyModel