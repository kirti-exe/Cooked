// import express
const express = require("express");
const cors = require("cors");
const path = require("path");

// create app
const app = express();

// port number
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// // test route
// app.get("/",(req,res) => {
//     res.send("Backend is running!");
// });

// roast route(fake for now)
app.get("/roast",(req,res) => {
    res.json({
        roast: "Your music taste has commitement issues."
    });
});

// start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
