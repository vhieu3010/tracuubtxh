const modal = document.querySelector('.modal');
const loading = document.querySelector('.lds-ring');
const overlay = document.querySelector('.overlay');
const dataTable1 = document.querySelector('.table__body-1');
const dataTable2 = document.querySelector('.table__body-2');
const dataTable3 = document.querySelector('.table__body-3');
const tHead = document.querySelector('.table__head tr');
const tableContainer = document.querySelector('.table__container');
const messageNoData = document.querySelector('.no-data');
const btnCloseModal = document.querySelector('.modal__btn-close');

btnCloseModal.addEventListener('click', () => {
  modal.classList.remove('show');
  overlay.classList.remove('show');
  document.body.style.overflow = 'visible';
});

window.addEventListener('keydown', (e) => {
  if (modal.classList.contains('show')) {
    if (e.keyCode === 27) {
      modal.classList.remove('show');
      overlay.classList.remove('show');
      document.body.style.overflow = 'visible';
    }
  }
});

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

      const totalBtxhAndNcc = data.data.filter((obj) => {
        if (obj.nhomHuong && obj.nguoiCoCong) return obj;
      }).length;

      const totalOnlyBtxh = data.data.filter((obj) => {
        if (obj.nhomHuong && !obj.nguoiCoCong) return obj;
      }).length;

      const totalOnlyNcc = data.data.filter((obj) => {
        if (!obj.nhomHuong && obj.nguoiCoCong) return obj;
      }).length;

      const totalAll = totalBtxhAndNcc + totalOnlyBtxh + totalOnlyNcc;

      const percentBtxhAndNcc = (totalBtxhAndNcc / totalAll) * 100;
      const percentOnlyBtxh = (totalOnlyBtxh / totalAll) * 100;
      const percentOnlyNcc = (totalOnlyNcc / totalAll) * 100;

      const listNhomDoiTuong = [
        {
          name: 'Nhóm đối tượng có NCC và BTXH',
          total: totalBtxhAndNcc,
          percent: percentBtxhAndNcc,
        },
        {
          name: 'Nhóm đối tượng chỉ có BTXH',
          total: totalOnlyBtxh,
          percent: percentOnlyBtxh,
        },
        {
          name: 'Nhóm đối tượng chỉ có NCC',
          total: totalOnlyNcc,
          percent: percentOnlyNcc,
        },
      ];

      renderChartNhomDoiTuong(listNhomDoiTuong);
      renderTableNhomDoiTuong(listNhomDoiTuong);
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

  let totalCount = 0;
  const percentages = {};
  const quantities = {};

  for (const value in percentageMap) {
    const count = percentageMap[value];

    totalCount += count;
  }

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
      onClick: function (evt, item) {
        if (item.length > 0) {
          let index = item[0].index;
          let label = this.data.labels[index];

          const tableUser = document.querySelector(
            '.statistical__table-user-1'
          );

          tableUser.classList.add('show');

          renderListUser('btxh', label, dataTable1);
        }
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
      onClick: function (evt, item) {
        if (item.length > 0) {
          let index = item[0].index;
          let label = this.data.labels[index];

          const tableUser = document.querySelector(
            '.statistical__table-user-2'
          );

          tableUser.classList.add('show');

          renderListUser('ncc', label, dataTable2);
        }
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

function renderChartNhomDoiTuong(array) {
  const randomColor = generateRandomColors(array.length);

  const dataChart = {
    labels: array.map((obj) => obj.name),
    datasets: [
      {
        label: 'Tỉ lệ',
        data: array.map((obj) => obj.percent),
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
      onClick: function (evt, item) {
        if (item.length > 0) {
          let index = item[0].index;
          let label = this.data.labels[index];

          const tableUser = document.querySelector(
            '.statistical__table-user-3'
          );

          let field = '';

          console.log(label);

          if (label === 'Nhóm đối tượng có NCC và BTXH') field = 'btxh-ncc';
          if (label === 'Nhóm đối tượng chỉ có BTXH') field = 'only-btxh';
          if (label === 'Nhóm đối tượng chỉ có NCC') field = 'only-ncc';

          console.log(field);
          tableUser.classList.add('show');

          renderListUser(field, 'true', dataTable3);
        }
      },
    },
  };

  const ctx = document.getElementById('chart-3');

  new Chart(ctx, config);
}

function renderTableNhomDoiTuong(array) {
  const tableBody = document.querySelector('#statistical-tBody-3');

  const html = array
    .map(
      (obj) => `
        <div class="statistical__table-row" style="padding: 0.8rem 0">
          <p style="text-align: start">${obj.name}</p>
          <p style="font-weight: 600">${obj.total}</p>
        </div>
  `
    )
    .join('');

  tableBody.innerHTML = html;

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

function renderListUser(field, filterTerm, table) {
  handleLoading();

  fetch(`/users/filter?${field}=${filterTerm}`)
    .then((res) => res.json())
    .then((data) => {
      let html = '';

      data.data.forEach((item, index) => {
        html += `
              <tr>
                  <td style="text-align: center; font-weight: 600;">${
                    index + 1
                  }</td>
                  <td style="white-space: nowrap;">${item.ten}</td>
                  <td>${item.dienThoai}</td>
                  <td>${item.ngaySinh}</td>
                  <td>${item.diaChi}</td>
                  <td style="text-align: center;"><a href="#!" data-id="${
                    item._id
                  }" class="table__btn-detail">Xem</a></td>
              </tr>`;
      });

      table.innerHTML = html;

      loading.classList.remove('show');
      overlay.classList.remove('show');

      const detailBtn = document.querySelectorAll('.table__btn-detail');

      handleWatchDetail(detailBtn);
    })
    .catch((err) => {
      loading.classList.remove('show');
      overlay.classList.remove('show');
    });
}

const handleWatchDetail = (array) => {
  array.forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-id');

      fetch(`/users/${id}`)
        .then((res) => res.json())
        .then((data) => {
          const {
            ten,
            ngaySinh,
            cccd,
            bhxh,
            cheDoHuong,
            diaChi,
            diaChiDangKy,
            dienThoai,
            ghiChu,
            mucBTXH,
            mucNCC,
            nguoiCoCong,
            nhomHuong,
            toDanPho,
          } = data.data;

          let modelInfo = document.querySelector('.modal__info');
          modelInfo.innerHTML = `
                <div class="modal__group">
                  <p class="modal__label">Tên</p>
                    <p class="modal__text">${ten}</p>
                </div>
                <div class="modal__group">
                    <p class="modal__label">SĐT</p>
                    <p class="modal__text">${dienThoai}</p>
                </div>
                <div class="modal__group">
                    <p class="modal__label">Ngày sinh</p>
                    <p class="modal__text">${ngaySinh}</p>
                </div>
                <div class="modal__group">
                    <p class="modal__label">Tổ dân phố</p>
                    <p class="modal__text">${toDanPho}</p>
                </div>
                <div class="modal__group">
                    <p class="modal__label">Địa chỉ đăng ký HKTT</p>
                    <p class="modal__text">${diaChiDangKy}</p>
                </div>
                <div class="modal__group">
                    <p class="modal__label">Địa chỉ hiện nay</p>
                    <p class="modal__text">${diaChi}</p>
                </div>
                <div class="modal__group">
                    <p class="modal__label">Số CCCD</p>
                    <p class="modal__text">${cccd}</p>
                </div>
                <div class="modal__group">
                    <p class="modal__label">Chế độ hưởng</p>
                    <p class="modal__text">${cheDoHuong}</p>
                </div>
                <div class="modal__group">
                    <p class="modal__label">BHXH</p>
                    <p class="modal__text">${bhxh}</p>
                </div>
                <div class="modal__group">
                    <p class="modal__label">Nhóm hưởng BTXH</p>
                    <p class="modal__text">${nhomHuong}</p>
                </div>
                <div class="modal__group">
                    <p class="modal__label">Mức trợ cấp BTXH</p>
                    <ul class="modal__note">
                        ${mucBTXH.map((value) => `<li>${value}</li>`).join('')}
                    </ul>
                </div>
                <div class="modal__group">
                    <p class="modal__label">Đối tượng chính sách NCC</p>
                    <p class="modal__text">${nguoiCoCong}</p>
                </div>
                <div class="modal__group">
                    <p class="modal__label">Mức trợ cấp NCC</p>
                    <ul class="modal__note">
                        ${mucNCC.map((value) => `<li>${value}</li>`).join('')}
                    </ul>
                </div>
                <div class="modal__group">
                    <p class="modal__label">Ghi chú</p>
                    <ul class="modal__note">
                      ${ghiChu.map((value) => `<li>${value}</li>`).join('')}
                    </ul>
                </div>
          `;

          modal.classList.add('show');
          overlay.classList.add('show');
          document.body.style.overflow = 'hidden';
        });
    });
  });
};

// Handle loading
function handleLoading() {
  loading.classList.add('show');
  overlay.classList.add('show');
}
