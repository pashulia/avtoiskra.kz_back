const permit = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({message: "Unauthenticated!"})
        } 
        if (!roles.includes(req.user.role)) {
            return res.status(401).json("Unauthenticated")
        }
        next()
    }
};

module.exports = permit;