const util = require("util");
const multer = require("multer");
const maxSize = 10 * 1024 * 1024;
const path = require("path");
const fs = require("fs");
const __basedir = path.resolve();

/**
 * Storage Configuration for Regiment Media Uploads
 * This function is used to configure the storage for media uploads
 * @param {*} req - request
 * @param {*} file - file
 */
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

/**
 * Storage Configuration for Regiment Cover Uploads
 * This function is used to configure the storage for cover images
 * @param {*} req - request
 * @param {*} file - file
 */
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

/**
 * Upload Media File
 * This function is used to upload media files
 * @param {*} req - request
 * @param {*} res - response
 */
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

/**
 * Upload Cover Image
 * This function is used to upload cover images
 * @param {*} req - request
 * @param {*} res - response
 */
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
