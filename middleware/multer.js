const multer = require('multer');

function uploadFile() {
    const storage = multer.diskStorage({
        destination: './uploads',
      
        filename: (_req, file, cb) => {
          var extension = file.originalname.slice(file.originalname.lastIndexOf('.'));
          cb(null, Date.now() + extension);
        }
      });
      
      const upload = multer({ storage: storage }).single('file'); //input tipo file cuyo name sea file
      return upload;
}

module.exports = uploadFile;

