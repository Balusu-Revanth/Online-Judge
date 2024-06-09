const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dirCodes = path.join(__dirname, '../data/codes');

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateCodeFile = async (language, code) => {
  console.log(language);
  const jobId = uuidv4();
  console.log(jobId);
  const filePath = path.join(dirCodes, `${jobId}.${language}`);
  console.log(filePath);  
  fs.writeFileSync(filePath, code);
  return filePath;
}

module.exports = { generateCodeFile };
