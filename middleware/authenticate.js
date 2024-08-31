const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
    // Extract token from cookies
    const token = req.cookies.token;
    // If no token, return an unauthorized response
    if (!token) return res.render("login");
    // Verify the token
    jwt.verify(token, 'secretkey', (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid Token' });
        req.user = user; // Add the user info to the request
        res.render("admindash/index")
    });
};

module.exports = authenticateToken; 