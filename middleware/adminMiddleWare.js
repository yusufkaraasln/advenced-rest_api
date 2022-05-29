const admin = (req, res, next) => {

    if (!req.user.isAdmin) {
        return res.status(403).json({
            mesaj: "Erişim Engellendi: Sen Admin Değilsin "
        })
    }

    next()


};


module.exports = admin;
