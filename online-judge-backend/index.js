require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { DBConnection } = require("./configs/db");
const authRoutes = require("./routes/auth");
const problemRoutes = require("./routes/problem");
const userRoutes = require("./routes/user");
const admin = require("firebase-admin");
const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH;
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

DBConnection();

app.get("/", (req, res) => {
  res.status(200).send("Server is up and running!!");
});

app.use("/auth", authRoutes);
app.use("/problems", problemRoutes);
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
