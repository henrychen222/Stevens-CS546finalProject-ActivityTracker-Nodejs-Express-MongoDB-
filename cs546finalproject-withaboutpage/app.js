const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const static = express.static(__dirname + "/public");
const settings = require("./config/settings");
var session = require('express-session');
const cookieParser = require("cookie-parser");

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({ secret: settings.sessionConfig.secret,
    resave: settings.sessionConfig.resave,
    saveUninitialized: settings.sessionConfig.saveUninitialized,
    cookie: {
        expires: settings.sessionConfig.cookie.expire
    }}));

app.engine("handlebars", exphbs({ defaultLayout: "main" , partialsDir: __dirname + '/views/partials'}));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
