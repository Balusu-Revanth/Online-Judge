const User = require("../../models/User");

const getSolvedProblems = async (req, res) => {
  const { uid } = req.user;
  try {
    const user = await User.findOne({ uid }).populate("solvedProblems");
    if (!user) {
      return res.status(404).send("No user found with the specified ID.");
    }
    res.status(200).json(user.solvedProblems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getSolvedProblems;
