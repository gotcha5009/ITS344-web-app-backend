require('dotenv').config();
const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../../middlewares/uploadImageMiddleware');
const fileController = require('../../controllers/fileController');
const multer = require('multer');

// Initiating a memory storage engine to store files as Buffer objects
const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limiting files size to 5 MB
  },
});

router.post('/images', uploadMiddleware.uploadImages(), fileController.upload);
router.post('/images2', uploader.single('image'), fileController.upload2);

module.exports = router;
