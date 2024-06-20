const fs = require("fs");
const User = require("../../models/User");
const Problem = require("../../models/Problem");
const { generateCodeFile } = require("../../utils/generateCodeFile");
const { generateInputFile } = require("../../utils/generateInputFile");
const { runCppCode } = require("../../utils/runCppCode");
const { runJavaCode } = require("../../utils/runJavaCode");
const { runPythonCode } = require("../../utils/runPythonCode");

const submitProblem = async (req, res) => {
  const { problem_id } = req.params;
  const { language, code } = req.body;
  const { uid } = req.user;

  if (!code) {
    return res.status(400).json({ message: "Code is required" });
  }

  try {
    const problem = await Problem.findOne({ problem_id }, "testCases");
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const filePath = await generateCodeFile(language, code);
    let result;
    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];
      const inputPath = await generateInputFile(testCase.input);
      try {
        if (language === "cpp") {
          result = await runCppCode(filePath, inputPath);
        } else if (language === "java") {
          result = await runJavaCode(filePath, inputPath);
        } else if (language === "py") {
          result = await runPythonCode(filePath, inputPath);
        }
      } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        return res.status(400).json({ message: error });
      }
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (result !== testCase.output.trim()) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res
          .status(200)
          .json({ message: `Failed at test case ${i + 1}` });
      }
    }

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    const user = await User.findOne({ uid });
    if (!user.solvedProblems.includes(problem._id)) {
      user.solvedProblems.push(problem._id);
      await user.save();
    }

    res.status(200).json({ message: "All test cases passed" });
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

module.exports = submitProblem;
