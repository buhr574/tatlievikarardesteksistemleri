const db = require("../models/db");

// Anasayfa rotası için HTML dosyasını döndür
exports.getAnasayfa = (req, res) => {
  res.sendFile("anasayfa.html", { root: "views" });
};

// En Fazla Kâr Grafiği için API
exports.getChartData = (req, res) => {
  const selectedYear = req.query.year;
  const query = `
    SELECT 
        sb.sube_adi AS subeAdi,
        (SUM(sa.satis_geliri) - SUM(sa.satis_miktari * t.maliyet_${selectedYear}) - sb.kira_${selectedYear} - pg.maas_${selectedYear}) AS netKar
    FROM satislar sa
    INNER JOIN tatlilar t ON sa.tatli_id = t.tatli_id
    INNER JOIN subeler sb ON sa.sube_id = sb.sube_id
    INNER JOIN (
        SELECT 
            p.sube_id, 
            SUM(pg.maas_${selectedYear}) AS maas_${selectedYear}
        FROM personel_giderleri pg
        INNER JOIN personel p ON pg.personel_id = p.personel_id
        GROUP BY p.sube_id
    ) pg ON sa.sube_id = pg.sube_id
    WHERE YEAR(sa.satis_tarihi) = ?
    GROUP BY sb.sube_adi
    ORDER BY netKar DESC
    LIMIT 3;
  `;

  db.query(query, [selectedYear], (err, results) => {
    if (err) {
      console.error("Veritabanı sorgusunda hata:", err.message);
      return res.status(500).json({ error: "Veritabanı hatası." });
    }
    res.json(results);
  });
};

// En Az Kâr Grafiği için API
exports.getLowChartData = (req, res) => {
  const selectedYear = req.query.year;
  const query = `
    SELECT 
        sb.sube_adi AS subeAdi,
        (SUM(sa.satis_geliri) - SUM(sa.satis_miktari * t.maliyet_${selectedYear}) - sb.kira_${selectedYear} - pg.maas_${selectedYear}) AS netKar
    FROM satislar sa
    INNER JOIN tatlilar t ON sa.tatli_id = t.tatli_id
    INNER JOIN subeler sb ON sa.sube_id = sb.sube_id
    INNER JOIN (
        SELECT 
            p.sube_id, 
            SUM(pg.maas_${selectedYear}) AS maas_${selectedYear}
        FROM personel_giderleri pg
        INNER JOIN personel p ON pg.personel_id = p.personel_id
        GROUP BY p.sube_id
    ) pg ON sa.sube_id = pg.sube_id
    WHERE YEAR(sa.satis_tarihi) = ?
    GROUP BY sb.sube_adi
    ORDER BY netKar ASC
    LIMIT 3;
  `;

  db.query(query, [selectedYear], (err, results) => {
    if (err) {
      console.error("Veritabanı sorgusunda hata:", err.message);
      return res.status(500).json({ error: "Veritabanı hatası." });
    }
    res.json(results);
  });
};

// En Fazla Satılan Tatlılar Grafiği için API
exports.getTopSweets = (req, res) => {
  const selectedYear = req.query.year;
  const query = `
    SELECT 
        t.tatli_adi AS tatliAdi,
        SUM(sa.satis_miktari) AS toplamSatis
    FROM satislar sa
    INNER JOIN tatlilar t ON sa.tatli_id = t.tatli_id
    WHERE YEAR(sa.satis_tarihi) = ?
    GROUP BY t.tatli_adi
    ORDER BY toplamSatis DESC
    LIMIT 3;
  `;

  db.query(query, [selectedYear], (err, results) => {
    if (err) {
      console.error("Veritabanı sorgusunda hata:", err.message);
      return res.status(500).json({ error: "Veritabanı hatası." });
    }
    res.json(results);
  });
};

// En Az Satılan Tatlılar Grafiği için API
exports.getLowSweets = (req, res) => {
  const selectedYear = req.query.year;
  const query = `
    SELECT 
        t.tatli_adi AS tatliAdi,
        SUM(sa.satis_miktari) AS toplamSatis
    FROM satislar sa
    INNER JOIN tatlilar t ON sa.tatli_id = t.tatli_id
    WHERE YEAR(sa.satis_tarihi) = ?
    GROUP BY t.tatli_adi
    ORDER BY toplamSatis ASC
    LIMIT 3;
  `;

  db.query(query, [selectedYear], (err, results) => {
    if (err) {
      console.error("Veritabanı sorgusunda hata:", err.message);
      return res.status(500).json({ error: "Veritabanı hatası." });
    }
    res.json(results);
  });
};
