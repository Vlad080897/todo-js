const descTaskInput = document.getElementById('main_input');
const todosWrapper = document.getElementById('todos-wrapper');
const checkAllBtn = document.getElementById('toggle-all');
const footerInfo = document.querySelector('.footer');
const leftTasks = document.querySelector('.todo-count');
const allBtn = document.getElementById('allBtn');
let footerBtns = [];
footerBtns.push(allBtn);
allBtn.addEventListener('click', (event) => {
  route = 'All';
  renderPage();
  setActiveBtn(event.target.innerHTML);
})
const activeBtn = document.getElementById('activeBtn');
footerBtns.push(activeBtn);
activeBtn.addEventListener('click', (event) => {
  route = 'Active';
  renderPage();
  setActiveBtn(event.target.innerHTML);
})
const compBtn = document.getElementById('compBtn');
footerBtns.push(compBtn);
compBtn.addEventListener('click', (event) => {
  route = 'Completed';
  renderPage();
  setActiveBtn(event.target.innerHTML);
})
const clearCompletedFromHtml = document.getElementById('clearCompleted');
clearCompletedFromHtml.addEventListener('click', () => {
  clearCompleted();
})

let tasks = [];
const setActiveBtn = (buttonName) => {
  footerBtns.forEach(b => {
    if (b.innerHTML === buttonName) {
      b.className = 'activeButton';
      return;
    }
    b.className = '';
  })
}
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks')).map(t => {
  if (t.isEdit = true) {
    return {
      ...t,
      isEdit: false
    };
  };
});
let route = 'All';

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
  const leftTaskLength = (getFromLocal() || []).filter(t => t.completed !== true).length;
  if ((getFromLocal() || []).length) {
    footerInfo.className = 'footer'
    const haveCompleted = (getFromLocal() || []).find(t => t.completed === true);
    clearCompletedFromHtml.className = haveCompleted ? 'clear-completed visible' : 'hidden';
    leftTasks.innerHTML = `${leftTaskLength} tasks left`;
    return;
  }
  footerInfo.className = 'hidden-footer'
};

const addToLocal = (newTasks) => {
  localStorage.setItem('tasks', JSON.stringify(newTasks));
};

addToTodosWrapper();
addToFooterWrapper();
setActiveBtn(route);

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
