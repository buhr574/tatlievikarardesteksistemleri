const express = require("express");
const path = require("path");
const router = express.Router();
const yenisubeController = require("../controllers/yenisubeController");

// API rotası
router.get("/api", yenisubeController.getYeniSubeData);

// HTML dosyasını sunmak
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/yenisube.html"));
});

module.exports = router;
