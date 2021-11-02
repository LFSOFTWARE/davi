function userAuth(req,res,next) {
    if(req.session.user != undefined){
        next()
    }else{
        req.flash("credenciaisInvalidas","Você precisa se logar!")
        res.redirect("/login");
     
    }
    
}


module.exports = userAuth;