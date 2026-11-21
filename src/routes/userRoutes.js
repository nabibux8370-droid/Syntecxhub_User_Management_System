const router = require('express').Router();
const c = require('../controllers/userController');
const { basicAuth, adminOnly, selfOrAdmin } = require('../middleware/auth');

router.post('/', c.createUser);                                   // public signup
router.get('/', basicAuth, adminOnly, c.getUsers);                // admin: list
router.get('/:id', basicAuth, selfOrAdmin, c.getUser);            // self/admin
router.put('/:id', basicAuth, selfOrAdmin, c.updateUser);         // self/admin
router.delete('/:id', basicAuth, selfOrAdmin, c.deleteUser);      // self/admin

module.exports = router;
