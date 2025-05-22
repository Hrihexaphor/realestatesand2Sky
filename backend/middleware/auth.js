import { ROLES } from "../constants/roles.js";

export function isAuthenticated(allowedRole = null) {
  return function (req, res, next) {
    // Debug session information
    console.log('Session check:', {
      hasSession: !!req.session,
      sessionID: req.sessionID,
      user: req.session?.user,
    });

    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (allowedRole && req.session.user.role !== allowedRole) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    if (req.session.user.role === ROLES.ADMIN) {
      return next();
    }

    const pathPermission = req.route.path

    if (!allowedRole && (!req.session.user.permissions || !req.session.user.permissions.some(permission => pathPermission.startsWith(permission)))) {
      return res.status(403).json({ error: `Forbidden: Insufficient permissions for ${pathPermission}` });
    }

    return next();
  };
}
