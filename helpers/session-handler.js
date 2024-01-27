function requireLogin(req, res, next){
  if (!req.user) {
          req.session.prevUrl = req.body.url;
          if(req.xhr) res.send({"err":"usrErr"});
          else res.redirect('/users/login');
  }
  else next();
}

export default requireLogin;

