const Problem = require('../../models/Problem');
const { generateCodeFile } = require('../../utils/generateCodeFile');
const { generateInputFile } = require('../../utils/generateInputFile');
const { runCppCode } = require('../../utils/runCppCode');
const { runJavaCode } = require('../../utils/runJavaCode');
const { runPythonCode } = require('../../utils/runPythonCode');

const submitProblem = async (req, res) => {
  const { problem_id } = req.params;
  const { language, code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }
  try {
    const problem = await Problem.findOne({ problem_id: problem_id }, 'testCases');
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    console.log(problem);
    const filePath = await generateCodeFile(language, code);
    console.log(filePath);
    let result;
    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];
      const inputPath = await generateInputFile(testCase);
      try {
        if (language === 'cpp') {  
          result = await runCppCode(filePath, inputPath);
        }
        if (language === 'java') {
          result = await runJavaCode(filePath, inputPath);
        }
        if (language === 'python') {
          result = await runPythonCode(filePath, inputPath);
        }
      } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error });
      }
      if (result !== testCase.output) {
        console.log(result);
        return res.status(200).json({ message: `Failed at test case ${i + 1}` });
      }
    }
    res.status(200).json({ message: 'All test cases passed' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = submitProblem;
