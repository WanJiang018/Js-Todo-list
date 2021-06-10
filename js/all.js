//enum
const LIST_TYPE_ALL = 'all';
const LIST_TYPE_TODO = 'todo';
const LIST_TYPE_COMPLETION = 'completion';

// DOM
let addBtn = document.getElementById('addBtn');
let cleanBtn = document.getElementById('cleanBtn');
let todoblock = document.getElementById('todoblock');
let tabs = document.getElementsByClassName('tab');
let todoInput = document.getElementById('todoInput');
let todoList = document.getElementById('todoList');
let count = document.getElementById('count');

//Data
let list = [];
let countNum = 0;
let listType = LIST_TYPE_ALL;

(function () {
  initTabEvent();
  initAddBtnEventListener();
  initCleanBtnEventListener();
  renderBlock();
  renderCleanBtn();
})();

function renderBlock() {
  todoblock.hidden = list.length > 0 ? false : true;
}

function renderCleanBtn(){
  let filterList = getListByType(LIST_TYPE_COMPLETION);
  cleanBtn.hidden = filterList.length > 0 ? false : true;
}

function initTabEvent() {
  Array.prototype.forEach.call(tabs, function (tab) {
    tab.addEventListener('click', setActiveClass);
  });

  function setActiveClass(event) {
    event.preventDefault();
    Array.prototype.forEach.call(tabs, function (tab) {
      tab.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    listType = event.currentTarget.id;
    renderDataList();
  }
}

function initAddBtnEventListener() {
  addBtn.addEventListener('click', eventHandler);

  function eventHandler(event) {
    let value = todoInput.value;
    if (value == '') {
      alert('請輸入內容');
      return;
    }
    updateCountNumber(countNum + 1);

    let item = addData(value);
    todoInput.value = '';

    renderBlock();

    if (listType != LIST_TYPE_COMPLETION) {
      addItemTemplate(item);
    }
  }
}

function initCleanBtnEventListener() {
  cleanBtn.addEventListener('click', eventHandler);
  function eventHandler(event) {
    event.preventDefault();
    list = list.filter(function (item, index) {
      if (item.isDone) {
        removeTodoItem(item.id);
      } else {
        return item;
      }
    });
    renderCleanBtn();
    renderBlock();
  }
}

function initCheckboxEventListener(dataId) {
  let checkboxId = `checkbox-${dataId}`;
  let checkbox = document.getElementById(checkboxId);

  checkbox.addEventListener('click', eventHandler);
  function eventHandler(event) {
    let isChecked = event.target.checked;
    let updatedCountNum = isChecked ? countNum - 1 : countNum + 1;

    updateCountNumber(updatedCountNum);
    toggleDataStatus(dataId);
    renderCleanBtn();

    if (listType != LIST_TYPE_ALL) {
      removeTodoItem(dataId);
    }
  }
}

function initRemoveEventListener(dataId) {
  let removeBtnId = `remove-${dataId}`;
  let removeBtn = document.getElementById(removeBtnId);

  removeBtn.addEventListener('click', eventHandler);
  function eventHandler(event) {
    let item = getItem(dataId);
    if (!item.isDone) {
      updateCountNumber(countNum - 1);
    }
    removeData(dataId);
    removeTodoItem(dataId);
    renderCleanBtn();
    renderBlock();
  }
}

// Element Manipulation
function renderDataList() {
  removeAllElement();
  let filterList = getListByType(listType);

  filterList.forEach(function (item, index) {
    addItemTemplate(item);
  });
}

function addItemTemplate(item) {
  let itemTemplate = getItemTemplate(item);
  todoList.insertAdjacentHTML('beforeend', itemTemplate);
  initCheckboxEventListener(item.id);
  initRemoveEventListener(item.id);
}

function getItemTemplate(item) {
  let checked = item.isDone ? 'checked' : ' ';
  let itemTemplate = `
    <li id="item-${item.id}" class="py-2 list-item">
        <div class="d-flex list-item-check-block">
            <input type="checkbox" id="checkbox-${item.id}" ${checked} name="checkbox" class="form-check my-0 ms-0">
            <label for="checkbox-${item.id}" class="list-name">${item.name}</label> 
        </div>
        <img id="remove-${item.id}" class="list-remove" src="./image/cancel.jpg" alt="cancel">
    </li>`;

  return itemTemplate;
}

function removeTodoItem(id) {
  let todoItemId = `item-${id}`;
  let todoItemLi = document.getElementById(todoItemId);

  if (todoItemLi) {
    todoItemLi.remove();
  }
}

function removeAllElement() {
  list.forEach(function (item, index) {
    removeTodoItem(item.id);
  });
}

function updateCountNumber(num) {
  countNum = num;
  count.innerText = countNum;
}

// Data Manipulation
function addData(value) {
  let item = {
    id: list.length > 0 ? getListLastId() + 1 : 1,
    name: value,
    isDone: false,
  };
  list.push(item);
  return item;
}

function toggleDataStatus(id) {
  list.forEach(function (item, index) {
    if (item.id == id) {
      item.isDone = !item.isDone;
    }
  });
}

function removeData(id) {
  list = list.filter(function (item, index) {
    if (item.id != id) {
      return item;
    }
  });
}

function getItem(id) {
  return list.find(function (item, index) {
    if (item.id == id) {
      return item;
    }
  });
}

function getListByType(type) {
  let filterList = [];
  switch (type) {
    case LIST_TYPE_ALL:
      filterList = list;
      break;
    case LIST_TYPE_TODO:
      filterList = getDataByStatus(false);
      break;
    case LIST_TYPE_COMPLETION:
      filterList = getDataByStatus(true);
      break;
    default:
      filterList = list;
      break;
  }
  return filterList;
}

function getDataByStatus(isDone) {
  return list.filter(function (item, index) {
    if (item.isDone == isDone) {
      return item;
    }
  });
}

function getListLastId() {
  return Math.max.apply(
    null,
    list.map((item) => item.id)
  );
}
