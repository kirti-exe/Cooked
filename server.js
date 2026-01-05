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
app.get("/",(req,res) => {
    res.send("Backend is running!");
});

// // fake roast route
// app.get("/roast",(req,res) => {
//     res.json({
//         roast: "Your music taste has commitement issues."
//     });
// });

// GEMINI ROAST ROUTE
app.get("/roast", async(req, res) => {
    try{
        //fake spotify summary for now
        const spotifySummary = `
            Top artist: Taylor Swift, Drake
            Top genre: sad pop, emotional hip-hop
            Mood: late night overthinking
            Repeats the same songs daily
        `;

        const prompt = `
            Your are a sarcastic but funny AI.
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
                        parts: [{text: prompt}]
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

        res.json({roast});
    }catch (error){
        console.error("Gemini API ERROR:");
        if(error.response && error.response.data){
            console.error(error.response.data);
        }else{
            console.error(error.message);
        }

        res.status(500).json({
            roast: "AI refused to roast you. Try again later"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
