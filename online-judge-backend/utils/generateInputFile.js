const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dirInputs = path.join(__dirname, '../data/inputs');

if (!fs.existsSync(dirInputs)) {
  fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = async (testCase) => {
  const jobId = uuidv4();
  console.log(jobId);
  const inputPath = path.join(dirInputs, `${jobId}.txt`);
  console.log(inputPath);
  fs.writeFileSync(inputPath, testCase.input);
  return inputPath;
};

module.exports = { generateInputFile };
