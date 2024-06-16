const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "../data/outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const runCppCode = async (filePath, inputPath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  return new Promise((resolve, reject) => {
    exec(`g++ ${filePath} -o ${outPath}`, (error, stdout, stderr) => {
      if (error) {
        if (outputPath) fs.unlinkSync(outputPath);
        reject(`Compilation error`);
        return;
      }
      if (stderr) {
        if (outputPath) fs.unlinkSync(outputPath);
        reject(`Compilation error`);
        return;
      }
      exec(`${outPath} < ${inputPath}`, (error, stdout, stderr) => {
        if (outPath) fs.unlinkSync(outPath);
        if (error) {
          reject(`Runtime error`);
          return;
        }
        if (stderr) {
          reject(`Runtime error`);
          return;
        }
        resolve(stdout);
      });
    });
  });
};

module.exports = { runCppCode };
