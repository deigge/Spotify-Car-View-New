import User from '../models/User.js'
import crypto from 'crypto';
import { Router } from 'express';

const router = Router();

const s_client_id = process.env.SPOTIFY_CLIENT_ID;
const s_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const s_redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const app_url = process.env.APP_URL;


router.get('/login', function(req, res) {

  var state = crypto.randomUUID()
  var scope = 'user-read-playback-state user-read-private user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative user-read-playback-position';

  res.cookie('spotify_state', state, { httpOnly: true });

  res.redirect('https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: s_client_id,
      scope: scope,
      redirect_uri: s_redirect_uri,
      state: state
    }).toString());
});


router.get('/callback', async (req, res) => {
    const code = req.query.code as string
    const error = req.query.error as string
    const state = req.query.state as string
    const storedState = req.cookies.spotify_state

    if (!state || state !== storedState) {
        return res.redirect(app_url + '?error=state_mismatch')
    }

    res.clearCookie('spotify_state')

    // Nutzer hat abgelehnt
    if (error) {
        return res.redirect(app_url + '?error=' + error)
    }

    // Token von Spotify holen
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
            s_client_id + ':' + s_client_secret
        ).toString('base64')
        },
        body: new URLSearchParams({
        code,
        redirect_uri: s_redirect_uri!,
        grant_type: 'authorization_code'
        })
    });

    const data = await response.json();
    console.log(data)

    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    const profileRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    const profile = await profileRes.json()
    const spotifyId = profile.id;
    console.log(profile)
    console.log(spotifyId)

    const sessionId = crypto.randomUUID();

    // User in MongoDB speichern oder updaten
    await User.findOneAndUpdate(
        { spotifyId },
        {
            refreshToken,
            $push: { sessions: { sessionId } }
        },
        { upsert: true } // erstellt neuen User wenn er nicht existiert
    );

    res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.redirect(app_url);
})

export default router;