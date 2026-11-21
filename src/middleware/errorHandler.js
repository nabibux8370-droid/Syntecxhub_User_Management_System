exports.notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  // Duplicate key (unique email)
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Email already exists' });
  }
  // Invalid JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON body' });
  }
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
};
