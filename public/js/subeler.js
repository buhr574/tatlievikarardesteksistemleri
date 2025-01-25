document.addEventListener("DOMContentLoaded", () => {
  const yearSelect = document.getElementById("year-select");
  const branchSelect = document.getElementById("branch-select");
  const generateChartButton = document.getElementById("generate-chart");
  const generateAllBranchesChartButton = document.getElementById(
    "generate-all-branches-chart"
  ); // Yeni buton
  const chartDiv = document.getElementById("chart_div");
  const allBranchesChartDiv = document.getElementById("all-branches-chart");
  const totalProfitDiv = document.getElementById("total-profit");

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

  // İlk Grafik: Aylık Kâr Grafiği
  async function drawMonthlyProfitChart(year, branchId) {
    try {
      const response = await fetch(
        `/subeler/monthly-profit?year=${year}&branchId=${branchId}`
      );
      const data = await response.json();

      if (data.length === 0) {
        alert("Seçilen yıl ve şube için kâr verisi bulunamadı.");
        return;
      }

      const chartData = [["Ay", "Kâr"]];
      const monthsMap = {
        1: "Ocak",
        2: "Şubat",
        3: "Mart",
        4: "Nisan",
        5: "Mayıs",
        6: "Haziran",
        7: "Temmuz",
        8: "Ağustos",
        9: "Eylül",
        10: "Ekim",
        11: "Kasım",
        12: "Aralık",
      };

      data.forEach((row) => {
        chartData.push([monthsMap[row.ay], row.kar]);
      });

      const options = {
        title: `Şube: ${
          branchSelect.options[branchSelect.selectedIndex].text
        }, Yıl: ${year}`,
        hAxis: { title: "Aylar" },
        vAxis: { title: "Kâr (TL)" },
        legend: "none",
        bar: { groupWidth: "70%" },
      };

      const chart = new google.visualization.ColumnChart(chartDiv);
      chart.draw(google.visualization.arrayToDataTable(chartData), options);
    } catch (err) {
      console.error("Aylık kâr grafiği yüklenemedi:", err);
    }
  }

  // İkinci Grafik: Şubelerin Yıllık Kâr Grafiği
  async function drawAllBranchesChart(year) {
    try {
      const response = await fetch(`/subeler/yearly-profit?year=${year}`);
      const data = await response.json();

      if (data.length === 0) {
        alert("Seçilen yıl için şubelerin kâr verisi bulunamadı.");
        return;
      }

      const chartData = [["Şube", "Kâr"]];
      data.forEach((row) => {
        chartData.push([row.sube, row.toplam_kar]);
      });

      const options = {
        title: `Şubelerin Yıllık Toplam Kârı (${year})`,
        hAxis: { title: "Şubeler" },
        vAxis: { title: "Kâr (TL)" },
        legend: "none",
        bar: { groupWidth: "70%" },
      };

      const chart = new google.visualization.ColumnChart(allBranchesChartDiv);
      chart.draw(google.visualization.arrayToDataTable(chartData), options);
    } catch (err) {
      console.error("Şubelerin yıllık toplam kâr grafiği yüklenemedi:", err);
    }
  }

  // Şubeleri yükle ve ilk grafik butonu için tetikleyici ekle
  loadBranches();
  generateChartButton.addEventListener("click", () => {
    const year = yearSelect.value;
    const branchId = branchSelect.value;
    drawMonthlyProfitChart(year, branchId);
  });

  // İkinci grafik butonu için tetikleyici ekle
  generateAllBranchesChartButton.addEventListener("click", () => {
    const year = yearSelect.value;
    drawAllBranchesChart(year);
  });
});
