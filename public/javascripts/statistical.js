const loading = document.querySelector('.lds-ring');
const overlay = document.querySelector('.overlay');

function fetchAPIUser() {
  loading.classList.add('show');
  overlay.classList.add('show');

  fetch('/users')
    .then((res) => res.json())
    .then((data) => {
      loading.classList.remove('show');
      overlay.classList.remove('show');

      const dataBtxh = data.data.map((obj) => obj.nhomHuong);

      const percentagesBtxh = filterDuplicates(dataBtxh).percentages;
      const quantitiesBtxh = filterDuplicates(dataBtxh).quantities;

      renderChartBTXH(percentagesBtxh);
      renderTableBTXH(quantitiesBtxh);

      const dataNcc = data.data.map((obj) => obj.nguoiCoCong);

      const percentagesNcc = filterDuplicates(dataNcc).percentages;
      const quantitiesNcc = filterDuplicates(dataNcc).quantities;

      renderChartNCC(percentagesNcc);
      renderTableNCC(quantitiesNcc);

      console.log(data.data);
    });
}

fetchAPIUser();

function filterDuplicates(arr) {
  const percentageMap = {};
  const decimalPlaces = 2;

  arr.forEach((value) => {
    if (value) {
      if (percentageMap[value]) {
        percentageMap[value]++;
      } else {
        percentageMap[value] = 1;
      }
    }
  });

  const totalCount = arr.length;
  const percentages = {};
  const quantities = {};

  for (const value in percentageMap) {
    const count = percentageMap[value];
    const percentage = ((count / totalCount) * 100).toFixed(decimalPlaces);
    percentages[value] = parseFloat(percentage);
    quantities[value] = count;
  }

  return { percentages, quantities };
}

function renderChartBTXH(percentages) {
  const randomColor = generateRandomColors(Object.keys(percentages).length);

  const dataChart = {
    labels: Object.keys(percentages),
    datasets: [
      {
        label: 'Nhóm hưởng BTXH',
        data: Object.values(percentages),
        backgroundColor: randomColor,
        hoverOffset: 4,
      },
    ],
  };

  const config = {
    type: 'doughnut',
    data: dataChart,
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'right',
        },
      },
    },
  };

  const ctx = document.getElementById('chart-1');

  new Chart(ctx, config);
}

function renderTableBTXH(quantities) {
  const tableBody = document.querySelector('#statistical-tBody-1');

  const sortedQuantities = Object.entries(quantities).sort(
    (a, b) => b[1] - a[1]
  );

  const html = sortedQuantities
    .map(
      (quantity) => `
      <div class="statistical__table-row">
        <p style="text-align: start">${quantity[0]}</p>
        <p style="font-weight: 600">${quantity[1]}</p>
      </div>
  `
    )
    .join('');

  tableBody.innerHTML = html;
}

function renderChartNCC(percentages) {
  const randomColor = generateRandomColors(Object.keys(percentages).length);

  const dataChart = {
    labels: Object.keys(percentages),
    datasets: [
      {
        label: 'Đối tượng người có công',
        data: Object.values(percentages),
        backgroundColor: randomColor,
        hoverOffset: 4,
      },
    ],
  };
  const config = {
    type: 'doughnut',
    data: dataChart,
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'right',
        },
      },
    },
  };
  const ctx = document.getElementById('chart-2');
  new Chart(ctx, config);
}

function renderTableNCC(quantities) {
  const tableBody = document.querySelector('#statistical-tBody-2');

  const sortedQuantities = Object.entries(quantities).sort(
    (a, b) => b[1] - a[1]
  );

  const html = sortedQuantities
    .map(
      (quantity) => `
        <div class="statistical__table-row">
          <p style="text-align: start">${quantity[0]}</p>
          <p style="font-weight: 600">${quantity[1]}</p>
        </div>
  `
    )
    .join('');

  tableBody.innerHTML = html;

  tableBody.style.height = '400px';
  tableBody.style.overlay = 'hidden';
}

function generateRandomColors(length) {
  let colors = [];
  for (let i = 0; i < length; i++) {
    let color = `hsl(${Math.random() * 360}, 100%, 75%)`;
    colors.push(color);
  }
  return colors;
}
