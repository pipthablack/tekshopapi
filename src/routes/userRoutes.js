import express, { Router } from 'express';
import authValidation from '../validation/authValidation.js';
import validate from '../middleware/validate.js';
import userController, { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();
// create user
//router.route('/signup').post(registerUser);
router.post(
	'/signup',
	validate(authValidation.register),
	userController.registerUser,
	);

// login user
router.route('/login').post(loginUser);

export default router;