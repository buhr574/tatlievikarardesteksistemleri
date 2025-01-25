// Harita başlatma
let map = L.map("map").setView([38.5, 27.0], 7); // İzmir merkezli

// OpenStreetMap Katmanı
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Potansiyel ilçeler (Mavi İşaretçi)
const karPotansiyeliIlceler = [
  { ilce: "Bodrum", lat: 37.035, lng: 27.43 },
  { ilce: "Konak", lat: 38.419, lng: 27.128 },
  { ilce: "Çeşme", lat: 38.322, lng: 26.306 },
  { ilce: "Urla", lat: 38.319, lng: 26.764 },
  { ilce: "Kuşadası", lat: 37.859, lng: 27.256 },
  { ilce: "Marmaris", lat: 36.855, lng: 28.274 },
  { ilce: "Balçova", lat: 38.392, lng: 27.059 },
  { ilce: "Şehzadeler", lat: 38.612, lng: 27.427 },
  { ilce: "Bayraklı", lat: 38.457, lng: 27.152 },
  { ilce: "Yunusemre", lat: 38.613, lng: 27.431 },
];

karPotansiyeliIlceler.forEach((location) => {
  L.circleMarker([location.lat, location.lng], {
    color: "blue",
    radius: 8,
    fillColor: "blue",
    fillOpacity: 0.8,
  })
    .addTo(map)
    .bindPopup(`<b>${location.ilce}</b>`);
});

// Mevcut şubeler (Kırmızı İşaretçi)
const mevcutSubeler = [
  { ilce: "İzmir Bornova", lat: 38.4622, lng: 27.216 },
  { ilce: "İzmir Karşıyaka", lat: 38.4557, lng: 27.1105 },
  { ilce: "Denizli Merkezefendi", lat: 37.7742, lng: 29.0875 },
  { ilce: "Muğla Fethiye", lat: 36.621, lng: 29.1164 },
  { ilce: "Aydın Efeler", lat: 37.845, lng: 27.8396 },
  { ilce: "Manisa Yunusemre", lat: 38.613, lng: 27.4265 },
  { ilce: "Uşak Merkez", lat: 38.6823, lng: 29.4082 },
];

mevcutSubeler.forEach((sube) => {
  L.circleMarker([sube.lat, sube.lng], {
    color: "red",
    radius: 8,
    fillColor: "red",
    fillOpacity: 0.8,
  })
    .addTo(map)
    .bindPopup(`<b>${sube.ilce}</b>`);
});

// Tabloyu doldurma ve grafiği başlatma
document.addEventListener("DOMContentLoaded", function () {
  fetch("/yenisube/api")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#yenisube-table tbody");
      tableBody.innerHTML = "";

      const ilceler = [];
      const skorlar = [];

      data.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.ilce}</td>
          <td>${row.nufus_kategori}</td>
          <td>${row.gelir_kategori}</td>
          <td>${row.rakip_kategori}</td>
          <td>${row.kira_kategori}</td>
          <td>${row.skor}</td>
        `;
        tableBody.appendChild(tr);

        ilceler.push(row.ilce);
        skorlar.push(row.skor);
      });

      // Grafik oluşturma
      const ctx = document.getElementById("bar-chart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ilceler,
          datasets: [
            {
              label: "Kar Potansiyeli Skoru",
              data: skorlar,
              backgroundColor: "rgba(0, 48, 135, 0.8)",
              borderColor: "rgba(0, 48, 135, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    })
    .catch((error) => console.error("Veri çekme hatası:", error));
});
