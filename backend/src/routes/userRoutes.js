const express = require('express')
const router = express.Router()
const {
  getUsers,
  getUsersByRole,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController')
const { auth, checkRole } = require('../middleware/auth')

// All routes require authentication and admin role
router.use(auth, checkRole('admin'))

router.get('/', getUsers)
router.get('/role/:role', getUsersByRole)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router