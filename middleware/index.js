middleware = {
    isLoggedIn: function(req, res, next) {
        let token = req.headers.authorization;
        token = token.replace('Bearer ', '');

        jwt.verify(token, 'secret', (err, user) => {
            if (err) {
                res.statusMessage = "Token no valido";
                return res.status(401).send();
            }

            next();
        });
    }
}

module.exports = middleware;