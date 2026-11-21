const mongoose = require('mongoose');
const User = require('../models/User');

const checkId = (id, res) => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ success: false, message: 'Invalid user id' });
    return false;
  }
  return true;
};

// CREATE  POST /api/users  (public signup)
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, age } = req.body;
    // Role yahan se set nahi hota (security) - hamesha 'user'
    const user = await User.create({ name, email, password, age });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// READ ALL  GET /api/users?page=1&limit=10&search=ali  (admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const filter = {};
    if (req.query.search) {
      const rx = new RegExp(String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: rx }, { email: rx }];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// READ ONE  GET /api/users/:id
exports.getUser = async (req, res, next) => {
  try {
    if (!checkId(req.params.id, res)) return;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// UPDATE  PUT /api/users/:id
exports.updateUser = async (req, res, next) => {
  try {
    if (!checkId(req.params.id, res)) return;
    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { name, email, password, age, role } = req.body;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (password !== undefined) user.password = password; // pre-save hook hash karega
    if (age !== undefined) user.age = age;
    if (role !== undefined) {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Only admin can change role' });
      }
      user.role = role;
    }

    await user.save(); // validators + hashing chalte hain
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// DELETE  DELETE /api/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    if (!checkId(req.params.id, res)) return;
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
