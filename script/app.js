const descTaskInput = document.getElementById('main_input');
const footerInfo = document.getElementById('footer_info_wrapper');
const checkAllBtn = document.getElementById('toggle-all');
const todosWrapper = document.getElementById('todos-wrapper');
const leftTasks = document.querySelector('.todo-count')
let footerBtns = [];
const allBtn = document.getElementById('allBtn');
footerBtns.push(allBtn);
const activeBtn = document.getElementById('activeBtn');
footerBtns.push(activeBtn);
const compBtn = document.getElementById('compBtn');
footerBtns.push(compBtn);
const clearCompleted = document.getElementById('clearCompleted');

const getAllBtn = () => {
  UI.getAll();
  router.newRouter = 'All';
  UI.getActiveButton();
}

const getActiveBtn = () => {
  UI.getActive();
  router.newRouter = 'Active';
  UI.getActiveButton();
}

const getCompletedBtn = () => {
  UI.getCompleted();
  router.newRouter = 'Completed';
  UI.getActiveButton('Completed');
}

const clearCompletedBtn = () => {
  const newTasks = Storage.getTasks().filter((t) => t.completed === false);
  Storage.updateTasks(newTasks);
  UI.withRouter();
  UI.displayFooter();
}

class Task {
  constructor(description) {
    this.description = description;
    this.id = `${new Date().getTime()}`;
    this.completed = false;
    this.isEdit = false;
  }
}

class Storage {
  static getTasks() {
    let tasks;
    if (!localStorage.getItem('tasks')) {
      tasks = []
    } else {
      tasks = JSON.parse(localStorage.getItem('tasks'))
    }
    return tasks;
  }
  static updateTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  static addTask(task) {
    let tasks = this.getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }

  static removeTask(id) {
    const fromLocal = this.getTasks();
    const newTasks = fromLocal.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };
};

let router = {
  router: 'All',

  set newRouter(router) {
    this.router = router;
  },

  get curretntRouter() {
    return this.router;
  }

}

class UI {
  static displayTasks() {
    const tasks = Storage.getTasks().map(t => {
      if (t.isEdit === true) {
        return {
          ...t,
          isEdit: false
        };
      };
      return t;
    });
    this.renderTasks(tasks);
  }

  static displayFooter() {
    const leftTaskLength = Storage.getTasks().filter(t => t.completed !== true).length;
    if (Storage.getTasks().length) {
      footerInfo.className = 'footer'
      const haveCompleted = Storage.getTasks().find(t => t.completed === true);
      clearCompleted.className = haveCompleted ? 'clear-completed visible' : 'hidden';
      leftTasks.innerHTML = `${leftTaskLength} tasks left`;
      UI.getActiveButton();
      return;
    }
    footerInfo.className = 'hidden-footer'
  }



  static toggleEditMode(id, changed = false) {
    const fromLocal = Storage.getTasks();
    let newTasks = fromLocal.map((t) => {
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
    Storage.updateTasks(newTasks);
    this.withRouter();
  }

  static updateInput(id, index) {
    this.toggleEditMode(id);
    const updateInput = document.getElementById(`updateInput${id}`);
    updateInput.focus();
    const currentTask = Storage.getTasks().find(t => t.id === id)
    updateInput.value = currentTask.description
  }

  static setActive(buttonName) {
    footerBtns.forEach(b => {
      if (b.innerHTML === buttonName) {
        b.className = 'activeButton';
        return;
      };
      b.className = '';
    });
  }

  static completeTask(id) {
    const fromLocal = Storage.getTasks();
    const newTasks = fromLocal.map(t => {
      if (t.id === id) {
        return {
          ...t,
          completed: !t.completed
        }
      }
      return t;
    })
    Storage.updateTasks(newTasks);
    this.withRouter();
    this.displayFooter();
  }

  static withRouter() {
    if (router.curretntRouter === 'Completed') {
      this.getCompleted()
    }
    if (router.curretntRouter === 'Active') {
      this.getActive()
    }
    if (router.curretntRouter === 'All') {
      this.getAll()
    }
  }

  static getActiveButton() {
    if (router.curretntRouter === 'All') {
      router.newRouter = 'All';
      this.setActive('All');
    };
    if (router.curretntRouter === 'Active') {
      router.newRouter = 'Active';
      this.setActive('Active');
    };
    if (router.curretntRouter === 'Completed') {
      router.newRouter = 'Completed';
      this.setActive('Completed');
    };
  }

  static getAll() {
    const newTasks = Storage.getTasks();
    this.renderTasks(newTasks);
  }

  static getActive() {
    const newTasks = Storage.getTasks().filter((t) => t.completed === false);
    this.renderTasks(newTasks);
  }

  static getCompleted() {
    const newTasks = Storage.getTasks().filter((t) => t.completed === true);
    this.renderTasks(newTasks);
  }

  static renderTasks(tasks) {
    todosWrapper.innerHTML = '';
    tasks.forEach((t, i) => {
      this.createTaskTemplate(t, i);
    });
    const haveNotCompleted = tasks.find(t => t.completed === false);
    if (haveNotCompleted) {
      checkAllBtn.checked = false;
      return;
    }
    if (!haveNotCompleted && tasks.length) {
      const fromLocal = Storage.getTasks().find(t => t.completed === false);
      if (fromLocal) {
        checkAllBtn.checked = false;
        return;
      };
      checkAllBtn.checked = true;
      return;
    };
    checkAllBtn.checked = false;
  }

  static createTaskTemplate(task, index) {
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
      this.toggleEditMode(task.id, true)
    });
    destroyButton.type = 'button';
    destroyButton.className = 'destroy';
    label.innerText = task.description;
    label.classList.add('description', `${task.completed ? 'completed' : null}`);
    label.addEventListener('dblclick', () => {
      this.updateInput(task.id, index);
    });
    input.type = 'checkbox';
    input.className = 'toggle';
    input.checked = task.completed ? `checked` : '';
    input.addEventListener('click', () => {
      this.completeTask(task.id);
    })
    div.className = 'view';
    task.isEdit ? li.className = 'editing' : li.className = '';
    li.id = task.id;
    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(destroyButton);
    li.appendChild(div);
    li.appendChild(updateInput);
    todosWrapper.append(li);
  }

  static deleteTask(el) {
    if (el.classList.contains('destroy')) {
      el.parentElement.parentElement.remove();
      Storage.removeTask(el.parentElement.parentElement.id);
      UI.displayTasks();
      UI.displayFooter();
    };
  };
}

document.addEventListener('DOMContentLoaded', () => {
  router.newRouter = 'All'
  UI.displayTasks();
  UI.displayFooter();
});

descTaskInput.addEventListener('keypress', (event) => {
  if (event.key === "Enter") {
    const description = descTaskInput.value

    if (!description.length || !description.trim().length) {
      return;
    }

    const task = new Task(description);

    const tasks = Storage.getTasks();
    const newTasks = [...tasks, task];
    UI.renderTasks(newTasks)
    descTaskInput.value = ''
    Storage.updateTasks(newTasks);
    UI.withRouter();
    UI.displayFooter();
  }
})

document.getElementById('todos-wrapper').addEventListener('click', (event) => {
  UI.deleteTask(event.target);

})

checkAllBtn.addEventListener('click', () => {
  const currentTasks = Storage.getTasks();
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
  Storage.updateTasks(newTasks);
  UI.renderTasks(newTasks);
  UI.displayFooter();
})
