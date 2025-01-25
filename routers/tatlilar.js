const express = require("express");
const router = express.Router();
const tatlilarController = require("../controllers/tatlilarController");

// Tatlılar sayfasını gönder
router.get("/", (req, res) => {
  res.sendFile("views/tatlilar.html", { root: "." });
});

// Şubelerin listesini dönen API
router.get("/branches", tatlilarController.getBranches);

// Seçilen yıl ve şubeye göre satış verilerini dönen API
router.get("/sales", tatlilarController.getSalesData);

// Mevsimsel satış verilerini dönen API
router.get("/seasonal", tatlilarController.getSeasonalData);

module.exports = router;
