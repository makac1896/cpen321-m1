import type { LyricsRequest, LyricsResponse } from '../types/lyrics.types';
import logger from '../utils/logger.util';

export class LyricsService {
  private static readonly BASE_URL = 'https://api.lyrics.ovh/v1';

  static async getLyrics(request: LyricsRequest): Promise<LyricsResponse> {
    try {
      const { artist, title } = request;
      
      const encodedArtist = encodeURIComponent(artist);
      const encodedTitle = encodeURIComponent(title);
      
      const response = await fetch(`${this.BASE_URL}/${encodedArtist}/${encodedTitle}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            message: 'Lyrics not found',
            error: 'No lyrics found for this artist and title'
          };
        }
        
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json() as { lyrics?: string };
      
      return {
        message: 'Lyrics found successfully',
        data: {
          lyrics: data.lyrics || ''
        }
      };
    } catch (error) {
      logger.error('Error fetching lyrics:', error);
      
      if (error instanceof Error) {
        return {
          message: 'Lyrics API error',
          error: error.message
        };
      }
      
      return {
        message: 'Internal server error',
        error: 'An unexpected error occurred while fetching lyrics'
      };
    }
  }
}
