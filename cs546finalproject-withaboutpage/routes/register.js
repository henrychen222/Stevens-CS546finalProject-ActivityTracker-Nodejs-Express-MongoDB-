const express = require('express');
const router = express.Router();
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
//const bcrypt = require('bcrypt');
const bcrypt = require('bcrypt-nodejs');

const dbOperation = require("../data/users");



router.get("/register", (req, res) => {
    console.log("here");
    res.render('main/register');

});

router.post("/register", async (req, res) => {


    let error = "";
    if (!req.body.firstname) error +="Firstname cannot be empty <br>";
    if (!req.body.lastname) error +="Lastname cannot be empty  <br>";
    if (!req.body.email)  error +="Email address cannot be empty  <br> ";
    if (!req.body.password)  error +="Password cannot be empty <br> ";
    if (!req.body.dateofbirth) error +="Date of birth cannot be empty <br> ";
    if(!req.body.gender)  error +="Gender cannot be empty <br> ";

    if (req.body.firstname.length > 20) error +="Firstname  is too long <br> ";
    if (req.body.lastname.length > 20) error +="Lastname  is too long <br> ";
    if (req.body.email.length > 50) error +="Email address is too long  <br>";
    if (req.body.password.length > 20) error +="Password is too long <br> ";
    if (req.body.password.length < 8) error +="Password is too short  <br>";

    try{
        const user = await dbOperation.getUser(req.body.email);
        if(user) error +="Email is already used";
    }catch (e) {
        res.render("main/register", { error: error});
    }
    if(error !== ""){
        res.render("main/register", { error: error});
        return;
    }
    try {
        //use bcrypt
        //const hash = await bcrypt.hash(req.body.password, 10);     

        //use bcrypt-nodejs
        const hash = await bcrypt.hashSync(req.body.password);

        //add the registered email and password to database  email and password are the key  (html id)
        await dbOperation.createUser(req.body.firstname, req.body.lastname, req.body.email, hash, req.body.dateofbirth, req.body.gender);
        res.redirect("/login");

    } catch (e) {
        res.render("main/register", { error: e});
        console.log(e);
    }
})







module.exports = router;



