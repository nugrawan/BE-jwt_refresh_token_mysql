const jwt = require('jsonwebtoken');

const jwtVerify = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null) return res.status(401);
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.email = decoded.email;
        next();
    })
}

module.exports = jwtVerify;