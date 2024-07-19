const todoItems = document.querySelector(".todo__items");
const empty = document.querySelector(".todo__empty");
const addBtn = document.querySelector(".todo__add");
const modal = document.querySelector(".modal");
const modalInput = document.querySelector(".modal .input");
const btnCancel = document.querySelector(".cancel");
const btnApply = document.querySelector(".apply");
const itemTemplate = document.querySelector(".todo__item-template");
const searchInput = document.querySelector(".header .input");
const select = document.querySelector(".select");
const switchTheme = document.querySelector(".header__btn");
const body = document.body;
const inputError = document.querySelector(".input__error");
const modalTitle = document.querySelector(".modal__title");

let todoArr = [];
let theme = "white";
getTodo();
getTheme();

addBtn.onclick = openModal;
btnCancel.onclick = closeModal;
switchTheme.onclick = toggleTheme;
select.onchange = filterTodo;
searchInput.oninput = searchTodo;

function openModal(todoText, id) {
  modal.classList.add("modal-open");
  if (id) {
    modalTitle.innerHTML = "Edit Note";
  } else {
    modalTitle.innerHTML = "New Note";
  }
  btnApply.onclick = function () {
    if (id) {
      todoText.innerHTML = modalInput.value;
      todoArr = todoArr.map((item) => {
        if (item.id == id) {
          item.text = modalInput.value;
        }
        return item;
      });
      saveTodo();
      closeModal();
      modalInput.value = "";
    } else {
      createTodo();
    }
  };
}

function closeModal() {
  modal.classList.remove("modal-open");
  btnApply.onclick = null;
  hideError();
}

function createTodo() {
  const text = modalInput.value;
  if (text.trim() != "") {
    const clone = itemTemplate.content.cloneNode(true);

    const checkboxBody = clone.querySelector(".checkbox__body");
    const checkboxInput = clone.querySelector(".checkbox__input");
    const checkbox = clone.querySelector(".checkbox");
    const deleteBtn = clone.querySelector(".todo__delete");
    const todoItem = clone.querySelector(".todo__item");
    const editBtn = clone.querySelector(".todo__edit");

    checkboxBody.innerHTML = text;

    const id = Date.now();
    todoArr.push({ text, complete: false, id });
    saveTodo();

    checkbox.onclick = function () {
      completeTodo(checkboxInput, id);
    };
    deleteBtn.onclick = function () {
      deleteTodo(todoItem, id);
    };
    editBtn.onclick = function () {
      openModal(checkboxBody, id);
    };

    todoItems.append(clone);

    clearModal();
  } else {
    showError();
  }
}

function showEmpty() {
  empty.classList.remove("hidden");
}

function hideEmpty() {
  empty.classList.add("hidden");
}

function showError() {
  inputError.classList.remove("hidden");
}

function hideError() {
  inputError.classList.add("hidden");
}

function toggleTheme() {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    theme = "dark";
  } else {
    theme = "white";
  }
  saveTheme();
}

function completeTodo(input, id) {
  const item = todoArr.find((elem) => elem.id == id);
  item.complete = input.checked;
  saveTodo();
}

function deleteTodo(item, id) {
  todoArr = todoArr.filter((elem) => elem.id != id);
  item.remove();
  if (todoArr.length == 0) {
    showEmpty();
  }
  saveTodo();
}

function clearModal() {
  hideEmpty();
  closeModal();
  modalInput.value = "";
}

function filterTodo() {
  let filterArr = todoArr;
  if (select.value == "complete") {
    filterArr = todoArr.filter((item) => item.complete);
  }
  if (select.value == "incomplete") {
    filterArr = todoArr.filter((item) => !item.complete);
  }
  renderTodo(filterArr);
}

function renderTodo(arr) {
  todoItems.innerHTML = null;
  if (arr.length == 0) {
    showEmpty();
  } else {
    hideEmpty();
  }
  arr.forEach((element) => {
    const clone = itemTemplate.content.cloneNode(true);

    const checkboxBody = clone.querySelector(".checkbox__body");
    const checkboxInput = clone.querySelector(".checkbox__input");
    const checkbox = clone.querySelector(".checkbox");
    const deleteBtn = clone.querySelector(".todo__delete");
    const todoItem = clone.querySelector(".todo__item");
    const editBtn = clone.querySelector(".todo__edit");

    checkboxBody.innerHTML = element.text;

    checkboxInput.checked = element.complete;

    checkbox.onclick = function () {
      completeTodo(checkboxInput, element.id);
    };
    deleteBtn.onclick = function () {
      deleteTodo(todoItem, element.id);
    };
    editBtn.onclick = function () {
      openModal(checkboxBody, element.id);
    };

    todoItems.append(clone);
  });
}

function searchTodo() {
  const value = searchInput.value;
  const filterArr = todoArr.filter((item) =>
    item.text.toLowerCase().includes(value.toLowerCase())
  );
  renderTodo(filterArr);
}

function saveTodo() {
  localStorage.setItem("todo", JSON.stringify(todoArr));
}

function getTodo() {
  if (localStorage.getItem("todo")) {
    todoArr = JSON.parse(localStorage.getItem("todo"));
    renderTodo(todoArr);
  } else {
    todoArr = [];
  }
}

function saveTheme() {
  localStorage.setItem("theme", theme);
}

function getTheme() {
  if (localStorage.getItem("theme")) {
    theme = localStorage.getItem("theme");
    if (theme == "white") {
      body.classList.remove("dark");
    } else {
      body.classList.add("dark");
    }
  } else {
    theme = "white";
  }
}
