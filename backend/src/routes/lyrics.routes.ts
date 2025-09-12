import { Router } from 'express';
import { LyricsController } from '../controllers/lyrics.controller';

const router = Router();
const lyricsController = new LyricsController();

// GET /api/lyrics?artist=ArtistName&title=SongTitle
router.get('/', lyricsController.getLyrics.bind(lyricsController));

export default router;
