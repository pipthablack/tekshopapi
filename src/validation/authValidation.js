import Joi from 'joi';
import { password } from './customValidation.js';



const register = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().custom(password),
		username: Joi.string().required(),
		// last_name: Joi.string().required(),
		// phone: Joi.string(),
		// profile_pic: Joi.string(),
		// org_id: Joi.string()
	}),
};

const login = {
	body: Joi.object().keys({
		email: Joi.string().required(),
		password_hash: Joi.string().required(),
	}),
};

const logout = {
	body: Joi.object().keys({
		refreshToken: Joi.string().required(),
	}),
};


export default {
	register,
	login,
	logout,
    
}