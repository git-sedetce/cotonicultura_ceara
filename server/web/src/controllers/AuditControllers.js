const database = require("../models");

class AuditControllers {
   
   static async register(req,res){
    
    const newRegister = req.body;
    // console.log('newRegister', newRegister);
    try{
        const novoRegistro = await database.audit.create(newRegister)
        return res.status(200).json(novoRegistro)
    }catch (error){
        return res.status(500).json(error.message)
    }

   }

   static async getRegisters(req, res) {
       try {
         const registers = await database.audit.findAll({
           order: [["createdAt", "ASC"]],
           attributes: ["tipo_acao", "acao", "createdAt"],
           include: [
          {
            association: "ass_audit_users",
            attributes: ["id", "nome", "user_email"],
          }
        ],
         });
   
         return res.status(200).json(registers);
       } catch (error) {
         return res.status(500).json(error.message);
       }
     }

}

module.exports = AuditControllers;