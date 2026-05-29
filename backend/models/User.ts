import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  refreshToken: { type: String, required: true },
  sessions: [{ sessionId: String }]
});

export default mongoose.model('User', userSchema);