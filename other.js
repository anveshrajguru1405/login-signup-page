// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const app = express();
// const mysql = require("mysql2");
// const { error } = require("console");
// const methodOverride = require("method-override");
// const session = require("express-session");
// const { userInfo } = require("os");

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

// app.post("/user", (req, res) => {
//   var uniq = "id" + new Date().getTime();
//   const { name, rollNumber, room, email, password, hall, passingYear } =
//     req.body;
//   // console.log(req.body);
//   const q = `INSERT INTO studentinfo (name, roll_no, room_no, email, password, token, hall_name, PY) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
//   const values = [
//     name,
//     rollNumber.toUpperCase(),
//     room.toUpperCase(),
//     email,
//     password,
//     uniq,
//     hall.toUpperCase(),
//     passingYear,
//   ];

//   try {
//     connection.query(q, values, (err, result) => {
//       if (err) throw err;
//       // I have first redirected this page to other url to avoid the repetition of post request with the same data again and again
//       // /success performs the get request hence refreshing it wont cause any post request
//       // Store sensitive information in the session
//       req.session.data = { values };

//       // Redirect to the success page
//       res.redirect("/success");
//     });
//   } catch (err) {
//     res.status(404).json({ Success: false });
//     res.end();
//   }
// });
// app.get("/success", (req, res) => {
//   // Render a success page or perform other actions
//   const data = req.session.data || null;
//   res.setHeader(
//     "Cache-Control",
//     "no-store, no-cache, must-revalidate, private"
//   );
//   console.log(data);
//   res.render("userdata", { data });
//   req.session.data = null;
// });

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   const q = "SELECT * FROM studentinfo WHERE email = ? AND password = ?";
//   const values = [email, password];
//   try {
//     connection.query(q, values, (err, result) => {
//       if (err) throw err;
//       // Check if the result has any rows
//       // console.log(result[0].name);
//       const data = result[0];
//       if (result.length > 0) {
//         // Data match found
//         // You can render a template or send a response accordingly
//         res.setHeader(
//           "Cache-Control",
//           "no-store, no-cache, must-revalidate, private"
//         );
//         res.render("logindata", { data });
//       } else {
//         // No match found
//         // You might want to handle this case differently
//         res.render("loginFailed"); // For example, render a page indicating login failure
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ Success: false, error: err.message });
//   }
// });

// app.get("/newinfo", (req, res) => {
//   const id = req.query.userid; // Get the roll number from the query parameter
//   // console.log(id.userid);
//   const q = `select * from studentinfo where token='${id}'`;
//   connection.query(q, (err, result) => {
//     try {
//       if (err) throw err;
//       console.log(result);
//       const user = result[0];
//       res.render("newinfo", { user });
//     } catch (err) {
//       console.log(err);
//       res.status(400).json({ Success: false });
//     }
//   });
// });

// app.post("/saveinfo", (req, res) => {
//   const data = JSON.parse(req.body.user);
//   console.log(data);
//   // Add your logic to save the additional information to the database
//   // For example, you can perform an UPDATE query based on the user's token
//   const q = `update studentinfo set bio='${data.bio}' where token='${data.token}'`;
//   connection.query(q, (err, result) => {
//     try {
//       if (err) throw err;
//       res.render("logindata", { data });
//       // res.send("dones");
//     } catch (err) {
//       console.log(err);
//       res.status(400).json({ Success: false });
//     }
//   });
//   // Mock response for demonstration purposes
// });
// app.get("/edit", (req, res) => {
//   const id = req.query.userid; // Get the roll number from the query parameter
//   // Fetch the user data based on the roll number from your database
//   // Replace this with your database logic to fetch user data
//   // console.log(id);
//   const q = `select * from studentinfo where token='${id}'`;
//   // Mock user data for demonstration purposes
//   connection.query(q, (err, result) => {
//     try {
//       if (err) throw err;
//       // console.log(user[0]);
//       const user = result[0];
//       // console.log(user);
//       res.render("edit", { user });
//     } catch (err) {
//       res.send.json({ Success: false, Message: "Please try again" });
//     }
//   });
// });
// app.post("/update", (req, res) => {
//   const data = req.body;
//   console.log(data);

//   const q = `update studentinfo set name=?, roll_no=?, room_no=?, email=?, hall_name=?, PY=?, bio=? where token='${data.token}'`;
//   const values = [
//     data.name,
//     data.roll_no.toUpperCase(),
//     data.room_no.toUpperCase(),
//     data.email,
//     data.hall_name.toUpperCase(),
//     data.PY,
//     data.bio,
//   ];
//   connection.query(q, values, (err, result) => {
//     res.render("logindata", { data });
//   });
// });

// app.get("/forgot-password", (req, res) => {
//   res.render("forgot-password");
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
//   // res.send("ily");
//   res.render("new-password", { userId });
// });

// app.get("/done/:userId", (req, res) => {
//   console.log(req.query["new-password"]);
//   console.log(req.query["confirm-password"]);
//   const newPass = req.query["new-password"];
//   const conPass = req.query["confirm-password"];
//   const { userId } = req.params;
//   // const userId = req.query["confirm-password"];
//   // res.send("done", { newPass, conPass });
//   console.log(userId);
//   if (newPass === conPass) {
//     let q = `UPDATE studentinfo
//     SET password = '${conPass}'
//     WHERE token='${userId}';`;
//     connection.query(q, (err, result) => {
//       try {
//         if (err) throw err;
//         res.send("successful ");
//       } catch (err) {
//         res.send("Please try again");
//       }
//     });
//   } else {
//     res.send("password didn't match");
//   }
// });

// app.get("/:roll_no", (req, res) => {
//   const { roll_no } = req.params;
//   console.log(roll_no.toUpperCase());
//   let q = `select * from studentinfo where roll_no='${roll_no}'`;
//   connection.query(q, (err, result) => {
//     try {
//       if (err) throw err;
//       console.log(result[0]);
//       const info = result[0];
//       res.render("userInfo", { info });
//     } catch (err) {
//       res.status(404).json({ Success: false });
//     }
//   });
// });

// app.get("/logout", (req, res) => {
//   // Check if req.session exists and has a data property
//   if (req.session && req.session.data) {
//     // Clear the session to log the user out
//     req.session.destroy((err) => {
//       if (err) {
//         console.error("Error destroying session:", err.message);
//       }
//       // Set session data to null to clear any user-related data
//       req.session.data = null;
//       // Redirect to the home page or login page after logout
//       res.redirect("/");
//     });
//   } else {
//     // Redirect to the home page or login page if session or session.data does not exist
//     res.redirect("/");
//   }
// });

// app.listen(5000, (req, res) => {
//   console.log("server is listening on port 5000");
// });

// another code

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const mysql = require("mysql2");
const methodOverride = require("method-override");
const session = require("express-session");

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
      req.session.data = { values };
      res.redirect("/success");
    });
  } catch (err) {
    res.status(404).json({ Success: false });
    res.end();
  }
});

app.get("/success", (req, res) => {
  const data = req.session.data || null;
  res.render("userdata", { data });
  // req.session.data = null; // Don't nullify session data here
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
        req.session.data = { data }; // Store user data in session
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
app.get("/newinfo", (req, res) => {
  const id = req.query.userid; // Get the roll number from the query parameter
  // console.log(id.userid);
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
  // console.log("this works completely fine");
});

app.post("/saveinfo", (req, res) => {
  // console.log("body:", req.body);
  // console.log("User data:", req.body.user);
  console.log(req.body);
  const bio = req.body.bio;
  const userData = req.body.user || "{}";
  // console.log(data);
  try {
    const data = JSON.parse(req.body.user);
    console.log(data);
    // Rest of your code...
    // Add your logic to save the additional information to the database
    // For example, you can perform an UPDATE query based on the user's token
    const q = `update studentinfo set bio='${bio}' where token='${data.token}'`;
    connection.query(q, (err, result) => {
      try {
        if (err) throw err;
        data.bio = bio;
        console.log("new data", data);
        res.render("logindata", { data });
        // res.send("dones");
      } catch (err) {
        console.log(err);
        res.status(400).json({ Success: false });
      }
    });
  } catch (error) {
    console.error("Error parsing JSON:", error);
    res.status(400).json({ Success: false, error: "Invalid JSON input" });
  }
  // Mock response for demonstration purposes
});
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

app.get("/logout", (req, res) => {
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
  res.render("logout-success"); // Render an appropriate EJS file or message
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

app.listen(5000, () => {
  console.log("server is listening on port 5000");
});
