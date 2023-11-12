const util = require("util");
const multer = require("multer");
const maxSize = 10 * 1024 * 1024;
const path = require("path");
const fs = require("fs");
const __basedir = path.resolve();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.join(
      __basedir,
      `resources/${req.params.regimentId}/static/assets/uploads`
    );

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

const cover_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.join(
      __basedir,
      `resources/${req.params.regimentId}/static/assets/uploads/cover`
    );

    if (fs.existsSync(uploadFolder)) {
      fs.readdirSync(uploadFolder).forEach((file) => {
        const filePath = path.join(uploadFolder, file);
        fs.unlinkSync(filePath);
      });
    } else {
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
      cb(null, true);
    } else {
      cb(new Error("File must be an image."));
    }
  }
}).single("file");

const uploadCover = multer({
  storage: cover_storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    // process images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("File must be an image."));
    }
  }
}).single("file");

const uploadFileMiddleware = util.promisify(uploadFile);
const uploadCoverMiddleware = util.promisify(uploadCover);

module.exports = {
  uploadFileMiddleware: uploadFileMiddleware,
  uploadCoverMiddleware: uploadCoverMiddleware,
};
