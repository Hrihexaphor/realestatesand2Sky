export function isAuthenticated(req, res, next) {
  // Debug session information
  console.log('Session check:', { 
    hasSession: !!req.session,
    sessionID: req.sessionID,
    user: req.session?.user 
  });
  
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
}