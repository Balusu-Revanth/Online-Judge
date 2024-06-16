const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const runJavaCode = async (filePath, inputPath) => {
  return new Promise((resolve, reject) => {
    exec(`java ${filePath} < ${inputPath}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Runtime error`);
        return;
      }
      if (stderr) {
        reject(`Runtime error`);
        return;
      }
      resolve(stdout.trim());
    });
  });
};

module.exports = { runJavaCode };
