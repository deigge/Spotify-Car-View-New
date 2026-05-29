import User from '../models/User.js';
import crypto from 'crypto';
import { Router } from 'express';
import { encrypt, decrypt } from '../utils/crypto.js';

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
      client_id: s_client_id!,
      scope: scope,
      redirect_uri: s_redirect_uri!,
      state: state
    }).toString());
});


router.get('/callback', async (req, res) => {
    const code = req.query.code as string
    const error = req.query.error as string
    const state = req.query.state as string
    const storedState = req.cookies.spotify_state

    if (!state || state !== storedState) {
        return res.redirect(app_url + "/login" + '?error=state_mismatch')
    }

    res.clearCookie('spotify_state')

    // Nutzer hat abgelehnt
    if (error) {
        return res.redirect(app_url + "/login"  + '?error=' + error)
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
            refreshToken: encrypt(refreshToken),
            $push: { sessions: { sessionId } }
        },
        { upsert: true } // erstellt neuen User wenn er nicht existiert
    );

    res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.redirect(app_url!);
})

router.get('/token', async (req, res) => {
    const sessionId = req.cookies.sessionId
    if (!sessionId) return res.status(401).json({ error: 'nicht eingeloggt' })

    // User anhand Session finden
    const user = await User.findOne({ 'sessions.sessionId': sessionId })
    if (!user) return res.status(401).json({ error: 'Session ungültig' })

    // Neuen Access Token von Spotify holen
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
            s_client_id + ':' + s_client_secret
        ).toString('base64')
        },
        body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: decrypt(user.refreshToken)
        })
    });

    const data = await response.json();

    if (data.error) {
    // Refresh Token ungültig → Session löschen
    await User.updateOne(
        { 'sessions.sessionId': sessionId },
        { $pull: { sessions: { sessionId } } }
    )
    return res.status(401).json({ error: 'Token ungültig' })
    }

    if (data.refresh_token) {
        await User.updateOne(
            { 'sessions.sessionId': sessionId },
            { refreshToken: encrypt(data.refresh_token) }
        )
    }

    res.json({ 
        accessToken: data.access_token,
        expiresIn: data.expires_in 
    });
})

export default router;