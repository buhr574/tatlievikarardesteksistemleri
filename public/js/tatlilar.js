document.addEventListener("DOMContentLoaded", () => {
  const yearSelect = document.getElementById("year-select");
  const branchSelect = document.getElementById("branch-select");
  const generateChartButton = document.getElementById("generate-chart");
  const chartDiv = document.getElementById("chart_div");
  const seasonalChartsDiv = document.getElementById("seasonal-charts");

  // Şubeleri yükle
  async function loadBranches() {
    try {
      const response = await fetch("/tatlilar/branches");
      const branches = await response.json();
      branchSelect.innerHTML = "";
      branches.forEach((branch) => {
        const option = document.createElement("option");
        option.value = branch.sube_id;
        option.textContent = branch.sube_adi;
        branchSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Şubeler yüklenemedi:", err);
    }
  }

  // Grafik çiz
  async function drawChart(year, branchId) {
    try {
      const response = await fetch(
        `/tatlilar/sales?year=${year}&branchId=${branchId}`
      );
      const data = await response.json();

      if (data.length === 0) {
        alert("Seçilen yıl ve şube için satış verisi bulunamadı.");
        return;
      }

      const chartData = [["Tatlı Adı", "Satış Miktarı"]];
      data.forEach((row) => {
        chartData.push([row.tatli_adi, row.satis_miktari]);
      });

      const options = {
        title: `Şube: ${
          branchSelect.options[branchSelect.selectedIndex].text
        }, Yıl: ${year}`,
        hAxis: {
          title: "Tatlı Adı",
          slantedText: true,
          slantedTextAngle: 45,
        },
        vAxis: { title: "Satış Miktarı" },
        legend: "none",
        bar: { groupWidth: "75%" },
      };

      const chart = new google.visualization.ColumnChart(chartDiv);
      chart.draw(google.visualization.arrayToDataTable(chartData), options);
    } catch (err) {
      console.error("Grafik verileri yüklenemedi:", err);
    }
  }

  // Mevsimsel grafikleri çiz
  async function drawSeasonalCharts(year, branchId) {
    try {
      const response = await fetch(
        `/tatlilar/seasonal?year=${year}&branchId=${branchId}`
      );
      const data = await response.json();

      if (data.length === 0) {
        alert("Seçilen yıl ve şube için mevsimsel satış verisi bulunamadı.");
        return;
      }

      const seasons = ["İlkbahar", "Yaz", "Sonbahar", "Kış"];
      seasonalChartsDiv.innerHTML = "";

      seasons.forEach((season) => {
        const seasonData = data.filter((item) => item.mevsim === season);

        if (seasonData.length > 0) {
          const chartData = [["Tatlı Adı", "Satış Miktarı"]];
          seasonData.forEach((row) => {
            chartData.push([row.tatli_adi, row.satis_miktari]);
          });

          const chartDiv = document.createElement("div");
          chartDiv.style.width = "45%";
          chartDiv.style.height = "400px";
          chartDiv.style.display = "inline-block";
          seasonalChartsDiv.appendChild(chartDiv);

          const options = {
            title: `${season} Mevsiminde En Çok Satılan Tatlılar`,
          };

          const chart = new google.visualization.PieChart(chartDiv);
          chart.draw(google.visualization.arrayToDataTable(chartData), options);
        }
      });
    } catch (err) {
      console.error("Mevsimsel grafik verileri yüklenemedi:", err);
    }
  }

  // Şubeleri yükle ve grafikleri oluştur
  loadBranches();
  generateChartButton.addEventListener("click", () => {
    const year = yearSelect.value;
    const branchId = branchSelect.value;
    drawChart(year, branchId);
    drawSeasonalCharts(year, branchId);
  });
});
