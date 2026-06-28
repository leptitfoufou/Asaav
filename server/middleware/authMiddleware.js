const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token manquant"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "asaav_secret_key");
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Token invalide"
    });
  }
}

module.exports = authMiddleware;