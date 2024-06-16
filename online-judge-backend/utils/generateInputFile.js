const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const dirInputs = path.join(__dirname, "../data/inputs");

if (!fs.existsSync(dirInputs)) {
  fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = async (input) => {
  const jobId = uuidv4();
  const inputPath = path.join(dirInputs, `${jobId}.txt`);
  fs.writeFileSync(inputPath, input);
  return inputPath;
};

module.exports = { generateInputFile };
