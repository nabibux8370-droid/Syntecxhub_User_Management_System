const User = require('../models/User');

function unauthorized(res, message = 'Authentication required') {
  res.set('WWW-Authenticate', 'Basic realm="User Management API"');
  return res.status(401).json({ success: false, message });
}

// HTTP Basic Authentication: Authorization: Basic base64(email:password)
exports.basicAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Basic ')) return unauthorized(res);

    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const idx = decoded.indexOf(':');
    if (idx === -1) return unauthorized(res, 'Invalid credentials format');

    const email = decoded.slice(0, idx).trim().toLowerCase();
    const password = decoded.slice(idx + 1);

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return unauthorized(res, 'Invalid email or password');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// Admin ya khud wo user (same :id)
exports.selfOrAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.id === req.params.id) return next();
  return res.status(403).json({ success: false, message: 'You can only access your own account' });
};
