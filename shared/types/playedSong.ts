export type PlayedSong = {
  _id?: string;
  userId: string;
  trackId: string;
  name: string;
  artists: string[];
  albumName: string;
  albumCovers: { url: string; height: number; width: number }[];
  spotifyUrl: string;
  playedAt: string;
};
