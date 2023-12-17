import mongoose from 'mongoose';
import Asyncly from '../utils/Asyncly.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// @desc    Create user
export const registerUser = Asyncly(async (req, res) => {
    const { username, email, password, role } = req.body;
  
    // Sanity checking
    if (!username || !email || !password) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Please enter all fields');
    }
  
    // Checking password length if user already exists
    if (password.length < 8) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Password cannot be less than 8 characters');
    }
  
    if (await User.findOne({ email })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
    }
  
    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });
  
    // If user created successfully
    if (newUser) {
      const { password, ...user } = newUser.toObject();
      res.status(httpStatus.CREATED).json({
        success: true,
        user: user,
      });
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user data');
    }
  });
  
  // @desc    Login user
  export const loginUser = Asyncly(async (req, res) => {
    // Get the email and password from req.body
    const { email, password } = req.body;
  
    // Sanity checking
    if (!email || !password) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Please enter all fields');
    }
  
    // Finding user in DB
    const user = await User.findOne({ email }).select('+password');
  
    // If user not found
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  
    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
  
    // If password not match
    if (!isMatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid credentials');
    }
  
    // If password matches
    const userToken = generateToken({ id: user._id });
    const { password: thePassword, ...userData } = user.toObject();
    res.status(httpStatus.OK).json({
      success: true,
      user: userData,
      token: userToken,
    });
  });


  export default {
    registerUser,
    loginUser,
  }