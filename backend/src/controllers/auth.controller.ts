import { NextFunction, Request, Response } from 'express';

import { authService } from '../services/auth.service';
import {
  AuthenticateUserRequest,
  AuthenticateUserResponse,
} from '../types/auth.types';
import logger from '../utils/logger.util';

export class AuthController {
  async signUp(
    req: Request<unknown, unknown, AuthenticateUserRequest>,
    res: Response<AuthenticateUserResponse>,
    next: NextFunction
  ) {
    try {
      const { idToken } = req.body;

      const data = await authService.signUpWithGoogle(idToken);

      return res.status(201).json({
        message: 'User signed up successfully',
        data,
      });
    } catch (error) {
      logger.error('Google sign up error:', error);

      if (error instanceof Error) {
        switch (error.message) {
          case 'Invalid Google token':
            return res.status(401).json({
              message: 'Invalid Google token',
            });
          
          case 'User already exists':
            return res.status(409).json({
              message: 'User already exists, please sign in instead.',
            });
          
          case 'Failed to process user':
            return res.status(500).json({
              message: 'Failed to process user information',
            });
        }
      }

      next(error);
    }
  }

  async signIn(
    req: Request<unknown, unknown, AuthenticateUserRequest>,
    res: Response<AuthenticateUserResponse>,
    next: NextFunction
  ) {
    try {
      const { idToken } = req.body;

      console.log('ID Token:', idToken); // Debug log

      const data = await authService.signInWithGoogle(idToken);

      return res.status(200).json({
        message: 'User signed in successfully',
        data,
      });
    } catch (error) {
      logger.error('Google sign in error:', error);

      if (error instanceof Error) {
        switch (error.message) {
          case 'Invalid Google token':
            return res.status(401).json({
              message: 'Invalid Google token',
            });
          
          case 'User not found':
            return res.status(404).json({
              message: 'User not found, please sign up first.',
            });
          
          case 'Failed to process user':
            return res.status(500).json({
              message: 'Failed to process user information',
            });
        }
      }

      next(error);
    }
  }
}
