const btnDetails = document.querySelectorAll('.table__btn-detail');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.modal__btn-cancel');
const loading = document.querySelector('.lds-ring');

btnCloseModal.addEventListener('click', () => {
  modal.classList.remove('show');
  overlay.classList.remove('show');
});

// Handle render table when click button search
const searchBtn = document.querySelector('.filter__btn-search');
searchBtn.addEventListener('click', () => {
  const searchTerm = document.querySelector('.filter__search').value;
  handleLoading();

  fetch(`/getAll?q=${searchTerm}`)
    .then((res) => res.json())
    .then((data) => {
      const dataTable = document.querySelector('.table__body');

      let html = '';

      data.data.forEach((item, index) => {
        html += `<tr>
              <td style="text-align: center;">${index + 1}</td>
              <td style="white-space: nowrap;">${item.ten}</td>
              <td>${item.dienThoai}</td>
              <td>${item.ngaySinh}</td>
              <td>${item.diaChi}</td>
              <td ><a href="#!" style="color: blue;" data-id="${
                item._id
              }" class="table__btn-edit"><i class="fa-solid fa-pen-to-square"></i></a></td>
              <td><a href="#!" style="color: red;" data-id="${
                item._id
              }" class="table__btn-remove"><i class="fa-solid fa-trash"></i></a></td>
          </tr>`;
      });
      dataTable.innerHTML = html;

      loading.classList.remove('show');
      overlay.classList.remove('show');

      const editBtn = document.querySelectorAll('.table__btn-edit');
      const removeBtn = document.querySelectorAll('.table__btn-remove');

      handleEditUser(editBtn);
      handleRemoveUser(removeBtn);
    });
});

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

const handleRemoveUser = (array) => {
  array.forEach((item) => {
    console.log(item);
    item.addEventListener('click', () => {
      modal.classList.add('show');
      overlay.classList.add('show');

      const btnRemove = document.querySelector('.modal__btn-remove');

      btnRemove.addEventListener('click', () => {
        const id = item.getAttribute('data-id');

        fetch(`/users/${id}`, { method: 'delete' })
          .then((res) => res.text())
          .then((res) => console.log(res));

        modal.classList.remove('show');
        overlay.classList.remove('show');
        location.reload();
      });
    });
  });
};

// Handle loading
function handleLoading() {
  loading.classList.add('show');
  overlay.classList.add('show');
}
