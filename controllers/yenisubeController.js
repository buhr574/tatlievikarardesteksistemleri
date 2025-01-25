const db = require("../models/db");

exports.getYeniSubeData = (req, res) => {
  const query = `
    SELECT 
        ilce_adi AS ilce,
        CASE
            WHEN nufus_yogunlugu < 150 THEN 'Düşük'
            WHEN nufus_yogunlugu BETWEEN 150 AND 300 THEN 'Orta'
            WHEN nufus_yogunlugu BETWEEN 300 AND 450 THEN 'Yüksek'
            ELSE 'Çok Yüksek'
        END AS nufus_kategori,
        CASE
            WHEN gelir_duzeyi < 7500 THEN 'Düşük'
            WHEN gelir_duzeyi BETWEEN 7500 AND 10000 THEN 'Orta'
            WHEN gelir_duzeyi BETWEEN 10000 AND 12500 THEN 'Yüksek'
            ELSE 'Çok Yüksek'
        END AS gelir_kategori,
        CASE
            WHEN rakip_firma_sayisi > 6 THEN 'Yüksek'
            WHEN rakip_firma_sayisi BETWEEN 3 AND 6 THEN 'Orta'
            ELSE 'Düşük'
        END AS rakip_kategori,
        CASE
            WHEN kira_maliyeti < 15000 THEN 'Düşük'
            WHEN kira_maliyeti BETWEEN 15000 AND 20000 THEN 'Orta'
            WHEN kira_maliyeti BETWEEN 20000 AND 25000 THEN 'Yüksek'
            ELSE 'Çok Yüksek'
        END AS kira_kategori,
        ROUND(
            (0.30 * (nufus_yogunlugu / 450) * 100) +  
            (0.30 * (gelir_duzeyi / 15000) * 100) -  
            (0.20 * (rakip_firma_sayisi / 10) * 100) +  
            (0.20 * (CASE
                        WHEN kira_maliyeti < 15000 THEN 1.0
                        WHEN kira_maliyeti BETWEEN 15000 AND 20000 THEN 0.8
                        WHEN kira_maliyeti BETWEEN 20000 AND 25000 THEN 0.5
                        ELSE 0.2
                     END) * 100)
        , 2) AS skor
    FROM karardestektatlıevi.ilce_bilgileri
    WHERE ilce_id BETWEEN 8 AND 93 
    ORDER BY skor DESC
    LIMIT 10;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Veri çekme hatası:", err);
      return res
        .status(500)
        .json({ error: "Veri çekme sırasında bir hata oluştu" });
    }
    res.json(results);
  });
};
