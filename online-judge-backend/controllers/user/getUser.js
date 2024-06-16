const User = require("../../models/User");

const getUser = async (req, res) => {
  const { uid } = req.user;
  try {
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).send("No user found with the specified ID.");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getUser;
