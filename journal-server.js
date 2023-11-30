const express = require("express");
const connectDB = require("./db-connection");
const app = express();
const User = require("./models/user");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Make database connection
require("dotenv").config();
try {
  connectDB();
} catch (error) {
  console.log("Connection error");
}

// Set middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Making server listen to request on the given port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});

app.get("/user/", async (req, res) => {
  console.log("GET: /user/");
  const username = req.query.un;
  try {
    const user = await User.findOne({ username: username });
    const journals = user.journals;
    res.json({ journals: journals, username: username });
  } catch (error) {
    res.json({ status: "error", error: error });
  }
});

// Route to add new journal to database
app.put("/", async (req, res) => {
  console.log("PUT: /");
  const user = await User.findOne({ username: req.body.username });
  user.journals.unshift({
    heading: req.body.journalheading,
    body: req.body.journalbody,
  });
  User.updateOne({ username: user.username }, user)
    .then(() => {
      console.log("User data updated.");
      res.status(201).json({ message: "Journal added successfully." });
    })
    .catch((error) => {
      console.error("Error in updating data.");
      res.status(400).json({ error: error });
    });
});

app.delete("/", async (req, res) => {
    console.log("DELETE: /");
    const user = await User.findOne({ username: req.body.username });
    const journalId = req.body.journalId;
    for (let i = 0; i < user.journals.length; i++) {
        if (user.journals[i].id == journalId) {
            user.journals.splice(i, 1);
            break;
        }
        User.updateOne({ username: user.username }, user).then(() => {
            console.log("Journal deleted.");
            res.status(200).json({ message: "Journal deleted successfully." });
        }).catch((error) => {
            console.log("Error in deleting journal.");
            res.status(400).json({ error: "Could not delete the journal" });
        });
    }
});

app.post("/signin/", async (req, res) => {
  console.log("Signing in...");
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    console.log("User not found.");
    return res.json({ status: "error", error: "Invalid username/password" });
  }
  console.log("User found.");
  bcrypt.compare(password, user.password, function (error, matched) {
    if (matched) {
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.jwt_secret
      );
      console.log("Signed in.");
      return res.json({ status: "ok", token: token });
    } else {
      console.log("Password did not match.");
      return res.json({ status: "error", error: error });
    }
  });
});

app.post(
  "/signup/",
  [
    check("name")
      .isLength({ min: 5 })
      .withMessage("First name can not be less than 5 characters"),
    check("email").isEmail().withMessage("Email should be valid"),
    check("dob").isDate().withMessage("DOB should be a valid date"),
    check("username")
      .isAlphanumeric()
      .withMessage("Domain name should be valid"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password can not be less than 5 characters"),
    check("repassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  async (req, res) => {
    console.log("POST: /signup/");
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
      try {
        const user = new User(req.body);
        await user.save();
        return res.json({ status: "ok" });
      } catch {
        return res.json({ status: "error", error: "some error occured!" });
      }
    } else {
      return res.status(400).json({ errors: errors.array() });
    }
  }
);

app.post("/isauthorized/", (req, res) => {
  console.log("POST: /isauthorized/");
  console.log("Checking authorization...");
  const token = req.body.token;
  try {
    const userData = jwt.verify(token, process.env.jwt_secret);
    res.json({ status: "ok", username: userData.username });
    console.log("Authorized.");
  } catch (error) {
    res.json({ status: "error", error: error });
  }
});
