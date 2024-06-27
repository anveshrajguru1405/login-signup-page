const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const mysql = require("mysql2");
const methodOverride = require("method-override");
const session = require("cookie-session");
const dotenv = require("dotenv").config();

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "1276#Avtc",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: process.env.LOCALHOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
});

// Middleware to check if the user is authenticated
function authenticateUser(req, res, next) {
  // Check if the user is logged in (modify this according to your session setup)
  if (req.session && req.session.data) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to login or handle as appropriate
    res.redirect("/login");
  }
}

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  console.log("hey1");
  return res.render("login.ejs");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.post("/user", (req, res) => {
  var uniq = "id" + new Date().getTime();
  const { name, rollNumber, room, email, password, hall, passingYear } =
    req.body;

  const q = `INSERT INTO studentinfo (name, roll_no, room_no, email, password, token, hall_name, PY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    name,
    rollNumber.toUpperCase(),
    room.toUpperCase(),
    email,
    password,
    uniq,
    hall.toUpperCase(),
    passingYear,
  ];

  try {
    connection.query(q, values, (err, result) => {
      if (err) throw err;
      // Store user data in the session
      req.session.data = { values };
      res.redirect("/success");
    });
  } catch (err) {
    res.status(404).json({ Success: false });
    res.end();
  }
});

app.get("/success", authenticateUser, (req, res) => {
  const data = req.session.data || null;
  res.render("userdata", { data });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const q = "SELECT * FROM studentinfo WHERE email = ? AND password = ?";
  const values = [email, password];
  try {
    connection.query(q, values, (err, result) => {
      if (err) throw err;
      const data = result[0];
      console.log(data);
      if (result.length > 0) {
        // Store user data in the session
        // console.log(req.session.data);
        req.session.data = { data };
        // console.log(req.session.data.data);
        res.render("logindata", { data });
      } else {
        res.render("loginFailed");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Success: false, error: err.message });
  }
});

app.get("/newinfo", authenticateUser, (req, res) => {
  const id = req.query.userid; // Get the roll number from the query parameter
  const q = `select * from studentinfo where token='${id}'`;
  connection.query(q, (err, result) => {
    try {
      if (err) throw err;
      console.log(result);
      const user = result[0];
      console.log(JSON.stringify(user));
      res.render("newinfo", { user });
    } catch (err) {
      console.log(err);
      res.status(400).json({ Success: false });
    }
  });
});

app.post("/saveinfo", authenticateUser, (req, res) => {
  console.log(req.body);
  const bio = req.body.bio;
  const userData = req.body.user || "{}";
  try {
    const data = JSON.parse(req.body.user);
    console.log(data);
    const q = `update studentinfo set bio='${bio}' where token='${data.token}'`;
    connection.query(q, (err, result) => {
      try {
        if (err) throw err;
        data.bio = bio;
        console.log("new data", data);
        res.render("logindata", { data });
      } catch (err) {
        console.log(err);
        res.status(400).json({ Success: false });
      }
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
    res.status(400).json({ Success: false, error: "Invalid JSON input" });
  }
});

app.get("/edit", authenticateUser, (req, res) => {
  const id = req.query.userid; // Get the roll number from the query parameter
  const q = `select * from studentinfo where token='${id}'`;
  connection.query(q, (err, result) => {
    try {
      if (err) throw err;
      const user = result[0];
      res.render("edit", { user });
    } catch (err) {
      res.send.json({ Success: false, Message: "Please try again" });
    }
  });
});

app.post("/update", authenticateUser, (req, res) => {
  const data = req.body;
  console.log("this is data", data);
  const q = `update studentinfo set name=?, roll_no=?, room_no=?, email=?, hall_name=?, PY=?, bio=? where token='${data.token}'`;
  const values = [
    data.name,
    data.roll_no.toUpperCase(),
    data.room_no.toUpperCase(),
    data.email,
    data.hall_name.toUpperCase(),
    data.PY,
    data.bio,
  ];
  connection.query(q, values, (err, result) => {
    res.render("logindata", { data });
  });
});

app.get("/forgot-password", (req, res) => {
  res.render("forgot-password");
});

app.post("/reset-password", (req, res) => {
  const userId = req.body["user-id"];
  const email = req.body.email;
  console.log(req.body);
  let q = `select * from studentinfo where token='${userId}' and email='${email}'`;
  connection.query(q, (err, result) => {
    try {
      if (err) throw err;
      console.log("successful");
      res.redirect(`/reset-password?userId=${encodeURIComponent(userId)}`);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });
});

app.get("/reset-password", (req, res) => {
  const { userId } = req.query;
  console.log(userId);
  res.render("new-password", { userId });
});

app.get("/done/:userId", (req, res) => {
  console.log(req.query["new-password"]);
  console.log(req.query["confirm-password"]);
  const newPass = req.query["new-password"];
  const conPass = req.query["confirm-password"];
  const { userId } = req.params;
  console.log(userId);
  if (newPass === conPass) {
    let q = `UPDATE studentinfo
    SET password = '${conPass}'
    WHERE token='${userId}';`;
    connection.query(q, (err, result) => {
      try {
        if (err) throw err;
        res.send("successful ");
      } catch (err) {
        res.send("Please try again");
      }
    });
  } else {
    res.send("password didn't match");
  }
});

app.get("/logout", (req, res) => {
  console.log(req.session);
  // Check if req.session exists
  if (req.session) {
    // Clear the session to log the user out
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err.message);
      }
      // Redirect to another URL after logout to avoid form resubmission
      res.redirect("/logout-success");
    });
  } else {
    // Redirect to the home page or login page if session does not exist
    console.log("okay");
    res.redirect("/");
  }
});

app.get("/logout-success", (req, res) => {
  res.render("logout-success");
});

app.get("/:roll_no", (req, res) => {
  console.log(req.params);
  const { roll_no } = req.params;
  console.log(roll_no.toUpperCase());
  let q = `select * from studentinfo where roll_no='${roll_no}'`;
  connection.query(q, (err, result) => {
    try {
      if (err) throw err;
      console.log(result[0]);
      const info = result[0];
      if (info) {
        res.render("userInfo", { info });
      } else {
        res.send("Doesn't found");
      }
    } catch (err) {
      res.status(404).json({ Success: false });
    }
  });
});

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});
