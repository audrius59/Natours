const express = require('express');
const {
  getOverview,
  getTour,
  getLogin,
  getAccount,
  updateUserData,
  getMyTours
} = require('../controllers/viewController');
const { isLoggedin, protect } = require('../controllers/authController');
const { createBookingCheckout } = require('../controllers/bookingController');

const router = express.Router();

router.get('/', createBookingCheckout, isLoggedin, getOverview);
router.get('/tour/:slug', isLoggedin, getTour);
router.get('/login', isLoggedin, getLogin);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

router.post('/subit-user-data', protect, updateUserData);

module.exports = router;
