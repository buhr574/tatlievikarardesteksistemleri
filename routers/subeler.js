const express = require("express");
const router = express.Router();
const subelerController = require("../controllers/subelerController");

// Şubeler sayfasını gönder
router.get("/", (req, res) => {
  res.sendFile("views/subeler.html", { root: "." });
});

// Aylık kâr verilerini dönen API
router.get("/monthly-profit", subelerController.getMonthlyProfit);
// Tüm şubelerin yıllık toplam kârını dönen API
router.get("/yearly-profit", subelerController.getAllBranchesYearlyProfit);

module.exports = router;
