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
connectDB();

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

app.get("/", async (req, res) => {
    console.log("Inside '/' get req...");
    res.render("temp");
    // const token = req.query.token;
    // console.log(token);
    // try {
    //     const userData = jwt.verify(token, process.env.jwt_secret);
    //     console.log(userData);
    //     const user = await User.findOne({username: userData.username});
    //     const journals = user.journals;
    //     res.render("index", {journals});
    //     console.log("rendered");
    // } catch (error) {
    //     console.log(error);
    //     res.json({ status: 'error', error: error });
    // }
    
    // res.render("index", { journals: journals });
    // console.log("rendered");
    // const journals = [
    //     {
    //         heading: "Heading 1",
    //         body: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    //     },
    //     {
    //         heading: "Heading 2",
    //         body: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    //     }
    // ];
    // res.render("index", {journals});
});

app.get("/user/", async (req, res) => {
    const username = req.query.un;
    // console.log(token);
    try {
        // const userData = jwt.verify(token, process.env.jwt_secret);
        // console.log(userData);
        const user = await User.findOne({username: username});
        const journals = user.journals;
        res.render("index", {journals});
        console.log("rendered");
    } catch (error) {
        console.log(error);
        res.json({ status: 'error', error: error });
    }
});

app.post("/", async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    console.log(user);
    const journals = user.journals;
    res.render("index", { journals: journals });
    console.log("rendered");
})

app.put("/", async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    user.journals.unshift({heading: req.body.journalheading, body: req.body.journalbody});
    User.updateOne({username: user.username}, user).then(() => {
        res.status(201).json({message: "Journal added successfully."})
    }).catch((error) => {
        res.status(400).json({error: error});
    })
})

app.get("/signin/", (req, res) => {
    res.render("signin");
});

app.post("/signin/", async (req, res) => {
    const { username, password } = req.body;
    console.log("inside signin: post");
    const user = await User.findOne({ username });
    if (!user) {
        return res.send('User does not exist!');
    }

    bcrypt.compare(password, user.password, function (error, matched) {
        if (matched) {
            console.log('password matched');
            const token = jwt.sign({ id: user._id, username: user.username }, process.env.jwt_secret);
            return res.json({ status: 'ok', token: token });
        } else {
            return res.json({ status: 'error', error: error });
        }
    });
});

app.get("/signup/", (req, res) => {
    res.render("signup");
});

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

app.post("/isauthorized/", (req, res) => {
    const token = req.body.token;
    try {
        const userData = jwt.verify(token, process.env.jwt_secret);
        console.log('User Decoded: ', userData);
        res.json({ status: 'ok', username: userData.username});
    } catch (error) {
        console.log('jwt verify error');
        res.json({ status: 'error', error: "Couldn't verify user" });
    }
});