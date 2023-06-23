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

const btnCreate = document.querySelector('.form__btn-submit');

const btnRegister = document.querySelector('.form__btn-register');

if (btnRegister) {
  btnRegister.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.querySelector(
      '.form__register input[name="email"]'
    ).value;
    const password = document.querySelector(
      '.form__register input[name="password"]'
    ).value;
    let isAdmin = document.querySelector(
      '.form__register input[name="isAdmin"]:checked'
    ).value;

    isAdmin === 'admin' ? (isAdmin = true) : (isAdmin = false);

    fetch('/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        isAdmin: isAdmin,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const message = document.querySelector('.form_message');

        if (data.success) {
          window.location.href = '/admin';
        }
        message.innerHTML = data.message;
      });
  });
}
