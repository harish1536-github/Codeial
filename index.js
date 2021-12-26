const express = require("express");
const env = require("./config/environment");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();

require("./config/view-helpers")(app);

const port =  8001;
const expressLayouts = require("express-ejs-layouts");
//importing the mongoose here
const db = require("./config/mongoose");
// used for session cookie
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");

const MongoStore = require("connect-mongo")(session);
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

// setup the chat server to be used with socket.io
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5001);
console.log("chat server is listening on port 5000");

const path = require("path");
if (env.name == "development") {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, "scss"),
      dest: path.join(__dirname, env.asset_path, "css"),
      debug: true,
      outputStyle: "extended",
      prefix: "/css",
    })
  );
}
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// app.use(express.static('./assets'));
app.use(express.static(__dirname + "/public/assets/"));

// app.use(express.static(path.join(__dirname+ "/"+ env.assets_path)));
// console.log(__dirname + "/" + env.assets_path);
// make the uploads path available to the browser
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// mongo store is used to store the session cookie in the db
// Setting up the session cookie
app.use(
  session({
    name: "codeial",
    // TODO change the secret before deployment in production mode
    // secret: 'blahsomething',
    secret: env.session_cookie_key,
    //when identity is not initialised which means user is not
    // logged in the identity is not established then no data is stored in
    // session cookie
    saveUninitialized: false,
    resave: false,
    //giving the age to session cookie
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    //storing the session data in database
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
