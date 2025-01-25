const db = require("../models/db"); // Veritabanı bağlantısını içe aktar

exports.getMonthlyProfit = (req, res) => {
  const { year, branchId } = req.query;

  const query = `
    SELECT 
      MONTH(sa.satis_tarihi) AS ay,
      SUM(sa.satis_geliri - sa.satis_maliyeti) AS kar
    FROM satislar sa
    WHERE YEAR(sa.satis_tarihi) = ? AND sa.sube_id = ?
    GROUP BY MONTH(sa.satis_tarihi)
    ORDER BY ay;
  `;

  db.query(query, [year, branchId], (err, results) => {
    if (err) {
      console.error("Aylık kâr verileri alınırken hata:", err.message);
      return res.status(500).send("Veritabanı hatası.");
    }
    res.json(results);
  });
};
exports.getAllBranchesYearlyProfit = (req, res) => {
  const { year } = req.query;

  const query = `
    SELECT 
      s.sube_adi AS sube,
      SUM(sa.satis_geliri - sa.satis_maliyeti) AS toplam_kar
    FROM satislar sa
    JOIN subeler s ON sa.sube_id = s.sube_id
    WHERE YEAR(sa.satis_tarihi) = ?
    GROUP BY s.sube_id
    ORDER BY toplam_kar DESC;
  `;

  db.query(query, [year], (err, results) => {
    if (err) {
      console.error(
        "Şubelerin yıllık toplam kârı alınırken hata:",
        err.message
      );
      return res.status(500).send("Veritabanı hatası.");
    }
    res.json(results);
  });
};
