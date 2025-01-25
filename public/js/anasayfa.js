document.addEventListener("DOMContentLoaded", () => {
  const highYearSelect = document.getElementById("year-high-select");
  const lowYearSelect = document.getElementById("year-low-select");
  const topSweetsYearSelect = document.getElementById("year-top-sweets-select");
  const otherYearSelect = document.getElementById("year-other-select");

  const updateHighButton = document.getElementById("update-high-chart");
  const updateLowButton = document.getElementById("update-low-chart");
  const updateTopSweetsButton = document.getElementById(
    "update-top-sweets-chart"
  );
  const updateOtherButton = document.getElementById("update-other-chart");

  // En Fazla Kâr Grafiği
  updateHighButton.addEventListener("click", () => {
    const selectedYear = highYearSelect.value;
    drawHighChart(selectedYear);
  });

  // En Az Kâr Grafiği
  updateLowButton.addEventListener("click", () => {
    const selectedYear = lowYearSelect.value;
    drawLowChart(selectedYear);
  });

  // En Fazla Satılan Tatlılar Grafiği
  updateTopSweetsButton.addEventListener("click", () => {
    const selectedYear = topSweetsYearSelect.value;
    drawTopSweetsChart(selectedYear);
  });

  // En Az Satılan Tatlılar Grafiği
  updateOtherButton.addEventListener("click", () => {
    const selectedYear = otherYearSelect.value;
    drawLowSweetsChart(selectedYear);
  });

  // Başlangıç için varsayılan grafikleri çiz
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(() => {
    drawHighChart("2022");
    drawLowChart("2022");
    drawTopSweetsChart("2022");
    drawLowSweetsChart("2022");
  });
});

// En Fazla Kâr Grafiği Çizim
async function drawHighChart(year) {
  try {
    const response = await fetch(`/anasayfa/chart-data?year=${year}`);
    if (!response.ok) {
      throw new Error("Veri alınırken hata oluştu");
    }
    const data = await response.json();
    const chartData = [["Şube Adı", "Net Kâr"]];
    data.forEach((row) => chartData.push([row.subeAdi, row.netKar]));

    const options = { title: `En Fazla Kâr Yapan Şubeler (${year})` };
    const chart = new google.visualization.ColumnChart(
      document.getElementById("chart_high_div")
    );
    chart.draw(google.visualization.arrayToDataTable(chartData), options);
  } catch (err) {
    console.error("Hata:", err);
  }
}

// En Az Kâr Grafiği Çizim
async function drawLowChart(year) {
  try {
    const response = await fetch(`/anasayfa/chart-data-low?year=${year}`);
    if (!response.ok) {
      throw new Error("Veri alınırken hata oluştu");
    }
    const data = await response.json();
    const chartData = [["Şube Adı", "Net Kâr"]];
    data.forEach((row) => chartData.push([row.subeAdi, row.netKar]));

    const options = { title: `En Az Kâr Yapan Şubeler (${year})` };
    const chart = new google.visualization.ColumnChart(
      document.getElementById("chart_low_div")
    );
    chart.draw(google.visualization.arrayToDataTable(chartData), options);
  } catch (err) {
    console.error("Hata:", err);
  }
}

// En Fazla Satılan Tatlılar Grafiği Çizim
async function drawTopSweetsChart(year) {
  try {
    const response = await fetch(`/anasayfa/top-sweets?year=${year}`);
    if (!response.ok) {
      throw new Error("Veri alınırken hata oluştu");
    }
    const data = await response.json();
    const chartData = [["Tatlı Adı", "Toplam Satış"]];
    data.forEach((row) => chartData.push([row.tatliAdi, row.toplamSatis]));

    const options = { title: `En Fazla Satılan Tatlılar (${year})` };
    const chart = new google.visualization.PieChart(
      document.getElementById("chart_top_sweets_div")
    );
    chart.draw(google.visualization.arrayToDataTable(chartData), options);
  } catch (err) {
    console.error("Hata:", err);
  }
}

// En Az Satılan Tatlılar Grafiği Çizim
async function drawLowSweetsChart(year) {
  try {
    const response = await fetch(`/anasayfa/low-sweets?year=${year}`);
    if (!response.ok) {
      throw new Error("Veri alınırken hata oluştu");
    }
    const data = await response.json();
    const chartData = [["Tatlı Adı", "Toplam Satış"]];
    data.forEach((row) => chartData.push([row.tatliAdi, row.toplamSatis]));

    const options = { title: `En Az Satılan Tatlılar (${year})` };
    const chart = new google.visualization.PieChart(
      document.getElementById("chart_other_div")
    );
    chart.draw(google.visualization.arrayToDataTable(chartData), options);
  } catch (err) {
    console.error("Hata:", err);
  }
}
