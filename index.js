const express = require("express");
const path = require("path");
const connectDB = require("./db-connection");
const app = express();
const User = require("./models/user");
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Making database connection
require("dotenv").config();
try {
    connectDB();
} catch (error) {
    console.log("Connection error");
}



// Setting up middlewares
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setting up view engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// Making server listen to request on the given port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}`);
});

// Route to check authorization and redirection
app.get("/", async (req, res) => {
    console.log("GET: /");
    console.log("Redirecting...");
    res.render("temp");
});

// Home page: Fetches data from the database and renders main page with those data
app.get("/user/", async (req, res) => {
    console.log("GET: /user/");
    const username = req.query.un;
    try {
        const user = await User.findOne({username: username});
        const journals = user.journals;
        res.render("index", {journals, username});
    } catch (error) {
        res.json({ status: 'error', error: error });
    }
});

// Route to add new journal to database
app.put("/", async (req, res) => {
    console.log("PUT: /");
    const user = await User.findOne({username: req.body.username});
    user.journals.unshift({heading: req.body.journalheading, body: req.body.journalbody});
    User.updateOne({username: user.username}, user).then(() => {
        console.log("User data updated.");
        res.status(201).json({message: "Journal added successfully."})
    }).catch((error) => {
        console.log("Error in updating data.");
        res.status(400).json({error: error});
    })
})

// To render signin page
app.get("/signin/", (req, res) => {
    console.log("GET: /signin/");
    res.render("signin");
});

// To get form data from the signin page and provide authorization
app.post("/signin/", async (req, res) => {
    console.log("Signing in...");
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        console.log("User not found.");
        return res.send('User does not exist!');
    }
    console.log("User found.");

    bcrypt.compare(password, user.password, function (error, matched) {
        if (matched) {
            console.log('Password matched.');
            const token = jwt.sign({ id: user._id, username: user.username }, process.env.jwt_secret);
            console.log("Signed in.")
            return res.json({ status: 'ok', token: token });
        } else {
            console.log("Password did not match.");
            return res.json({ status: 'error', error: error });
        }
    });
});

// To render signup page
app.get("/signup/", (req, res) => {
    console.log("GET: /signup/");
    res.render("signup");
});

// To get form data from signup page to perform validation and creat new users
app.post("/signup/", [
    check("name").isLength({ min: 5 }).withMessage("First name can not be less than 5 characters"),
    check("email").isEmail().withMessage("Email should be valid"),
    check("dob").isDate().withMessage("DOB should be a valid date"),
    check("username").isAlphanumeric().withMessage("Domain name should be valid"),
    check("password").isLength({ min: 5 }).withMessage("Password can not be less than 5 characters"),
    check("repassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    })
], async (req, res) => {
    console.log("POST: /signup/")
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        try {
            const user = new User(req.body);
            await user.save();
            return res.redirect("/signin/");
        } catch {
            return res.send("Something went wrong");
        }
    } else {
        return res.status(400).json({ errors: errors.array() });
    }
});

// To check if a user is authorized
app.post("/isauthorized/", (req, res) => {
    console.log("POST: /isauthorized/");
    console.log("Checking authorization...")
    const token = req.body.token;
    try {
        const userData = jwt.verify(token, process.env.jwt_secret);
        res.json({ status: 'ok', username: userData.username});
        console.log("Authorized.");
    } catch (error) {
        res.json({ status: 'error', error: error });
    }
});