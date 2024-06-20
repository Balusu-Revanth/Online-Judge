const fs = require("fs");
const { generateCodeFile } = require("../../utils/generateCodeFile");
const { generateInputFile } = require("../../utils/generateInputFile");
const { runCppCode } = require("../../utils/runCppCode");
const { runJavaCode } = require("../../utils/runJavaCode");
const { runPythonCode } = require("../../utils/runPythonCode");

const runProblem = async (req, res) => {
  const { language, code, input } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Code is required" });
  }

  try {
    const filePath = await generateCodeFile(language, code);
    const inputPath = await generateInputFile(input);
    let result;
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
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

    res.status(200).json({ message: result });
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

module.exports = runProblem;
