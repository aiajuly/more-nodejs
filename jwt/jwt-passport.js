const passport = require("passport");
const passportJwt = require("passport-jwt");
const User = require("../models/user");





// in your log in route add these lines
const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
res.header("identifier name", token);




// in the  auth file write this
passport.use(

    // new passport strategy
    new passportJwt.Strategy(
      {
        // take the token from the header
        jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
        // verify the integrity of the token
        secretOrKey: process.env.JWT_SECRET,
      },
      // if the token is correct: jwt strategy will give you the token as a payload where you can use it in the next callback
               // jwtPayload is the token  // done is calback we call when everything is valid: the final stage
      function (jwtPayload, done) {
        return User.findOne({ where: { id: jwtPayload.id } })
          .then((user) => {
            // the first param of done is the error, but since we don't have error here we wrote null
            return done(null, user);
          })
          .catch((err) => {
            return done(err);
          });
      }
    )


)



// in the route you wanna protect write this:

const passport = require("passport");


router.get("/payment", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.send("You have a total of: 2400$");
  }
);