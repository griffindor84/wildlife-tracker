function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'Administrator') {
    return next();
  }
  return res.status(403).json({ error: 'Admin access required' });
}

module.exports = adminOnly;