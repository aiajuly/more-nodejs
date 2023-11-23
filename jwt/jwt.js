// when you log in you will be giving a json web token( jwt)
// you can then use that token when you make http requests to your api to prove that you are registered


// to use it npm i jsonwebtoken
// require it under the name jwt



// in your log in route add these lines
const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
res.header("identifier name", token);



// then create this middleware:
function jwtAuth(req, res, next){
    const token = req.header('identifier name');
    if(!token) return res.send("access denied");

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        // verified will equal to the user id in the token.
        req.user = verified;
        next();
    } catch(err){
        console.log("error");
    }
}

// add this middleware to your protected routes that needs user log in.