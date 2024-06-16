const User = require("../../models/User");

const signIn = async (req, res) => {
  const { uid } = req.user;

  try {
    const user = await User.findOne({ uid });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = signIn;
