const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const db = require("./db");
const connectEnsureLogin = require("connect-ensure-login"); //authorization
const nodemailer = require("nodemailer");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  cors({
    // allow requests from localhost:3000
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser("mySecretKey"));

app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

// app.use(function(req,res,next){
//     res.locals.currentUser = req.user;
//     next();
//   })

//routes
app.get("/", (req, res) => {
  res.send(req.user);
});

app.get("/getUserInfo", (req, res) => {
  const email = req.query.userEmail;
  const query =
    "SELECT role, organization, username FROM account WHERE email = ?";
  db.query(query, [email], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length === 0) {
      res.send({ message: "This user doesn't exist" });
    }
    if (result.length > 0) {
      res.send({ message: result });
    }
  });
});

app.post("/sendInviteEmail", (req, res) => {
  // toEmail: addEmail,
  // toName: addUsername,
  // role: selected.title,
  // labName: labName
  const toEmail = req.body.toEmail;
  const toName = req.body.toName;
  const role = req.body.role;
  const labName = req.body.labName;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "7594hsj@gmail.com",
      pass: "rcznrghrxaurroac",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  let mailOptions = {
    from: "7594hsj@gmail.com",
    to: toEmail,
    subject: "You have been invited to join LEAP",
    text: `Hello ${toName},

You have been invited to join LEAP for sonography training, offered as part of the ${labName}.
  
Please sign up using the following link (https://csecho.ca/) and ensure that information you provide matches with the following:

email: ${toEmail}
name: ${toName}
role: ${role}
organization: ${labName}

Best wishes,

Canadian Society of Echocardiography `,
  };
  transporter.sendMail(mailOptions, function (err, success) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent successfully");
    }
  });
});

app.post("/deleteInvitedUser", (req, res) => {
  const email = req.body.email;
  const status = req.body.status;

  const query = "DELETE FROM invitedUsers WHERE email = ?";
  const query2 = "DELETE FROM account WHERE email = ?";

  db.query(query, [email], (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log(status);
      if (status == "Signed Up") {
        db.query(query2, [email], (err, result) => {
          if (err) {
            throw err;
          } else {
            res.send({
              message: `user with email ${email} deleted from account and invitedUsers`,
            });
          }
        });
      } else {
        res.send({
          message: `user with email ${email} deleted from invitedUsers ${status}`,
        });
      }
    }
  });
});

app.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email; // this is email address
  const password = req.body.password;
  const organization = req.body.organization;

  const query0 = "SELECT name, role, labName FROM invitedUsers WHERE email = ?";
  // check if the role, name, and labName match with the invitedUserDB

  const query =
    "INSERT INTO account (`email`, `password`, `organization`, `role`, `username`) VALUES (?,?,?,?,?)";
  const query2 = "SELECT * FROM account where email = ?";
  // need to check if the organization exists
  const query3 = "SELECT * FROM organizations where orgName = ?";
  // update the status when the register is successful
  const query4 = "UPDATE invitedUsers SET status = 'Signed Up' WHERE email = ?";

  db.query(query0, [email], (err, result) => {
    const role = result[0].role;
    if (err) {
      throw err;
    }
    if (result.length === 0) {
      res.send({ message: "This email address has not been invited" });
    } else {
      if (result[0].name !== name) {
        console.log(name, ".");
        console.log(result[0].name, ".");
        res.send({ message: "This name doesn't match with your invitation" });
        // } else if (result[0].role !== role) {
        //   res.send({ message: "This role doesn't match with your invitation" });
      } else if (result[0].labName !== organization) {
        res.send({
          message: "This organization doesn't match with your invitation",
        });
      } else {
        db.query(query2, [email], (err, result) => {
          if (err) {
            throw err;
          }

          if (result.length > 0) {
            res.send({ message: "User already exists" });
          }
          if (result.length === 0) {
            db.query(query3, [organization], (err, result) => {
              if (err) {
                throw err;
              }
              if (result.length === 0) {
                res.send({ message: "This organization doesn't exist" });
              }
              if (result.length > 0) {
                const hashedPassword = bcrypt.hashSync(password, 10);
                db.query(
                  query,
                  [email, hashedPassword, organization, role, name],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                    }
                    // update the status of the registered user
                    db.query(query4, [email], (err, result) => {
                      if (err) {
                        throw err;
                      }
                    });
                    res.send({ message: "User created" });
                  }
                );
              }
            });
          }
        });
      }
    }
  });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      throw err;
    }
    if (!user) {
      res.send("No user exists");
    }
    if (user) {
      req.login(user, (err) => {
        if (err) {
          throw err;
        }
        res.send("User logged in");
        console.log(user);
      });
    }
  })(req, res, next);
});

app.post("/addInvite", (req, res, next) => {
  const email = req.body.email; // this is email address
  const name = req.body.name;
  const role = req.body.role;
  const labName = req.body.labName;
  const status = req.body.status;

  const query =
    "INSERT INTO invitedUsers (`email`, `name`, `role`, `labName`, `status`) VALUES (?,?,?,?,?)";
  const query2 = "SELECT * FROM invitedUsers where email = ?";

  db.query(query2, [email], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      res.send({ message: "User already invited" });
    }
    if (result.length === 0) {
      db.query(query, [email, name, role, labName, status], (err, result) => {
        if (err) {
          console.log(err);
        }
        res.send({ message: "User invited" });
      });
    }
  });
});

app.get("/getInvitedUsers", (req, res, next) => {
  const labName = req.query.labName;

  const query = "SELECT * FROM invitedUsers where labName = ?";
  db.query(query, [labName], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length === 0) {
      console.log(result);
      console.log("labName: ", labName);
      res.send({ message: "No invitations so far" });
    }
    if (result.length > 0) {
      res.send({ message: result });
    }
  });
});

app.get("/getLabName", (req, res, next) => {
  const userEmail = req.query.userEmail;
  console.log("userEmail: ", userEmail);
  const query = "SELECT organization FROM account WHERE email = ?";
  db.query(query, [userEmail], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length === 0) {
      res.send({ message: "Such user doesn't exist" });
    }
    if (result.length > 0) {
      res.send({ message: result });
    }
  });
});

app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
  console.log("logout call");
});

app.get("/getUser", (req, res) => {
  res.send(req.user);
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
