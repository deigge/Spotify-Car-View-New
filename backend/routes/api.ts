import { Router } from 'express';
import mongoose from 'mongoose';
import PlayedSong from '../models/PlayedSong.js';

import type { SpotifyPlayer } from '../../shared/types/spotify';
import { getUser } from './auth.js';

const router = Router();

// --- API ROUTES ---
router.get('/ping', async (req, res) => {
  await mongoose.connection.db.admin().ping();
  res.json({ mongo: 'ok' });
});

router.get('/test', (req, res) => {
  res.json({ ok: true });
});

router.post('/addsong', getUser, async (req, res) => {
  const trackInfo = req.body as SpotifyPlayer;
  console.log('images:', trackInfo.item.album.images);

  const song = new PlayedSong({
    userId: req.user.spotifyId,
    trackId: trackInfo.item.id,
    name: trackInfo.item.name,
    artists: trackInfo.item.artists.map((a) => a.name),
    albumName: trackInfo.item.album.name,
    albumCovers: trackInfo.item.album.images,
    spotifyUrl: trackInfo.item.external_urls.spotify,
    spotifyUri: trackInfo.item.uri,
    isSaved: trackInfo.isSaved,
  });

  await song.save();
  res.sendStatus(200);
});

router.patch('/updatesong/:trackId', getUser, async (req, res) => {
  await PlayedSong.findOneAndUpdate(
    { userId: req.user.spotifyId, trackId: req.params.trackId },
    { $set: req.body }
  );
  res.sendStatus(200);
});

router.get('/history', getUser, async (req, res) => {
  const songs = await PlayedSong.find({ userId: req.user.spotifyId })
    .sort({ playedAt: -1 })
    .limit(200)
    .lean();

  const result = songs.map((song) => ({
    ...song,
    albumCovers: song.albumCovers?.length ? [song.albumCovers.at(-1)!] : [],
  }));

  res.json(result);
});

export default router;
