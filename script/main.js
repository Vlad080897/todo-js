const descTaskInput = document.getElementById('main_input');
const todosWrapper = document.getElementById('todos-wrapper');
const checkAllBtn = document.getElementById('toggle-all');
const footerInfo = document.createElement('footer');
const mainSection = document.querySelector('.main');

let tasks = [];
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks')).map(t => {
  if (t.isEdit = true) {
    return {
      ...t,
      isEdit: false
    };
  };
});
let route = 'All';
let leftTaskLength = tasks.filter(t => t.completed === false).length;

const renderPage = () => {
  const currentTasks = (getFromLocal() || []);
  if (route === 'Active') {
    tasks = getActive();
  } else if (route === 'Completed') {
    tasks = getCompleted();
  } else {
    tasks = currentTasks;
  };
  addToTodosWrapper();
  addToFooterWrapper();
  isButtonActive();
}

const createTemplate = (task, index) => {
  const li = document.createElement('li');
  const div = document.createElement('div');
  const input = document.createElement('input');
  const label = document.createElement('label');
  const updateInput = document.createElement('input');
  const destroyButton = document.createElement('button');

  updateInput.className = 'edit';
  updateInput.type = 'text';
  updateInput.id = `updateInput${task.id}`;
  updateInput.autofocus = true;
  updateInput.addEventListener('blur', () => {
    toggleEdit(task.id, true)
  });
  destroyButton.type = 'button';
  destroyButton.className = 'destroy';
  destroyButton.addEventListener('click', () => {
    deleteTask(task.id);
  });
  label.innerText = task.description;
  label.classList.add('description', `${task.completed ? 'completed' : null}`);
  label.addEventListener('dblclick', () => {
    updateValue(task.id, index);
  });
  input.type = 'checkbox';
  input.className = 'toggle';
  input.checked = task.completed ? `checked` : '';
  input.addEventListener('click', () => {
    completeTask(task.id);
  });
  div.className = 'view';
  task.isEdit ? li.className = 'editing' : li.className = '';
  div.appendChild(input);
  div.appendChild(label);
  div.appendChild(destroyButton);
  li.appendChild(div);
  li.appendChild(updateInput);
  todosWrapper.append(li);
};

let footerBtns = [];
const isButtonActive = () => {
  const setActive = (buttonName) => {
    footerBtns.forEach(b => {
      if (b.innerHTML === buttonName) {
        b.className = 'activeButton';
      };
    });
  };
  if (route === 'All') {
    setActive('All');
  };
  if (route === 'Active') {
    setActive('Active')
  };
  if (route === 'Completed') {
    setActive('Completed')
  };
};

const createFooterTemplate = () => {
  footerInfo.innerHTML = '';
  footerBtns = [];
  const span = document.createElement('span');
  const ul = document.createElement('ul');
  const liAll = document.createElement('li');
  const liActive = document.createElement('li');
  const liCompleted = document.createElement('li');
  const liClear = document.createElement('li');
  const getAllBtn = document.createElement('button');
  footerBtns.push(getAllBtn)
  const getActiveBtn = document.createElement('button');
  footerBtns.push(getActiveBtn)
  const getCompletedBtn = document.createElement('button');
  footerBtns.push(getCompletedBtn)
  const clearCompletedBtn = document.createElement('button');
  leftTaskLength = (getFromLocal() || []).filter(t => t.completed === false).length;
  const haveCompleted = tasks.find(t => t.completed === true);
  span.className = 'todo-count';
  span.innerText = `${leftTaskLength} item left`;
  ul.className = 'filters';
  getAllBtn.addEventListener('click', (event) => {
    route = 'All';
    renderPage();
  });
  liAll.appendChild(getAllBtn);
  getAllBtn.type = 'button';
  getAllBtn.innerText = 'All';
  getActiveBtn.addEventListener('click', (event) => {
    route = 'Active';
    renderPage();
  });
  liActive.appendChild(getActiveBtn);
  getActiveBtn.type = 'button';
  getActiveBtn.innerText = 'Active';
  getCompletedBtn.addEventListener('click', event => {
    route = 'Completed';
    renderPage();
  });
  liCompleted.appendChild(getCompletedBtn);
  getCompletedBtn.type = 'button';
  getCompletedBtn.innerText = 'Completed';
  clearCompletedBtn.addEventListener('click', () => {
    clearCompleted();
  });
  liClear.appendChild(clearCompletedBtn);
  clearCompletedBtn.type = 'button';
  clearCompletedBtn.innerText = 'Clear Completed';
  clearCompletedBtn.className = haveCompleted ? 'clear-completed visible' : 'hidden';
  ul.appendChild(liAll);
  ul.appendChild(liActive);
  ul.appendChild(liCompleted);
  footerInfo.className = "footer";
  footerInfo.id = "footer_info_wrapper";
  footerInfo.appendChild(span);
  footerInfo.appendChild(ul);
  footerInfo.appendChild(clearCompletedBtn);
  mainSection.appendChild(footerInfo);
};

const addToTodosWrapper = () => {
  todosWrapper.innerHTML = '';
  if (tasks.length) {
    tasks.forEach((t, i) => {
      createTemplate(t, i);
    });
  };
  const haveNotCompleted = tasks.find(t => t.completed === false);
  if (haveNotCompleted) {
    checkAllBtn.checked = false;
    return;
  }
  if (!haveNotCompleted && tasks.length) {
    const fromLocal = (getFromLocal() || []).find(t => t.completed === false);
    if (fromLocal) {
      checkAllBtn.checked = false;
      return;
    };
    checkAllBtn.checked = true;
    return;
  };
  checkAllBtn.checked = false;
};

const getFromLocal = () => {
  return JSON.parse(localStorage.getItem('tasks'));
};

const addToFooterWrapper = () => {
  mainSection.appendChild(footerInfo)
  if ((getFromLocal() || []).length) {
    footerInfo.innerHTML = '';
    createFooterTemplate();
    return;
  };
  mainSection.removeChild(footerInfo);
};

const addToLocal = (newTasks) => {
  localStorage.setItem('tasks', JSON.stringify(newTasks));
};

addToTodosWrapper();
addToFooterWrapper();
isButtonActive();

const toggleEdit = (id, changed = false) => {
  const fromLocal = getFromLocal()
  let newTasks = fromLocal.map((t, i) => {
    if (t.id === id) {
      if (t.id === id && changed) {
        const updateInput = document.getElementById(`updateInput${id}`);
        return {
          ...t,
          isEdit: !t.isEdit,
          description: updateInput.value.length && updateInput.value.trim().length ? updateInput.value : t.description
        };
      };
      return {
        ...t,
        isEdit: !t.isEdit
      };
    };
    return t;
  });
  addToLocal(newTasks);
  renderPage();
};

const updateValue = (id, index) => {
  toggleEdit(id);
  addToTodosWrapper();
  const updateInput = document.getElementById(`updateInput${id}`);
  updateInput.focus();
  updateInput.value = tasks[index].description;
  updateInput.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
      if (updateInput.value.length && updateInput.value.trim().length) {
        renderPage();
      };
    };
  });
};

const completeTask = id => {
  const fromLocal = getFromLocal();
  let newTasks = fromLocal.map((t, i) => {
    if (t.id === id) {
      return {
        ...t,
        completed: !t.completed,
      };
    };
    return t;
  });
  addToLocal(newTasks);
  renderPage();
};

const deleteTask = id => {
  const fromLocal = getFromLocal();
  let newTasks = fromLocal.filter((t, i) => t.id !== id);
  addToLocal(newTasks);
  renderPage();
};

const getCompleted = () => {
  return (getFromLocal() || []).filter((t) => t.completed === true);
};

const getActive = () => {
  return (getFromLocal() || []).filter((t) => t.completed === false);
};

const clearCompleted = () => {
  const newTasks = (getFromLocal() || []).filter((t) => t.completed === false);
  checkAllBtn.checked = false;
  addToLocal(newTasks);
  renderPage();
};

descTaskInput.addEventListener('keypress', (event) => {
  if (event.key === "Enter") {
    if (!descTaskInput.value.length || !descTaskInput.value.trim()) {
      return;
    };
    const newTask = {
      id: Date.now(),
      description: descTaskInput.value,
      completed: false,
      isEdit: false
    };
    const fromLocal = getFromLocal() || [];
    const newTasks = [...fromLocal, newTask];
    addToLocal(newTasks);
    renderPage();
    descTaskInput.value = '';
  };
});

checkAllBtn.addEventListener('click', () => {
  const currentTasks = getFromLocal();
  const notCompleted = currentTasks.find(t => t.completed === false);
  const newTasks = currentTasks.map(t => {
    if (notCompleted) {
      return {
        ...t,
        completed: true,
      }
    }
    return {
      ...t,
      completed: false,
    };
  });
  addToLocal(newTasks);
  renderPage();
});
