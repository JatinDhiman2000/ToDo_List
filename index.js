const express = require("express");

const port = 8000;
const app = express();
const db = require("./config/mongoose");

//for session cookies
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport");
const { static } = require("express");

const MongoStore = require("connect-mongodb-session")(session);

app.use(express.urlencoded());
//using static files
app.use(express.static("./assests"));
//setting views
app.set("view engine", "ejs");
app.set("views", "./views");

//Mongo store is used to store the session in the db
app.use(
  session({
    name: "codeial",
    //todo change the secret before deployment in production mode
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "Connect-mongo setup ok");
        return;
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//use express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log("error in setting up the server");
    return;
  }
  console.log("Server in running on port : ", port);
});
