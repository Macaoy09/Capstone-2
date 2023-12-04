// JSON Web Token
const jwt = require('jsonwebtoken');

// Secret Keyword
const secret = "ProductCheapShots";

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    }

    return jwt.sign(data, secret, {})
}

// Token Verification for non admin user
module.exports.verify = (req, res, next) => {

    let token = req.headers.authorization;

    if(typeof token == 'undefined'){
        return res.send({ auth: 'Failed. No Token!'});
    } else {
        token = token.slice(7, token.length);
    }

        //Token Decryption

        jwt.verify(token, secret, function(err, decodedToken){
            if(err){
                return res.send({
                    auth: 'Failed',
                    message: err.message
                })
            } else {
                req.user = decodedToken

                next()
            }
        })
}

// Token Verification for admin user
module.exports.verifyAdmin =(req, res, next) => {
    if(req.user.isAdmin){
        next()
    } else {
        return res.send({
            auth: 'Failed',
            message: "Action Forbidden!"
        })
    }
}