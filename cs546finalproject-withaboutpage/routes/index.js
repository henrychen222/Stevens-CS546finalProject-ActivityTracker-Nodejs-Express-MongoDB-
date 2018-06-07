const profileRoutes = require("./profile");
const apiRoutes = require("./api");
const userRoutes = require('./login');
const registerRoutes = require('./register');

const constructorMethod = app => {
    app.use("/", userRoutes);
    app.use("/", registerRoutes);

    app.get('/logout', function(req, res, next) {
        if (req.session) {
            // delete session object
            req.session.destroy(function(err) {
                if(err) {
                    return next(err);
                } else {
                    res.clearCookie("AuthCookie");
                    return res.redirect('/');
                }
            });
        }
    });

    app.use("/profile", (req, res, next) => {
        if(!req.cookies.AuthCookie || !req.session.user){
            res.clearCookie("AuthCookie");
            res.redirect('/login');
        } else{
            next();
        }
        return;
    });

    app.use(function (req, res, next) {
        res.locals.session = req.session;
        next();
    });



    app.use("/", profileRoutes);

    app.use("/", apiRoutes);

    app.use("*", (req, res) => {
        console.log("catch all");
        res.render("main/index", null);
  });
};


module.exports = constructorMethod;