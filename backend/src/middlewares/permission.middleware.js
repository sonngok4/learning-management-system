// middlewares/permission.middleware.js
function checkPermission(resource, action) {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!user.hasPermission(resource, action)) {
            return res.status(403).json({
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }

        next();
    };
}

module.exports = checkPermission;