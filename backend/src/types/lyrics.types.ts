export type LyricsResponse = {
  message: string;
  data?: {
    lyrics: string;
  };
  error?: string;
};

export type LyricsRequest = {
  artist: string;
  title: string;
};
