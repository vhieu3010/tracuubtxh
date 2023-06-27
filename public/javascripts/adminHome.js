const btnDetails = document.querySelectorAll('.table__btn-detail');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.modal__btn-cancel');
const loading = document.querySelector('.lds-ring');
const moreBtn = document.querySelector('.more-btn');
const selectSearch = document.querySelector('.filter__select');
const btnCreate = document.querySelector('.filter__btn-add');
const tHead = document.querySelector('.table__head tr');
const tableContainer = document.querySelector('.table__container');
const exportBtn = document.getElementById('export-btn');
const messageNoData = document.querySelector('.no-data');

let valueSelect = selectSearch.value;

selectSearch.addEventListener(
  'click',
  () => (valueSelect = selectSearch.value)
);

btnCreate.addEventListener('click', () => {
  if (valueSelect === 'list-user') window.location.href = '/admin-create';
  if (valueSelect === 'account-user') window.location.href = '/admin-account';
});

btnCloseModal.addEventListener('click', () => {
  modal.classList.remove('show');
  overlay.classList.remove('show');
});

// Handle render table when click button search
const inputSearch = document.querySelector('.filter__search');
inputSearch.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    if (valueSelect === 'list-user') renderListUser();
    if (valueSelect === 'account-user') renderListAccount();
  }
});

tableContainer.style.padding = '0';

const searchBtn = document.querySelector('.filter__btn-search');
searchBtn.addEventListener('click', () => {
  tableContainer.style.padding = '24px';

  if (valueSelect === 'list-user') renderListUser();
  if (valueSelect === 'account-user') renderListAccount();
});

moreBtn.classList.add('display-none');

const renderListUser = () => {
  const tHeadRow = document.querySelector('.table__head');

  tHeadRow.innerHTML = `
    <tr style="border-bottom: 2px solid #333">
      <th style="text-align: center">STT</th>
      <th>Tên</th>
      <th>SDT</th>
      <th>Ngày sinh</th>
      <th>Địa chỉ</th>
      <th style="text-align: center">Sửa</th>
      <th style="text-align: center">Xoá</th>
    </tr>
  `;

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
              <td style="text-align: center;"><a href="#!" style="color: blue;" data-id="${
                item._id
              }" class="table__btn-edit"><i class="fa-solid fa-pen-to-square"></i></a></td>
              <td style="text-align: center;"><a href="#!" style="color: red;" data-id="${
                item._id
              }" class="table__btn-remove"><i class="fa-solid fa-trash"></i></a></td>
          </tr>`;
      });
      dataTable.innerHTML = html;

      moreBtn.classList.remove('display-none');

      loading.classList.remove('show');
      overlay.classList.remove('show');

      const editBtn = document.querySelectorAll('.table__btn-edit');
      const removeBtn = document.querySelectorAll('.table__btn-remove');

      handleEditUser(editBtn);
      handleRemoveUser(removeBtn);
    });
};

const renderListAccount = () => {
  moreBtn.classList.add('display-none');
  messageNoData.classList.add('display-none');
  const tHeadRow = document.querySelector('.table__head');

  tHeadRow.innerHTML = `
    <tr style="border-bottom: 2px solid #333">
      <th style="text-align: center;">STT</th>
      <th>Email</th>
      <th>Role</th>
      <th style="text-align: center;">Xoá</th>
    </tr>
  `;

  const searchTerm = document.querySelector('.filter__search').value;
  handleLoading();

  fetch(`/search?q=${searchTerm}`)
    .then((res) => res.json())
    .then((data) => {
      const dataTable = document.querySelector('.table__body');

      let html = '';

      data.data.forEach((item, index) => {
        html += `
          <tr>
              <td style="text-align: center; font-weight: 600;">${
                index + 1
              }</td>
              <td style="white-space: nowrap;">${item.email}</td>
              <td>${item.isAdmin ? 'Admin' : 'User'}</td>
              <td style="text-align: center;">
                <a href="#!" style="color: red;" data-id="${
                  item._id
                }" class="table__btn-remove">
                  <i class="fa-solid fa-trash"></i>
                </a>
              </td>
          </tr>`;
      });
      dataTable.innerHTML = html;

      loading.classList.remove('show');
      overlay.classList.remove('show');

      const editBtn = document.querySelectorAll('.table__btn-edit');
      const removeBtn = document.querySelectorAll('.table__btn-remove');

      handleEditAccount(editBtn);
      handleRemoveAccount(removeBtn);
    });
};

// Handle export data to excel file method
function exportData(data) {
  let filename = 'bang-tong-hop-tracuubtxhncc.xlsx';
  let newData = data.map(function (obj) {
    var newObj = {};
    Object.keys(obj).forEach(function (key) {
      if (key !== '_id') {
        if (Array.isArray(obj[key])) {
          newObj[key] = obj[key].join(', ');
        } else {
          newObj[key] = obj[key];
        }
      }
    });
    return newObj;
  });
  let ws = XLSX.utils.json_to_sheet(newData);
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'People');
  let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  let blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
  let href = URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = href;
  a.download = filename;
  a.click();
}

function s2ab(s) {
  let buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

exportBtn.onclick = () => {
  fetch(`/users`)
    .then((res) => res.json())
    .then((data) => {
      let check = confirm(
        'Bạn có thực sự muốn xuất dữ liệu thành file excel không!'
      );
      if (check) exportData(data.data);
    });
};

const handleEditUser = (array) => {
  array.forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-id');

      fetch(`/users/${id}`)
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem('userEdit', JSON.stringify(data.data));

          window.location.href = '/admin-update';
        });
    });
  });
};

const handleEditAccount = (array) => {
  array.forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-id');

      fetch(`/${id}`)
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem('accountEdit', JSON.stringify(data.data));

          window.location.href = '/admin-account';
        });
    });
  });
};

const handleRemoveUser = (array) => {
  array.forEach((item) => {
    item.addEventListener('click', () => {
      modal.classList.add('show');
      overlay.classList.add('show');

      const btnRemove = document.querySelector('.modal__btn-remove');

      btnRemove.addEventListener('click', () => {
        const id = item.getAttribute('data-id');

        fetch(`/users/${id}`, { method: 'delete' })
          .then((res) => res.text())
          .then((res) => console.log(res));

        item.parentElement.parentElement.classList.add('display-none');
        modal.classList.remove('show');
        overlay.classList.remove('show');
      });
    });
  });
};

const handleRemoveAccount = (array) => {
  array.forEach((item) => {
    item.addEventListener('click', () => {
      modal.classList.add('show');
      overlay.classList.add('show');

      const btnRemove = document.querySelector('.modal__btn-remove');

      btnRemove.addEventListener('click', () => {
        const id = item.getAttribute('data-id');

        fetch(`/${id}`, {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.text())
          .then((res) => console.log(res));

        item.parentElement.parentElement.classList.add('display-none');
        modal.classList.remove('show');
        overlay.classList.remove('show');
      });
    });
  });
};

// Handle loading
function handleLoading() {
  loading.classList.add('show');
  overlay.classList.add('show');
}

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
          <td style="text-align: center;"><a href="#!" style="color: blue;" data-id="${
            item._id
          }" class="table__btn-edit"><i class="fa-solid fa-pen-to-square"></i></a></td>
          <td style="text-align: center;"><a href="#!" style="color: red;" data-id="${
            item._id
          }" class="table__btn-remove"><i class="fa-solid fa-trash"></i></a></td>`;
          const tableRow = dataTable.appendChild(document.createElement('tr'));
          tableRow.innerHTML = html;
        });
      }

      loading.classList.remove('show');
      overlay.classList.remove('show');

      const editBtn = document.querySelectorAll('.table__btn-edit');
      const removeBtn = document.querySelectorAll('.table__btn-remove');

      handleEditUser(editBtn);
      handleRemoveUser(removeBtn);
    })
    .catch((err) => {
      loading.classList.remove('show');
      overlay.classList.remove('show');
    });
});

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
