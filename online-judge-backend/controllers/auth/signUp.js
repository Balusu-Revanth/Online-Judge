const User = require("../../models/User");

const signUp = async (req, res) => {
  const { firstName, lastName } = req.body;
  const { uid, email } = req.user;

  try {
    const newUser = new User({ uid, firstName, lastName, email });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(409)
        .json({ error: "A user with the given email or UID already exists." });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = signUp;
