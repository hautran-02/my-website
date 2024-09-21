import fs from 'fs';
import { join } from 'path';

const deleteFile = (filePath) => {
  //filePath is relative url
  const fullFilePath = join(__dirname, '..', '..', filePath);
  console.log(fullFilePath);
  fs.unlink(fullFilePath, (error) => {
    if (error) {
      console.log(error);
    }
  });
};

export default {
  deleteFile,
};
