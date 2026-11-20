require('dotenv').config()

function checkRole(rolesPermitidos){
    return (req, res, next) => {
        const profile = res.locals.user._profile_id;
        if(!rolesPermitidos.includes(profile)){
            return res.status(403).json({message: "Acesso negado!"});
        }
        next();
    }
}

function checkProducer(req, res, next) {
    if (res.locals.user._user_type !== 'producer' || !res.locals.user._produtor_id) {
        return res.status(403).json({message: "Acesso negado!"});
    }
    next();
}

module.exports = {checkRole : checkRole, checkProducer: checkProducer}