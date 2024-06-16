const admin = require("firebase-admin");

const verifyFirebaseToken = async (req, res, next) => {
  const idToken = req.headers.authorization;
  if (!idToken) {
    return res.status(401).send("Unauthorized: No ID token provided");
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).send("Unauthorized: Invalid ID token");
  }
};

module.exports = verifyFirebaseToken;
