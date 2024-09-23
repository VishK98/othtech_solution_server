const multer = require("multer");

// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // specify your upload directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // use original file name or generate a new one
  },
});

// Initialize upload
const upload = multer({ storage });

module.exports = upload;
