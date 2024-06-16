const User = require("../../models/User");

const deleteUser = async (req, res) => {
  const { uid } = req.user;

  try {
    const result = await User.deleteOne({ uid });
    if (result.deletedCount === 0) {
      return res.status(404).send("No user found with the specified ID.");
    }

    res.status(200).send("User deleted successfully.");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteUser;
