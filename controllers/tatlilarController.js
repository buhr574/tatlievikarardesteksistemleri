const db = require("../models/db");

exports.getBranches = (req, res) => {
  const query = "SELECT sube_id, sube_adi FROM subeler";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Şubeler alınırken hata:", err.message);
      return res.status(500).send("Veritabanı hatası.");
    }
    res.json(results);
  });
};

exports.getSalesData = (req, res) => {
  const { year, branchId } = req.query;
  const query = `
    SELECT 
      t.tatli_adi AS tatli_adi,
      SUM(sa.satis_miktari) AS satis_miktari
    FROM satislar sa
    INNER JOIN tatlilar t ON sa.tatli_id = t.tatli_id
    WHERE YEAR(sa.satis_tarihi) = ? AND sa.sube_id = ?
    GROUP BY t.tatli_adi
    ORDER BY satis_miktari DESC
    LIMIT 20;
  `;
  db.query(query, [year, branchId], (err, results) => {
    if (err) {
      console.error("Satış verileri alınırken hata:", err.message);
      return res.status(500).send("Veritabanı hatası.");
    }
    res.json(results);
  });
};

exports.getSeasonalData = (req, res) => {
  const { year, branchId } = req.query;
  const query = `
    SELECT
      mevsim,
      tatli_adi,
      satis_miktari
    FROM (
      SELECT
        CASE
          WHEN MONTH(sa.satis_tarihi) IN (3, 4, 5) THEN 'İlkbahar'
          WHEN MONTH(sa.satis_tarihi) IN (6, 7, 8) THEN 'Yaz'
          WHEN MONTH(sa.satis_tarihi) IN (9, 10, 11) THEN 'Sonbahar'
          WHEN MONTH(sa.satis_tarihi) IN (12, 1, 2) THEN 'Kış'
        END AS mevsim,
        t.tatli_adi AS tatli_adi,
        SUM(sa.satis_miktari) AS satis_miktari,
        ROW_NUMBER() OVER (
          PARTITION BY 
            CASE
              WHEN MONTH(sa.satis_tarihi) IN (3, 4, 5) THEN 'İlkbahar'
              WHEN MONTH(sa.satis_tarihi) IN (6, 7, 8) THEN 'Yaz'
              WHEN MONTH(sa.satis_tarihi) IN (9, 10, 11) THEN 'Sonbahar'
              WHEN MONTH(sa.satis_tarihi) IN (12, 1, 2) THEN 'Kış'
            END
          ORDER BY SUM(sa.satis_miktari) DESC
        ) AS sıra
      FROM satislar sa
      INNER JOIN tatlilar t ON sa.tatli_id = t.tatli_id
      WHERE YEAR(sa.satis_tarihi) = ? AND sa.sube_id = ?
      GROUP BY mevsim, t.tatli_adi
    ) AS subquery
    WHERE sıra <= 3
    ORDER BY mevsim, satis_miktari DESC;
  `;

  db.query(query, [year, branchId], (err, results) => {
    if (err) {
      console.error("Mevsimsel veriler alınırken hata:", err.message);
      return res.status(500).send("Veritabanı hatası.");
    }
    res.json(results);
  });
};
