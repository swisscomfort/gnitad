import { Router } from 'express';
import { register, login, logout, verifyToken } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', validateRequest(registerSchema), register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateRequest(loginSchema), login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', logout);

/**
 * @route   GET /api/v1/auth/verify
 * @desc    Verify JWT token
 * @access  Private
 */
router.get('/verify', verifyToken);

export default router;
