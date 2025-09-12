import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import type { AuthResult } from '../types/auth.types';
import type { GoogleUserInfo, IUser } from '../types/user.types';
import logger from '../utils/logger.util';
import { userModel } from '../models/user.model';

export class AuthService {
  private googleClient: OAuth2Client;

  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  private async verifyGoogleToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid token payload');
      }

      if (!payload.email || !payload.name) {
        throw new Error('Missing required user information from Google');
      }
      
      // Log the Google ID we're extracting
      console.log('Extracted Google ID from token (sub):', payload.sub);

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        profilePicture: payload.picture,
      };
    } catch (error) {
      logger.error('Google token verification failed:', error);
      throw new Error('Invalid Google token');
    }
  }

  /* TODO: Badly named function as it is not generating a refresh token
    1. Change function name to generateJwtToken
    2. Implement refresh token generation and storage
    3. Implement refresh token endpoint in AuthController
    4. Implement token rotation and invalidation logic
  */
  private generateAccessToken(user: IUser): string {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '365d',
    });
  }

  async signUpWithGoogle(idToken: string): Promise<AuthResult> {
    try {
      const googleUserInfo = await this.verifyGoogleToken(idToken);

      // Check if user already exists
      const existingUser = await userModel.findByGoogleId(
        googleUserInfo.googleId
      );
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const user = await userModel.create(googleUserInfo);
      const token = this.generateAccessToken(user);

      return { token, user };
    } catch (error) {
      logger.error('Sign up failed:', error);
      throw error;
    }
  }

  async signInWithGoogle(idToken: string): Promise<AuthResult> {
    try {
      const googleUserInfo = await this.verifyGoogleToken(idToken);
      
      // Debug log
      console.log('Attempting sign in with Google ID:', googleUserInfo.googleId);
      console.log('ID token sub field:', JSON.parse(
        Buffer.from(idToken.split('.')[1], 'base64').toString()
      ).sub);

      // Find existing user
      const user = await userModel.findByGoogleId(googleUserInfo.googleId);
      if (!user) {
        throw new Error('User not found');
      }

      const token = this.generateAccessToken(user);

      return { token, user };
    } catch (error) {
      logger.error('Sign in failed:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
