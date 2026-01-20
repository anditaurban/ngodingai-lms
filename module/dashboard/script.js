window.chartType = 'bar';
pad = n => n.toString().padStart(2, '0');
yearInput = document.getElementById("selectYear");
monthSelect = document.getElementById("selectMonth");
yearInput.min = 2024;
yearInput.max = currentYear;
yearInput.value = currentYear; 

sallaryAldi = 1310000;
sallaryFira = 1310000;
sallaryBintang = 1310000;
sallaryTri = 1565000;
sallaryJefry = 1345000; 
alokasiLembur = 1500000;
Listrik = 1000000;
Internet = 300000;
iuranRuko = 130000;
sewaRuko = 1250000;
sampah = 30000;
kebersihan = 100000;
marketing = 500000;

expenses = [
  sallaryAldi,
  sallaryFira,
  sallaryBintang,
  sallaryTri,
  sallaryJefry,
  alokasiLembur,
  Listrik,
  Internet,
  iuranRuko,
  sewaRuko,
  sampah,
  kebersihan,
  marketing
];

// 👁️ Toggle Saldo Visibility
toggleBalanceBtn = document.getElementById('toggleBalance');
balanceEl = document.getElementById('balanceAmount');
stockAmount = document.getElementById('totalStockAmount');
receiveableAmount = document.getElementById('total_receivable');
payableAmount = document.getElementById('total_payable');

if (toggleBalanceBtn) {
  toggleBalanceBtn.addEventListener('click', () => {
    [balanceEl, stockAmount, receiveableAmount, payableAmount].forEach(el => {
      const isHidden = el.textContent.includes('---');
      const value = el.dataset.original;
      el.textContent = isHidden ? formatNominal(value) : '---';
    });
  });
}

yearInput.addEventListener("change", () => {
  const selectedYear = parseInt(yearInput.value, 10);
  filterMonthOptions(selectedYear);
});

function filterMonthOptions(selectedYear) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() = 0-11

  const options = monthSelect.querySelectorAll("option");

  options.forEach(option => {
    const monthValue = parseInt(option.value, 10);
    if (selectedYear === currentYear) {
      option.disabled = monthValue > currentMonth;
      // reset bulan jika bulan aktif melebihi bulan sekarang
      if (monthValue > currentMonth && monthSelect.value === option.value) {
        monthSelect.value = String(currentMonth).padStart(2, '0');
      }
    } else {
      option.disabled = false;
    }
  });
}

function updateSelectors() {
  document.getElementById('selectMonth').value = pad(currentMonth);
  document.getElementById('selectYear').value = currentYear;
}

function handlePeriodChange() {
  const month = document.getElementById('selectMonth').value;
  const year = document.getElementById('selectYear').value;
  // window.chartType = document.getElementById('chartTypeSelector').value;
  currentMonth = parseInt(month);
  currentYear = parseInt(year);
  loadDashboardSummary(month, year);
  loadSalesGraph(month, year);
  loadTopData(1, 1, month, year);
  filterMonthOptions(currentYear);
}

function getDaysInMonth(month, year) {
  const today = new Date();
  const targetMonth = parseInt(month); // 1-12
  const targetYear = parseInt(year);

  // Jika bulan dan tahun sekarang
  if (today.getFullYear() === targetYear && (today.getMonth() + 1) === targetMonth) {
    return today.getDate(); // jumlah hari berjalan
  }

  // Jika bulan sudah lewat → return total hari bulan itu
  if (today.getFullYear() > targetYear || (today.getFullYear() === targetYear && (today.getMonth() + 1) > targetMonth)) {
    return new Date(targetYear, targetMonth, 0).getDate();
  }

  // Jika bulan belum berjalan → return 0
  return 0;
}

function getQtyDaysInMonth(month, year){
  return new Date(year, month, 0).getDate();
}

async function loadDashboardSummary(month, year) {
  try {
    const res = await fetch(`${baseUrl}/summary/sales/${owner_id}/${month}/${year}`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    const data = (await res.json())?.summary || {};
    const avgTransactions = data.total_transaksi/getDaysInMonth(month, year);
    const avgPurchase = data.total_penjualan/data.total_transaksi;
    document.getElementById('totalTransactions').textContent = formatNominal(data.total_transaksi || 0);
    document.getElementById('avgTransactions').textContent = `${Math.ceil(avgTransactions || 0)} Trx /day`;
    document.getElementById('avgPurchase').textContent = `${formatRupiah(avgPurchase || 0)} /Trx`;
    // document.getElementById('avgDailyTransactions').textContent = `${formatRupiah(avgPurchase*avgTransactions)} /Trx`;

    const avgItemsSold = data.total_item/getDaysInMonth(month, year);
    const avgPriceSold = data.total_penjualan/data.total_item;
    document.getElementById('totalItemsSold').textContent = formatNominal(data.total_item || 0);
    document.getElementById('avgItemsSold').textContent = `${Math.ceil(avgItemsSold || 0)} Item /day`;
    document.getElementById('avgPriceSold').textContent = `${formatRupiah(avgPriceSold || 0)} /Item`;
    // document.getElementById('avgDailyItemsSold').textContent = `${formatRupiah(avgPriceSold*avgItemsSold)} /Trx`;

    document.getElementById('totalSales').textContent = formatNominal(data.total_penjualan || 0);
    document.getElementById('targetSales').textContent = formatRupiah(data.target_omzet || 0);
    // document.getElementById('targetDaily').textContent = formatRupiah(data.target_daily);
    // document.getElementById('avgDailySales').textContent = `${formatRupiah(data.total_penjualan/getDaysInMonth(month, year))}`;
    document.getElementById('targetAchieve').textContent = ((data.target_achieve || 0)).toFixed(1) + '%';

    document.getElementById('totalProfit').textContent = formatNominal(data.total_profit || 0);
    document.getElementById('percentMargin').textContent = ((data.percent_margin || 0)).toFixed(1) + '%';
    document.getElementById('totalCost').textContent = formatRupiah(data.cost || 0);
    const totalLossEl = document.getElementById('totalLoss');
    const loss = (data.total_profit - data.cost) || 0;
    totalLossEl.textContent = formatRupiah(loss);
    totalLossEl.classList.toggle('text-red-500', loss < 0);
    totalLossEl.classList.toggle('text-green-500', loss >= 0);

    document.getElementById('totalBallance').textContent = formatNominal(data.balance || 0);
    document.getElementById('totalIncome').textContent = formatRupiah(data.total_income || 0);
    document.getElementById('totalOutcome').textContent = formatRupiah(data.total_expense || 0);
  } catch (err) { console.error('Gagal summary:', err); }

    try {
    const res = await fetch(`${baseUrl}/summary/cashflow/${owner_id}`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    const { summaryData } = await res.json();
    // document.getElementById('balanceAmount').textContent = formatNominal(summaryData.balance);
    balanceEl.dataset.original = summaryData.balance;
    balanceEl.textContent = '---';

    // document.getElementById('total_receivable').textContent = formatNominal(summaryData.total_receivable);
    receiveableAmount.dataset.original = summaryData.total_receivable;
    receiveableAmount.textContent = '---';
    document.getElementById('trx_receivable').textContent = `${formatNominal(summaryData.trx_receivable)} Unpaid`;
    document.getElementById('trx_receivable_overdue').textContent = `${formatNominal(summaryData.trx_receivable_overdue)} Overdue`;

    // document.getElementById('total_payable').textContent = formatNominal(summaryData.total_payable);
    payableAmount.dataset.original = summaryData.total_payable;
    payableAmount.textContent = '---';
    document.getElementById('trx_payable').textContent = `${formatNominal(summaryData.trx_payable)} Unpaid`;
    document.getElementById('trx_payable_overdue').textContent = `${formatNominal(summaryData.trx_payable_overdue)} Overdue`;

    // document.getElementById('totalStockAmount').textContent = formatNominal(summaryData.stock_value);
    stockAmount.dataset.original = summaryData.stock_value;
    stockAmount.textContent = '---';
  } catch (err) { console.error('Gagal summary:', err); }

}

async function loadSalesGraph(month, year) {
  totalOperational = expenses.reduce((sum, val) => sum + val, 0);
  midProfit = Math.ceil(((1.2*totalOperational)/getQtyDaysInMonth(month, year))); //minimum profit harian
  margin = 0.35;
  targetOmzet = 46600000
  targetDaily = (targetOmzet/getQtyDaysInMonth(month, year))

  const endpoint = `${baseUrl}/graph/sales/${owner_id}/${month}/${year}`;
  const loader = document.getElementById('chartLoader');
  const chartCanvas = document.getElementById('salesChart');
  try {
    loader.classList.remove('hidden');
    chartCanvas.classList.add('opacity-50');
    const res = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${API_TOKEN}` } });
    const { labels, omzet, profit } = await res.json();
    const valuesOmzet = omzet.map(v => parseInt(v) || 0);
    const valuesProfit = profit.map(v => parseInt(v) || 0);
    if (window.salesChartInstance) window.salesChartInstance.destroy();
    const ctx = chartCanvas.getContext('2d');
    // const avgOmzet = Math.round(valuesOmzet.reduce((a, b) => a + b, 0) / (valuesOmzet.length || 1));
    const avgOmzet = Math.round(valuesOmzet.reduce((a, b) => a + b, 0)/getDaysInMonth(month, year));
    const avgProfit = Math.round(valuesProfit.reduce((a, b) => a + b, 0)/getDaysInMonth(month, year));
    window.salesChartInstance = new Chart(ctx, {
      type: chartType,
      data: {
        labels,
        datasets: [
          { label: 'Profit', data: valuesProfit, backgroundColor: 'rgba(255,99,132,0.7)', borderColor: 'rgb(255,99,132)', borderWidth: 1, tension: 0.4, yAxisID: 'y', type: chartType },
          { label: `Avg.Profit`, data: new Array(labels.length).fill(Math.round(valuesProfit.reduce((a,b)=>a+b,0)/(valuesProfit.length||1))), borderColor: 'palevioletred', borderWidth: 2, pointRadius: 0, fill: false, type: 'line', borderDash: [2,2], yAxisID: 'y' },
          { label: `Target Profit`, data: new Array(labels.length).fill(midProfit), borderColor: 'palevioletred', borderWidth: 1, pointRadius: 0, fill: false, type: 'line', yAxisID: 'y' },
          { label: 'Omzet', data: valuesOmzet, backgroundColor: 'rgba(75,192,192,0.7)', borderColor: 'rgb(75,192,192)', borderWidth: 1, tension: 0.4, yAxisID: 'y', type: 'line', fill: true },
          { label: `Avg.Omzet`, data: new Array(labels.length).fill(avgOmzet), borderColor: 'skyblue', borderWidth: 2, pointRadius: 0, fill: false, type: 'line', borderDash: [2,2], yAxisID: 'y' },
          { label: `Target Omzet`, data: new Array(labels.length).fill(targetDaily), borderColor: 'skyblue', borderWidth: 1, pointRadius: 0, fill: false, type: 'line', yAxisID: 'y' },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: `Omzet & Profit - ${month}/${year}` },
          tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${formatNominal(ctx.raw)}` } },
          legend: { display: true }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: v => formatNominal(v/1000) }
          }
        }
      }
    });
  } catch (err) { console.error('Gagal grafik:', err); }
  finally {
    loader.classList.add('hidden');
    chartCanvas.classList.remove('opacity-50');
  }
}

async function loadTopData(pageProduct = currentPageProduct, pageCustomer = currentPageCustomer, month = currentMonth, year = currentYear) {
  try {
    const endpointProduct = `${baseUrl}/best/product/${owner_id}/${pageProduct}/${month}/${year}`;
    const endpointCustomer = `${baseUrl}/best/customer/${owner_id}/${pageCustomer}/${month}/${year}`;

    const [resProduct, resCustomer] = await Promise.all([
      fetch(endpointProduct, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }),
      fetch(endpointCustomer, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })
    ]);

    const productResult = await resProduct.json();
    const customerResult = await resCustomer.json();

    const products = productResult?.tableData || [];
    const customers = customerResult?.tableData || [];

    const productContainer = document.getElementById('topProductsContainer');
    const customerContainer = document.getElementById('topCustomersContainer');

    productContainer.innerHTML = '';
    customerContainer.innerHTML = '';

    // Produk
    if (products.length === 0) {
      productContainer.innerHTML = '<p class="text-gray-500 text-sm">Tidak ada data produk.</p>';
    } else {
      products.slice(0, 5).forEach((item) => {
        const html = `
          <div class="flex justify-between items-center bg-white p-3 rounded-xl shadow text-sm mb-2">
            <div class="flex items-center space-x-3">
              <img src="${item.picture}" alt="${item.product}" class="w-10 h-10 object-cover rounded" />
              <div>
                <div class="font-semibold">${item.product}</div>
                <div class="text-xs text-gray-500">Kode: ${item.productcode}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-blue-600 font-semibold">${parseInt(item.total_item_sales).toLocaleString('id-ID')}</div>
              <div class="text-green-600 text-xs">${formatNominal(item.total_item_omzet)}</div>
            </div>
          </div>
        `;
        productContainer.insertAdjacentHTML('beforeend', html);
      });
    }

    // Customer
    if (customers.length === 0) {
      customerContainer.innerHTML = '<p class="text-gray-500 text-sm">Tidak ada data customer.</p>';
    } else {
      customers.slice(0, 5).forEach((item) => {
        const html = `
          <div class="flex justify-between items-center bg-white p-3 rounded-xl shadow text-sm mb-2">
            <div>
              <div class="font-semibold">${item.nama}</div>
              <div class="text-xs text-gray-500">Transaksi: ${item.trx_count}</div>
            </div>
            <div class="text-right">
              <div class="text-blue-600 font-semibold">${formatNominal(item.total_amount)}</div>
              <div class="text-green-600 text-xs">Avg ${formatNominal(item.total_amount / item.trx_count)}/trx</div>
            </div>
          </div>
        `;
        customerContainer.insertAdjacentHTML('beforeend', html);
      });
    }

    // Navigasi
    const isLastProductPage = productResult.totalPages ? pageProduct >= productResult.totalPages : products.length < 10;
    const isLastCustomerPage = customerResult.totalPages ? pageCustomer >= customerResult.totalPages : customers.length < 10;
    const isLastPage = isLastProductPage && isLastCustomerPage;

    document.getElementById('prevPageBtnProduct')?.classList.toggle('hidden', pageProduct <= 1);
    document.getElementById('nextPageBtnProduct')?.classList.toggle('hidden', isLastProductPage);

    document.getElementById('prevPageBtnCust')?.classList.toggle('hidden', pageCustomer <= 1);
    document.getElementById('nextPageBtnCust')?.classList.toggle('hidden', isLastCustomerPage);

  } catch (error) {
    console.error('Gagal memuat top produk & customer:', error);
  }
}

// function handleNextPage(type) {
//   if (type === 'product') currentPageProduct++;
//   if (type === 'customer') currentPageCustomer++;
//   loadTopData(currentPageProduct, currentPageCustomer);
// }

// function handlePrevPage(type) {
//   if (type === 'product' && currentPageProduct > 1) currentPageProduct--;
//   if (type === 'customer' && currentPageCustomer > 1) currentPageCustomer--;
//   loadTopData(currentPageProduct, currentPageCustomer);
// }

updateSelectors();
handlePeriodChange();

// === SIMULASI DATA JSON ===
function generateTrafficData(days = 30) {
    const data = [];
    const hours = Array.from({ length: 16 }, (_, i) => i + 7); // Jam 07-22
    const startDate = new Date(2025, 7, 1); // Agustus 2025

    for (let day = 0; day < days; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);
        const dateStr = currentDate.toISOString().split("T")[0];

        const traffic = hours.map(hour => {
            let visitors;
            if (hour < 10) {
                visitors = Math.floor(Math.random() * 15) + 5;
            } else if (hour < 14) {
                visitors = Math.floor(Math.random() * 25) + 15;
            } else if (hour < 17) {
                visitors = Math.floor(Math.random() * 30) + 20;
            } else {
                visitors = Math.floor(Math.random() * 40) + 30;
            }
            return { hour, visitors };
        });

        data.push({ date: dateStr, traffic });
    }
    return data;
}

 trafficData = generateTrafficData(30);

// === ELEMENT HTML ===
 showMonthCheckbox = document.getElementById('showMonth');
 dateSelect = document.getElementById('dateSelect');
 labelSelect = document.getElementById('labelSelect');
 ctx = document.getElementById('trafficChart').getContext('2d');

// === INISIALISASI CHART ===
trafficChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Pengunjung',
            data: [],
            borderColor: '#A3C4F3', // pastel biru
            backgroundColor: '#A3C4F3', // untuk titik atau fill
            fill: false,
            tension: 0.3 // biar garis agak melengkung halus
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    }
});


// === FUNGSI UPDATE SELECT ===
function populateDateSelect() {
    dateSelect.innerHTML = "";
    trafficData.forEach(entry => {
        const opt = document.createElement('option');
        opt.value = entry.date;
        opt.textContent = entry.date;
        dateSelect.appendChild(opt);
    });
}

function populateMonthSelect() {
    dateSelect.innerHTML = "";
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    months.forEach((month, idx) => {
        const opt = document.createElement('option');
        opt.value = idx + 1;
        opt.textContent = month;
        dateSelect.appendChild(opt);
    });
}

// === FUNGSI UPDATE CHART ===
function updateChart() {
    if (showMonthCheckbox.checked) {
        // Mode Bulanan
        const selectedMonth = parseInt(dateSelect.value, 10);
        const filtered = trafficData.filter(entry => {
            const month = new Date(entry.date).getMonth() + 1;
            return month === selectedMonth;
        });

        const hours = Array.from({ length: 16 }, (_, i) => i + 7);
        const totalPerHour = hours.map(h => {
            return filtered.reduce((sum, entry) => {
                const hourData = entry.traffic.find(t => t.hour === h);
                return sum + (hourData ? hourData.visitors : 0);
            }, 0);
        });

        trafficChart.data.labels = hours.map(h => `${h}:00`);
        trafficChart.data.datasets[0].data = totalPerHour;
        trafficChart.data.datasets[0].label = `Total Pengunjung Bulan ${dateSelect.options[dateSelect.selectedIndex].text}`;
    } else {
        // Mode Harian
        const selectedDate = dateSelect.value;
        const entry = trafficData.find(e => e.date === selectedDate);
        trafficChart.data.labels = entry.traffic.map(t => `${t.hour}:00`);
        trafficChart.data.datasets[0].data = entry.traffic.map(t => t.visitors);
        trafficChart.data.datasets[0].label = `Pengunjung Tanggal ${selectedDate}`;
    }

    trafficChart.update();
}

// === EVENT LISTENER ===
showMonthCheckbox.addEventListener('change', () => {
    if (showMonthCheckbox.checked) {
        labelSelect.textContent = "Pilih Bulan:";
        populateMonthSelect();
    } else {
        labelSelect.textContent = "Pilih Tanggal:";
        populateDateSelect();
    }
    updateChart();
});

dateSelect.addEventListener('change', updateChart);

// === INIT ===
populateDateSelect();
updateChart();