const {Router} = require('express');
const authController = require('../controller/authController');
const {requireAuth} = require('../middleware/authMiddleware')

const router = Router();

router.get('/signup', authController.signup_get)
router.post('/signup', authController.signup_post)
router.get('/login', authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', requireAuth, authController.logOut)

module.exports = router;