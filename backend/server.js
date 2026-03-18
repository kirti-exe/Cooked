const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// test route
// app.get("/", (req, res) => {
//     res.send("Backend is running!");
// });

// Redirect user to Spotify login
app.get("/login", (req, res) => {
    const scope = "user-top-read user-read-recently-played";
    const authURL = "https://accounts.spotify.com/authorize?" +
        new URLSearchParams({
            response_type: "code",
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI
        });
    res.redirect(authURL);
});

// SPotify redirects back here with a code
app.get("/callback", async (req, res) => {
    const code = req.query.code;

    try{
        // exchange code for access token
        const tokenRes = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + Buffer.from(
                        process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
                    ).toString("base64")
                }
            }
        );

        const accessToken = tokenRes.data.access_token;

        // Get top artists
        const topArtists = await axios.get(
            "https://api.spotify.com/v1/me/top/artists?limit=5",,
            { headers: { "Authorization": "Bearer " + accessToken } }
        );

        // Get recently played
        const recentTracks = await axios.get(
            "https://api.spotify.com/v1/me/player/recently-played?limit=5",
            { headers: { "Authorization": "Bearer " + accessToken } }
        );

        const artists = topArtists.data.items.map(a => a.name).join(", ");
        const tracks = recentTracks.data.items.map(t => t.track.name).join(", ");
        
        // Redirects to roast page with data in query
        res.redirect('/?artists=${encodeURIComponent(artists)}&tracks=${encodeURIComponent(tracks)}');

    } catch (err) {
        console.error("FULL ERROR:");
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", JSON.stringify(err.response.data));
        } else {
            console.error(err.message);
        }
        res.send("Spotify login failed: " + err.message);
    }
});

// GEMINI ROAST ROUTE
app.get("/roast", async (req, res) => {
    try {
        const artists = req.query.artists || "unknown artists";
        const tracks = req.query.tracks || "unknown tracks";
        const spotifySummary = `
            Top artists: ${artists}
            Recently played: ${tracks}
        `;

        const prompt = `
            You are a sarcastic but funny AI.
            Roast the user based on their Spotify listening habits.
            Be humorous.

            Spotify data:
            ${spotifySummary}

            Give a short roast (5-6 lines)
        `;

        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
            {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": process.env.GEMINI_API_KEY
                }
            }
        );

        const roast = response.data.candidates[0].content.parts[0].text;
        res.json({ roast });

    } catch (error) {
        console.error("Gemini API ERROR:");
        if (error.response && error.response.data) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

        res.status(500).json({
            roast: "AI refused to roast you. Try again later."
        });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "cooked.html"));
});

app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});

//http://127.0.0.1:3000