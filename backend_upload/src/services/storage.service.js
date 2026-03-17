
const path = require("path");

const saveFilePath = (file) => {
  return {
    filename: file.filename,
    path: file.path
  };
};

module.exports = { saveFilePath };