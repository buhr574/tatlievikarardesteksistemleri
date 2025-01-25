const express = require("express");
const router = express.Router();
const anasayfaController = require("../controllers/anasayfaController");

// Anasayfa rotası
router.get("/", anasayfaController.getAnasayfa);

// En fazla kâr yapan şubeler için API
router.get("/chart-data", anasayfaController.getChartData);

// En az kâr yapan şubeler için API
router.get("/chart-data-low", anasayfaController.getLowChartData);

// En fazla satılan tatlılar için API
router.get("/top-sweets", anasayfaController.getTopSweets);

// En az satılan tatlılar için API
router.get("/low-sweets", anasayfaController.getLowSweets);

module.exports = router;
