const db = require("../models/db");

exports.getProfitPrediction = (req, res) => {
  const { branchId } = req.query;

  if (!branchId) {
    return res.status(400).send("Şube ID belirtilmedi.");
  }

  const query = `
    SELECT 
      YEAR(satis_tarihi) AS yil, 
      SUM(satis_geliri - satis_maliyeti) AS kar 
    FROM satislar 
    WHERE sube_id = ? AND YEAR(satis_tarihi) IN (2022, 2023, 2024)
    GROUP BY YEAR(satis_tarihi)
    ORDER BY YEAR(satis_tarihi);
  `;

  db.query(query, [branchId], (err, results) => {
    if (err) {
      console.error("Kâr tahminleme verileri alınırken hata:", err.message);
      return res.status(500).send("Veritabanı hatası.");
    }

    if (results.length < 3) {
      return res.status(400).send("En az 3 yıllık veri gereklidir.");
    }

    const years = results.map((row) => row.yil);
    const profits = results.map((row) => row.kar);

    const n = years.length;
    const sumX = years.reduce((a, b) => a + b, 0);
    const sumY = profits.reduce((a, b) => a + b, 0);
    const sumXY = years.reduce((sum, x, i) => sum + x * profits[i], 0);
    const sumX2 = years.reduce((sum, x) => sum + x * x, 0);

    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    const predictedProfit2025 = m * 2025 + b;

    const data = results.map((row) => ({
      yil: row.yil,
      kar: row.kar,
    }));

    data.push({ yil: 2025, kar: predictedProfit2025 });

    res.json(data);
  });
};
