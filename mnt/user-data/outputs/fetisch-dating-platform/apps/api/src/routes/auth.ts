import { Router } from 'express';
import { authController } from '../controllers/authController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', asyncHandler(authController.register));

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', asyncHandler(authController.login));

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', asyncHandler(authController.refreshToken));

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', asyncHandler(authController.logout));

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post('/verify-email', asyncHandler(authController.verifyEmail));

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', asyncHandler(authController.forgotPassword));

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password
 * @access  Public
 */
router.post('/reset-password', asyncHandler(authController.resetPassword));

export default router;
