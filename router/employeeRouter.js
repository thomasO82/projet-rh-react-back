const employeeRouter = require('express')()
const employeeModel = require('../models/employeeModel')
const upload = require('../middleware/upload');
const companyModel = require('../models/companyModel');
const verifyToken = require('../middleware/tokenVerif');


employeeRouter.post("/employee", upload.single("img"), verifyToken, async (req, res) => {
    try {
    
        const employe = new employeeModel({
            name: req.body.name,
            firstname: req.body.firstname,
            role: req.body.role,
            img: req.file ? req.file.filename : "defaut.jpg"
        });

        await employe.save();
        await companyModel.updateOne({_id: req.companyId},{$push: {employees: employe._id}})
        res.status(201).json(employe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'ajout de l'employé", error });
    }
});


employeeRouter.delete('/employee/:id', verifyToken, async (req,res)=>{
    try {
        await employeeModel.deleteOne({_id: req.params.id})
        await companyModel.updateOne({_id: req.companyId }, {$pull: {employees: req.params.id}})
         res.json({id: req.params.id})
    } catch (error) {
     res.json.status(500).json({message: "bravo, tu as resussi a peter la seule route impossible a peter"})   
    }
  
})

employeeRouter.put('/employee/:id', verifyToken, upload.single('img'), async (req, res) => {
    try {
        
       const test = await employeeModel.updateOne({ _id: req.params.id }, req.body);

        const updatedEmployee = await employeeModel.findById(req.params.id);

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employé non trouvé" });
        }

        if (req.file) {
            updatedEmployee.img = req.file.filename; 
        }

        await updatedEmployee.save();

        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'employé" });
    }
});





module.exports = employeeRouter