const companyRouter = require('express').Router()
const companyModel = require('../models/companyModel')
const verifyToken = require('../middleware/tokenVerif')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

companyRouter.post('/register', async (req, res) => {
    try {
        const company = new companyModel(req.body)
        await company.save()
        res.json("Company created succefuli")
    } catch (error) {
        res.status(500).json({
            message: "Error creating company",
            error: error.message,
        })
    }
})

companyRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const company = await companyModel.findOne({ email },{password: 0});
        if (!company) {
            return res.status(401).json({ error: "Email incorrect" });
        }

        const isPasswordValid = await bcrypt.compare(password, company.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "mot de passe incorrect" });
        }

        const token = jwt.sign(
            { companyId: company._id, email: company.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: "Connexion réussie",
            token,
            company: company
        });

    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
});

companyRouter.post('/verifytoken', verifyToken, (req, res) => {
    res.status(200).json({
        message: "Token valide",
        token: req.token,
    });
});

companyRouter.get('/company', verifyToken, async(req, res) => {
   try {
    const company = await companyModel.findById(req.companyId).populate({
         path: "employees"
    })
    res.json({company: company})
   } catch (error) {
    console.log(error);
    res.status(500).send("C'est la merde frere")
   }

});

module.exports = companyRouter