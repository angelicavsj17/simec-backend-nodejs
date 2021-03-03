const jwt = require('jsonwebtoken');
const config = require('../config')
const secret = config.jwt.secret

function sign(data) {
    return jwt.sign(data, secret, { expiresIn: 31557600 })
};

function signPasswordToken(data) {
    return jwt.sign(data, secret, { expiresIn: 900 })
};

function verify(token) {
    return jwt.verify(token, secret)
}

const check = {
    own: function (req, owner) {
        const decoded = decodeHeader(req)


        if (decoded.id !== owner) {
            throw new Error('No puedes hacer esto');
        }

    }
}

function getToken(auth) {
    if (!auth) {
        throw new Error('No viene token');
    }

    //formato de token correcto
    if (auth.indexOf('bearer') === -1) {

        throw new Error('invalid format')
    }

    let token = auth.replace('bearer', '')
    return token
}



//  decodificar el token
function decodeHeader(req) {

    const authorization = req.headers.authorization || '';
    const token = getToken(authorization);
    const decoded = verify(token);

    req.user = decoded;
    return decoded;
}

module.exports = {
    sign,
    check,
    verify,
    signPasswordToken
}