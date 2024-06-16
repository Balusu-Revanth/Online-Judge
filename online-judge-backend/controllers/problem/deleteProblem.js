const Problem = require("../../models/Problem");
const User = require("../../models/User");

const deleteProblem = async (req, res) => {
  const { problem_id } = req.params;
  try {
    const problem = await Problem.findOneAndDelete({ problem_id });
    if (problem) {
      await User.updateMany(
        { solvedProblems: problem._id },
        { $pull: { solvedProblems: problem._id } }
      );
      res.status(200).json({ message: "Problem deleted successfully" });
    } else {
      res.status(404).json({ message: "Problem not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = deleteProblem;
