const authToken = () => {

}

const authRole = (role) => {
    return(req, res, next) => {
        const userRole = req.body.role
        console.log(userRole)
        if( role.includes(userRole)){
            console.log("Authorized")
            next()
        }
        else{
            return res.json({ exp : "NotAllowed"})
        }
        
    }

}


module.exports = {authToken, authRole}