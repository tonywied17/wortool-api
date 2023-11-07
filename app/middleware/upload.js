const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const path = require("path");
const fs = require("fs");
const __basedir = path.resolve();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.join(
      __basedir,
      `resources/${req.params.regimentId}/static/assets/uploads`
    );

    // Ensure the dynamic upload folder exists, creating it if necessary
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      // It's an image file, you can proceed with the upload.
      cb(null, true);
    } else {
      // It's not an image file, reject the upload with an error.
      cb(new Error("File must be an image."));
    }
  }
}).single("file");


const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
