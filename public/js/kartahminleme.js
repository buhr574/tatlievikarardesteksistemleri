document.addEventListener("DOMContentLoaded", () => {
  const branchSelect = document.getElementById("branch-select");
  const generateChartButton = document.getElementById("generate-chart");
  const chartDiv = document.getElementById("chart_div");

  // Şubeleri yükle
  async function loadBranches() {
    try {
      const response = await fetch("/tatlilar/branches"); // Şubeleri döndüren API
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
  async function drawProfitPredictionChart(branchId) {
    try {
      const response = await fetch(
        `/kartahminleme/profit-prediction?branchId=${branchId}`
      );
      const data = await response.json();

      if (data.length === 0) {
        alert("Seçilen şube için kâr verisi bulunamadı.");
        return;
      }

      const chartData = [["Yıl", "Kâr", { role: "style" }]];
      data.forEach((row, index) => {
        const style = row.yil === 2025 ? "color: red" : "color: blue";
        chartData.push([row.yil.toString(), row.kar, style]);
      });

      const options = {
        title: `Şube: ${
          branchSelect.options[branchSelect.selectedIndex].text
        } - Kâr Tahminlemesi`,
        hAxis: { title: "Yıl", format: "####" },
        vAxis: { title: "Kâr (TL)" },
        legend: "none",
      };

      const chart = new google.visualization.LineChart(chartDiv);
      chart.draw(google.visualization.arrayToDataTable(chartData), options);
    } catch (err) {
      console.error("Kâr tahminleme grafiği yüklenemedi:", err);
    }
  }

  // Şubeleri yükle ve grafikleri oluştur
  loadBranches();
  generateChartButton.addEventListener("click", () => {
    const branchId = branchSelect.value;
    drawProfitPredictionChart(branchId);
  });
});
