const express = require('express')
const {registerUser, authUser, allUsers} = require('../controllers/userControllers')
const {protect } = require('../middleware/authMiddleware')

const router = express.Router()

//for signup
router.route('/').post(registerUser).get(protect, allUsers)
// router.post('/',registerUser)


// for login
router.post('/login', authUser)

//for user search after successful login
// router.get('/',protect, allUsers)


module.exports = router

