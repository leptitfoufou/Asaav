const express = require("express");
const router = express.Router();

const upload = require("../multer");

router.post("/", upload.single("image"), (req, res) => {
  res.json({
    message: "Image uploadée avec succès",
    imagePath: `images/uploads/${req.file.filename}`
  });
});

module.exports = router;