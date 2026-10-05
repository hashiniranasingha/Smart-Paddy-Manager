const jwt = require("jsonwebtoken");

const SECRET_KEY = "paddyfield_secret_key";

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Invalid authorization format."
      });
    }

    const token = parts[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid or expired token."
        });
      }

      req.user = decoded;

      next();
    });

  } catch (error) {
    console.error("Authentication Middleware Error:", error);

    return res.status(500).json({
      message: "Authentication error."
    });
  }
};

module.exports = authenticateToken;