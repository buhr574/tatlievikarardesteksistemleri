const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const anasayfaRouter = require("./routers/anasayfa");
const tatlilarRouter = require("./routers/tatlilar");
const subelerRouter = require("./routers/subeler");
const kartahminlemeRouter = require("./routers/kartahminleme");
const yenisubeRouter = require("./routers/yenisube"); // Yeni Şube rotası

const app = express();

// Veritabanı bağlantısı
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "karardestektatlıevi",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Veritabanı bağlantısı başarılı!");
});

// Statik dosyalar için public klasörünü kullan
app.use(express.static("public"));

// JSON isteği için parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Login ekranını başlangıç sayfası yap
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Çıkış yapma rotası
app.get("/logout", (req, res) => {
  res.redirect("/login");
});

// Login ekranı için rota
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Giriş işlemi için POST isteği
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM yonetici WHERE kullanici_adi = ? AND sifre = ?";
  db.query(sql, [username, password], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      // Anasayfa'ya yönlendir
      res.redirect("/anasayfa");
    } else {
      res.send(
        '<h1>Geçersiz kullanıcı adı veya şifre. <a href="/">Tekrar dene</a></h1>'
      );
    }
  });
});

// Anasayfa rotalarını ekle
app.use("/anasayfa", anasayfaRouter);

// Grafik API rotalarını burada tanımlayın
app.use("/chart-data", anasayfaRouter);
app.use("/chart-data-low", anasayfaRouter);
app.use("/top-sweets", anasayfaRouter);
app.use("/low-sweets", anasayfaRouter);

// Tatlılar rotalarını ekle
app.use("/tatlilar", tatlilarRouter);

// Şubeler rotalarını ekle
app.use("/subeler", subelerRouter);

// Kâr tahminleme rotalarını ekle
app.use("/kartahminleme", kartahminlemeRouter);

// Yeni Şube rotalarını ekle
app.use("/yenisube", yenisubeRouter); // Yeni eklenen rota

// Sunucuyu başlat
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
