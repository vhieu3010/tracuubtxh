const btnDetails = document.querySelectorAll('.table__btn-detail');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.modal__btn-close');
const loading = document.querySelector('.lds-ring');
const moreBtn = document.querySelector('.more-btn');
const tHead = document.querySelector('.table__head tr');
const tableContainer = document.querySelector('.table__container');
const messageNoData = document.querySelector('.no-data');

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

// Handle render table when click button search
const inputSearch = document.querySelector('.filter__search');
inputSearch.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    renderListUser();
  }
});

tHead.style.borderBottom = '0';
tableContainer.style.padding = '0';

const searchBtn = document.querySelector('.filter__btn-search');
searchBtn.addEventListener('click', renderListUser);

function renderListUser() {
  const searchTerm = document.querySelector('.filter__search').value;
  handleLoading();

  fetch(`/users/search?q=${searchTerm}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.data.length >= 10) moreBtn.classList.remove('display-none');
      messageNoData.classList.add('display-none');
      const dataTable = document.querySelector('.table__body');

      let html = '';

      data.data.forEach((item, index) => {
        html += `<tr>
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
      dataTable.innerHTML = html;

      loading.classList.remove('show');
      overlay.classList.remove('show');

      tableContainer.style.padding = '24px';
      tHead.style.borderBottom = '2px solid #333';

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

// Handle show more
let page = 2;
moreBtn.addEventListener('click', () => {
  const searchTerm = document.querySelector('.filter__search').value;
  handleLoading();

  fetch(`/users/search?q=${searchTerm}&page=${page++}`)
    .then((res) => res.json())
    .then((data) => {
      const dataTable = document.querySelector('.table__body');
      let numberRow = document.querySelectorAll('.table__body tr').length;
      let html = '';
      if (data.data.length === 0) {
        moreBtn.classList.add('display-none');
      } else {
        if (data.data.length < 10) moreBtn.classList.add('display-none');
        data.data.forEach((item, index) => {
          html = `<td style="text-align: center; font-weight: 600;">${++numberRow}</td>
                <td style="white-space: nowrap;">${item.ten}</td>
                <td>${item.dienThoai}</td>
                <td>${item.ngaySinh}</td>
                <td>${item.diaChi}</td>
                <td style="text-align: center;"><a href="#!" data-id="${
                  item._id
                }" class="table__btn-detail">Xem</a></td>`;
          const tableRow = dataTable.appendChild(document.createElement('tr'));
          tableRow.innerHTML = html;
        });
      }

      loading.classList.remove('show');
      overlay.classList.remove('show');

      const detailBtn = document.querySelectorAll('.table__btn-detail');
      handleWatchDetail(detailBtn);
    })
    .catch((err) => {
      loading.classList.remove('show');
      overlay.classList.remove('show');
    });
});

// Handle loading
function handleLoading() {
  loading.classList.add('show');
  overlay.classList.add('show');
}

const main = document.querySelector('.main');
const header = document.querySelector('.header');
const filter = document.querySelector('.filter');
const table = document.querySelector('.table__wrapper');

window.addEventListener('scroll', function () {
  let scrollY = this.scrollY;

  if (scrollY >= 150) {
    main.classList.add('fixed');
    header.classList.add('fixed');
    filter.classList.add('fixed');
    table.classList.add('fixed');
  } else {
    main.classList.remove('fixed');
    header.classList.remove('fixed');
    filter.classList.remove('fixed');
    table.classList.remove('fixed');
  }
});
