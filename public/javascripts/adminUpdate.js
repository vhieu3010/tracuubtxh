const dataUser = JSON.parse(localStorage.getItem('userEdit'));

const {
  _id = '',
  ten = '',
  ngaySinh = '',
  cccd = '',
  bhxh = '',
  cheDoHuong = '',
  diaChi = '',
  diaChiDangKy = '',
  dienThoai = '',
  ghiChu = [],
  mucBTXH = [],
  mucNCC = [],
  nguoiCoCong = '',
  nhomHuong = '',
  toDanPho = '',
} = dataUser;

const tenInput = document.querySelector('input[name="ten"]');
const dienThoaiInput = document.querySelector('input[name="dienThoai"]');
const ngaySinhInput = document.querySelector('input[name="ngaySinh"]');
const toDanPhoInput = document.querySelector('input[name="toDanPho"]');
const diaChiDangKyInput = document.querySelector('input[name="diaChiDangKy"]');
const diaChiInput = document.querySelector('input[name="diaChi"]');
const cccdInput = document.querySelector('input[name="cccd"]');
const cheDoHuongInput = document.querySelector('input[name="cheDoHuong"]');
const bhxhInput = document.querySelector('input[name="bhxh"]');
const nhomHuongInput = document.querySelector('input[name="nhomHuong"]');
const mucBTXHInput = document.querySelector('input[name="mucBTXH"]');
const nguoiCoCongInput = document.querySelector('input[name="nguoiCoCong"]');
const mucNCCInput = document.querySelector('input[name="mucNCC"]');
const ghiChuInput = document.querySelector('input[name="ghiChu"]');

const dateString = ngaySinh;
const parts = dateString.split('/');
const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
const dateObj = new Date(formattedDate);

tenInput.value = ten;
dienThoaiInput.value = dienThoai;
ngaySinhInput.valueAsDate = dateObj;
toDanPhoInput.value = toDanPho;
diaChiDangKyInput.value = diaChiDangKy;
diaChiInput.value = diaChi;
cccdInput.value = cccd;
cheDoHuongInput.value = cheDoHuong;
nhomHuongInput.value = nhomHuong;
nguoiCoCongInput.value = nguoiCoCong;
mucBTXHInput.value = mucBTXH[0] ?? '';
mucNCCInput.value = mucNCC[0] ?? '';
ghiChuInput.value = ghiChu[0] ?? '';

if (bhxh === 'Có') bhxhInput.checked = true;

function createMultipleInputGroups(inputElement, dataArray) {
  const container = inputElement.parentElement.parentElement;
  const nameAttr = container.getAttribute('data-name');

  for (let i = 0; i < dataArray.length - 1; i++) {
    const item = container.appendChild(document.createElement('div'));
    item.className = 'form__multiple-input-group';

    item.innerHTML = `
      <input type="text" class="form__input" name="${nameAttr}" value="${
      dataArray[i + 1]
    }"/>
      <div class="form__multiple-input-action">
        <button type="button" class="form__btn-insert">Thêm</button>
        <button type="button" class="form__btn-remove">Xoá</button>
      </div>
    `;
  }
}

createMultipleInputGroups(mucBTXHInput, mucBTXH);
createMultipleInputGroups(mucNCCInput, mucNCC);
createMultipleInputGroups(ghiChuInput, ghiChu);

const btnUpdate = document.querySelector('.form__btn-update');

btnUpdate.addEventListener('click', () => {
  const parts = ngaySinhInput.value.split('-');
  const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

  const updatedData = {
    ten: tenInput.value,
    dienThoai: dienThoaiInput.value,
    ngaySinh: formattedDate,
    toDanPho: toDanPhoInput.value,
    diaChiDangKy: diaChiDangKyInput.value,
    diaChi: diaChiInput.value,
    cccd: cccdInput.value,
    cheDoHuong: cheDoHuongInput.value,
    nhomHuong: nhomHuongInput.value,
    nguoiCoCong: nguoiCoCongInput.value,
    mucBTXH: [
      mucBTXHInput.value,
      ...document.querySelectorAll('input[name="mucBTXH"]'),
    ]
      .map((input) => input.value)
      .filter(Boolean),
    mucNCC: [
      mucNCCInput.value,
      ...document.querySelectorAll('input[name="mucNCC"]'),
    ]
      .map((input) => input.value)
      .filter(Boolean),
    ghiChu: [
      ghiChuInput.value,
      ...document.querySelectorAll('input[name="ghiChu"]'),
    ]
      .map((input) => input.value)
      .filter(Boolean),
  };

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  };

  fetch(`/users/${_id}`, requestOptions)
    .then((res) => res.json())
    .then((data) => console.log(data));

  window.location.href = '/admin';
});

// handle insert
const btnInserts = document.querySelectorAll('.form__btn-insert');
const btnRemoves = document.querySelectorAll('.form__btn-remove');

function handleClickInsert(btnInsert) {
  btnInsert.addEventListener('click', (e) => {
    const formMultipleInput = e.target.closest('.form__multiple-input');
    const item = formMultipleInput.appendChild(document.createElement('div'));

    const nameAttr = formMultipleInput.getAttribute('data-name');

    item.className = 'form__multiple-input-group';

    item.innerHTML = `
      <input type="text" class="form__input" name="${nameAttr}" />
      <div class="form__multiple-input-action">
        <button type="button" class="form__btn-insert">Thêm</button>
        <button type="button" class="form__btn-remove">Xoá</button>
      </div>
    `;

    const btnInsertsNew = item.querySelectorAll('.form__btn-insert');
    const btnRemoveNew = item.querySelectorAll('.form__btn-remove');
    handleClickInsert(btnInsertsNew[btnInsertsNew.length - 1]);
    handleClickRemove(btnRemoveNew[btnRemoveNew.length - 1]);
  });
}

btnInserts.forEach((btnInsert) => {
  handleClickInsert(btnInsert);
});

function handleClickRemove(btnRemove) {
  btnRemove.addEventListener('click', (e) => {
    const formMultipleInput = e.target.closest('.form__multiple-input');
    formMultipleInput.removeChild(
      e.target.closest('.form__multiple-input-group')
    );
  });
}

btnRemoves.forEach((btnRemove) => {
  handleClickRemove(btnRemove);
});
