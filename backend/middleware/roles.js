// backend/middleware/roles.js

module.exports = function(requiredRole) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ msg: 'ابتدا وارد شوید' })
    if (req.user.role !== requiredRole)
      return res.status(403).json({ msg: 'دسترسی کافی نیست' })
    next()
  }
}
