const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const mysql = require("mysql2");
const { error } = require("console");
const methodOverride = require("method-override");
const session = require("express-session");
const { userInfo } = require("os");

app.use(methodOverride("_method"));
app.use(express.static("public"));
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
  host: "localhost",
  user: "root",
  database: "record",
  password: "1276#Avtc",
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.post("/user", (req, res) => {
  var uniq = "id" + new Date().getTime();
  const { name, rollNumber, room, email, password, hall, passingYear } =
    req.body;
  // console.log(req.body);
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
      // I have first redirected this page to other url to avoid the repetition of post request with the same data again and again
      // /success performs the get request hence refreshing it wont cause any post request
      // Store sensitive information in the session
      req.session.data = { values };

      // Redirect to the success page
      res.redirect("/success");
    });
  } catch (err) {
    res.status(404).json({ Success: false });
    res.end();
  }
});
app.get("/success", (req, res) => {
  // Render a success page or perform other actions
  const data = req.session.data || null;
  console.log(data);
  res.render("userdata", { data });
  req.session.data = null;
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const q = "SELECT * FROM studentinfo WHERE email = ? AND password = ?";
  const values = [email, password];
  try {
    connection.query(q, values, (err, result) => {
      if (err) throw err;
      // Check if the result has any rows
      // console.log(result[0].name);
      const data = result[0];
      if (result.length > 0) {
        // Data match found
        // You can render a template or send a response accordingly
        res.render("logindata", { data });
      } else {
        // No match found
        // You might want to handle this case differently
        res.render("loginFailed"); // For example, render a page indicating login failure
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Success: false, error: err.message });
  }
});

// Add this route to your Express app

app.get("/edit", (req, res) => {
  const id = req.query.userid; // Get the roll number from the query parameter
  // Fetch the user data based on the roll number from your database
  // Replace this with your database logic to fetch user data
  // console.log(id);
  const q = `select * from studentinfo where token='${id}'`;
  // Mock user data for demonstration purposes
  connection.query(q, (err, result) => {
    try {
      if (err) throw err;
      // console.log(user[0]);
      const user = result[0];
      // console.log(user);
      res.render("edit", { user });
    } catch (err) {
      res.send.json({ Success: false, Message: "Please try again" });
    }
  });
});

app.post("/update", (req, res) => {
  const data = req.body;
  console.log(data);

  const q = `update studentinfo set name=?, roll_no=?, room_no=?, email=?, hall_name=?, PY=? where token='${data.token}'`;
  const values = [
    data.name,
    data.roll_no.toUpperCase(),
    data.room_no.toUpperCase(),
    data.email,
    data.hall_name.toUpperCase(),
    data.PY,
  ];
  connection.query(q, values, (err, result) => {
    res.render("logindata", { data });
  });
});

app.get("/:roll_no", (req, res) => {
  const { roll_no } = req.params;
  console.log(roll_no.toUpperCase());
  let q = `select * from studentinfo where roll_no='${roll_no}'`;
  connection.query(q, (err, result) => {
    try {
      if (err) throw err;
      console.log(result[0]);
      const info = result[0];
      res.render("userInfo", { info });
    } catch (err) {
      res.status(404).json({ Success: false });
    }
  });
});

app.post("/newinfo", (req, res) => {
  res.send("vaibhav");
});

app.get("/forgot-password", (req, res) => {
  res.render("forgot-password"); // Assuming you have a corresponding EJS file
});

app.post("/reset-password", (req, res) => {
  // Handle password reset logic here
  const userId = req.body["user-id"];
  // const id = req.body["user-id"];
  const email = req.body.email;
  // Implement logic to send password reset instructions, update database, etc.
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
  // res.send("Password reset logic to be implemented.");
});
app.get("/reset-password", (req, res) => {
  const { userId } = req.query;
  console.log(userId);
  // res.send("ily");
  res.render("new-password", { userId });
});

app.get("/done/:userId", (req, res) => {
  console.log(req.query["new-password"]);
  console.log(req.query["confirm-password"]);
  const newPass = req.query["new-password"];
  const conPass = req.query["confirm-password"];
  const { userId } = req.params;
  // const userId = req.query["confirm-password"];
  // res.send("done", { newPass, conPass });
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

app.listen(5000, (req, res) => {
  console.log("server is listening on port 5000");
});

// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const app = express();
// const mysql = require("mysql2/promise");
// const methodOverride = require("method-override");
// const session = require("express-session");

// app.use(methodOverride("_method"));
// app.use(express.static("public"));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//   session({
//     secret: "1276#Avtc",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   database: "record",
//   password: "1276#Avtc",
// });

// app.get("/", (req, res) => {
//   res.render("home.ejs");
// });

// app.get("/login", (req, res) => {
//   res.render("login.ejs");
// });

// app.get("/signup", (req, res) => {
//   res.render("signup.ejs");
// });

// app.post("/user", async (req, res) => {
//   try {
//     const uniq = "id" + new Date().getTime();
//     const { name, rollNumber, room, email, password, hall, passingYear } =
//       req.body;

//     const q = `INSERT INTO studentinfo (name, roll_no, room_no, email, password, token, hall_name, PY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
//     const values = [
//       name,
//       rollNumber.toUpperCase(),
//       room.toUpperCase(),
//       email,
//       password,
//       uniq,
//       hall.toUpperCase(),
//       passingYear,
//     ];

//     await connection.query(q, values);
//     req.session.data = { values };

//     res.redirect("/success");
//   } catch (error) {
//     console.error("Error in /user route:", error.message);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// app.get("/success", (req, res) => {
//   const data = req.session.data || null;
//   console.log(data);
//   res.render("userdata", { data });
//   req.session.data = null;
// });

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const q = "SELECT * FROM studentinfo WHERE email = ? AND password = ?";
//     const values = [email, password];

//     const result = await connection.execute(q, values);
//     const data = result[0];

//     if (result.length > 0) {
//       res.render("logindata", { data });
//     } else {
//       res.render("loginFailed");
//     }
//   } catch (error) {
//     console.error("Error in /login route:", error.message);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// app.post("/reset-password", (req, res) => {
//   // Handle password reset logic here
//   const userId = req.body["user-id"];
//   // const id = req.body["user-id"];
//   const email = req.body.email;
//   // Implement logic to send password reset instructions, update database, etc.
//   console.log(req.body);
//   let q = `select * from studentinfo where token='${userId}' and email='${email}'`;
//   connection.query(q, (err, result) => {
//     try {
//       if (err) throw err;
//       console.log("successful");
//       res.redirect(`/reset-password?userId=${encodeURIComponent(userId)}`);
//     } catch (err) {
//       console.log(err);
//       res.send(err);
//     }
//   });
//   // res.send("Password reset logic to be implemented.");
// });

// app.get("/reset-password", (req, res) => {
//   const { userId } = req.query;
//   console.log(userId);
//   res.render("new-password", { userId });
// });

// app.get("/done/:userId", (req, res) => {
//   const newPass = req.query["new-password"];
//   const conPass = req.query["confirm-password"];
//   const { userId } = req.params;

//   if (newPass === conPass) {
//     const q = `UPDATE studentinfo SET password = '${conPass}' WHERE token='${userId}';`;

//     connection.query(q, (err) => {
//       if (err) {
//         console.error("Error in /done route:", err.message);
//         res.send("Please try again");
//       } else {
//         //   const script = `
//         //   <script>
//         //     alert("Password has been changed successfully!");
//         //     window.location.href = "/login"; // Redirect to login page
//         //   </script>
//         // `;
//         //   res.send(script);
//         res.render("alert");
//       }
//     });
//   } else {
//     res.send("password didn't match");
//   }
// });

// app.listen(5000, () => {
//   console.log("Server is listening on port 5000");
// });

// This is other code

// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const session = require("express-session");
// const methodOverride = require("method-override");
// const app = express();
// const dbPath = path.join(__dirname, "models", "db");
// console.log(dbPath);
// const connection = require(dbPath); // Adjust the path accordingly

// const indexRoutes = require("./routes/index");

// app.use(methodOverride("_method"));
// app.use(express.static("public"));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//   session({
//     secret: "1276#Avtc",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/views"));

// app.use("/", indexRoutes);

// app.get("/", (req, res) => {
//   res.render("home.ejs");
// });

// app.listen(5000, () => {
//   console.log("server is listening on port 5000");
// });
