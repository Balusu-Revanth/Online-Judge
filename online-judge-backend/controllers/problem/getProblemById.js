const Problem = require("../../models/Problem");

const getProblemById = async (req, res) => {
  const { problem_id } = req.params;

  try {
    const problem = await Problem.findOne(
      { problem_id: problem_id },
      "-testCases"
    );
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json(problem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = getProblemById;
