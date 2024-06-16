const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const dirCodes = path.join(__dirname, "../data/codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateCodeFile = async (language, code) => {
  const jobId = uuidv4();
  const filePath = path.join(dirCodes, `${jobId}.${language}`);
  fs.writeFileSync(filePath, code);
  return filePath;
};

module.exports = { generateCodeFile };
