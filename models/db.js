const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Veritabanı şifreniz
  database: "karardestektatlıevi", // Veritabanı adınız
});

connection.connect((err) => {
  if (err) {
    console.error("Veritabanına bağlanılamadı:", err);
    return;
  }
  console.log("Veritabanına başarıyla bağlanıldı!");
});

module.exports = connection;
