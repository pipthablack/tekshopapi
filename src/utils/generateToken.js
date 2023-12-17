
import jwt from "jsonwebtoken";

/**
 * Generate a JSON web token for a user
 * @param {string} id - The id of the user
 * @param {boolean} isAdmin - Whether the user is an admin
 * @returns {string} - The generated JSON web token
 */
const generateToken = (id, isAdmin) => {
  if (process.env.JWT_SECRET !== undefined && process.env.JWT_EXPIRES_IN !== undefined) {
    return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  } else {
    throw new Error('JWT_SECRET or JWT_EXPIRES_IN is undefined in the environment variables.');
  }
};

export default generateToken;