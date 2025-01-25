const express = require("express");
const path = require("path");
const router = express.Router();
const kartahminlemeController = require("../controllers/kartahminlemeController");

// kartahminleme.html dosyasını döndüren rota
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/kartahminleme.html"));
});

// Kâr tahminleme verilerini sağlayan API rotası
router.get("/profit-prediction", kartahminlemeController.getProfitPrediction);

module.exports = router;
