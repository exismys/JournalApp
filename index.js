const express = require("express");
const path = require("path");
const connectDB = require("./db-connection");
const app = express();

// Making database connection
// require("dotenv").config();
// connectDB();

// Setting up middlewares
app.use(express.static(path.join(__dirname, "/public")));

// Setting up view engine
app.set("view engine", "ejs")

// Making server listen to request on the given port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}`);
});

app.get("/", (req, res) => {
    const journals = [
        {
            heading: "Heading 1",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        },
        {
            heading: "Heading 2",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. "
        },
        {
            heading: "Heading 3",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
        },
        {
            heading: "Heading 4",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
        },
        {
            heading: "Heading 5",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        },
        {
            heading: "Heading 6",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
        },
        {
            heading: "Heading 7",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
        },
        {
            heading: "Heading 8",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        },
        {
            heading: "Heading 9",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
        },
        {
            heading: "Heading 10",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
        },
        {
            heading: "Heading 11",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
        },
        {
            heading: "Heading 12",
            body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
        }
    ]

    res.render("index", {journals: journals});
})