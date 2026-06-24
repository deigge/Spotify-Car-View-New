import mongoose from 'mongoose';
import type { PlayedSong } from '../../shared/types/playedSong';

const playedSongSchema = new mongoose.Schema<PlayedSong>({
  userId: { type: String, required: true },
  trackId: { type: String, required: true },
  name: { type: String, required: true },
  artists: [String],
  albumName: { type: String },
  albumCovers: [{ url: String, height: Number, width: Number }],
  spotifyUrl: { type: String },
  spotifyUri: { type: String },
  isSaved: { type: Boolean, default: false },
  playedAt: { type: Date, default: Date.now },
});

export default mongoose.model('PlayedSong', playedSongSchema);
