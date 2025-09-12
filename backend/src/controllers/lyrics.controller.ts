import { NextFunction, Request, Response } from 'express';
import { LyricsService } from '../services/lyrics.service';
import { LyricsRequest, LyricsResponse } from '../types/lyrics.types';
import logger from '../utils/logger.util';

export class LyricsController {
  async getLyrics(
    req: Request<{}, {}, {}, LyricsRequest>,
    res: Response<LyricsResponse>,
    next: NextFunction
  ) {
    try {
      const { artist, title } = req.query;
      
      if (!artist || !title) {
        return res.status(400).json({
          message: 'Bad request',
          error: 'Both artist and title are required'
        });
      }
      
      const lyricsResult = await LyricsService.getLyrics({ artist, title });
      
      if (lyricsResult.error) {
        return res.status(404).json(lyricsResult);
      }
      
      return res.status(200).json(lyricsResult);
    } catch (error) {
      logger.error('Failed to fetch lyrics:', error);
      
      if (error instanceof Error) {
        return res.status(500).json({
          message: 'Failed to fetch lyrics',
          error: error.message
        });
      }
      
      next(error);
    }
  }
}
