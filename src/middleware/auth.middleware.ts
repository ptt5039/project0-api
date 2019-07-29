export const authMiddleware = (...roles) => (req, res, next) => {
    if (req.session.user) {
        if (roles.includes(req.session.user.role.role)) {
            next();
        } else if (req.session.user.userId === +req.params.id) {
            next();
        } else if (req.session.user.userId === req.body.userId) {
            next();
        }
        else {
            // 403 means forbidden
            res.status(403);
            res.send('Permission Denied');
        }
    } else {
        // 401 means unauthorized
        res.sendStatus(401);
    }
};
