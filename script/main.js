const descTaskInput = document.getElementById('main_input');
const todosWrapper = document.getElementById('todos-wrapper');
const checkAllBtn = document.getElementById('toggle-all');
const footerInfo = document.createElement('footer');
const mainSection = document.querySelector('.main');

let tasks = [];
const initialTasks = !localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));
let leftTaskLength = tasks.filter(t => t.completed === false).length;

const createNewTodo = (newTodo) => {
    const newTasks = [...tasks, newTodo];
    tasks = [...newTasks];
}

const renderPage = (newTasks, changeQueue = false) => {
    tasks = [...newTasks];
    if (changeQueue) {
        addToLocal();
        addToTodosWrapper(newTasks);
        addToFooterWrapper();
    }
    addToTodosWrapper(tasks);
    addToFooterWrapper();
    addToLocal();
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
    updateInput.id = `updateInput${index}`;
    updateInput.autofocus = true;
    updateInput.addEventListener('blur', () => {
        toggleEdit(index)
    });
    destroyButton.type = 'button';
    destroyButton.className = 'destroy';
    destroyButton.addEventListener('click', () => {
        deleteTask(index);
    });
    label.innerText = task.description;
    label.classList.add('description', `${task.completed ? 'completed' : null}`)
    label.addEventListener('dblclick', () => {
        updateValue(index);
    });
    input.type = 'checkbox'
    input.className = 'toggle';
    input.checked = task.completed ? `checked` : '';
    input.addEventListener('click', () => {
        completeTask(index);
    });
    div.className = 'view';
    task.isEdit ? li.className = 'editing' : li.className = ''
    div.appendChild(input);
    div.appendChild(label);
    div.appendChild(destroyButton);
    li.appendChild(div);
    li.appendChild(updateInput);
    todosWrapper.append(li)
}

const createFooterTemplate = () => {
    footerInfo.innerHTML = '';
    if (tasks.length) {
        const span = document.createElement('span');
        const ul = document.createElement('ul');
        const liAll = document.createElement('li');
        const liActive = document.createElement('li');
        const liCompleted = document.createElement('li');
        const liClear = document.createElement('li');
        const getAllBtn = document.createElement('button');
        const getActiveBtn = document.createElement('button');
        const getCompletedBtn = document.createElement('button');
        const clearCompletedBtn = document.createElement('button');
        leftTaskLength = tasks.filter(t => t.completed === false).length;
        const haveCompleted = tasks.find(t => t.completed === true);
        span.className = 'todo-count';
        span.innerText = `${leftTaskLength} item left`;
        ul.className = 'filters';
        getAllBtn.addEventListener('click', () => {
            getAll();
        });
        liAll.appendChild(getAllBtn);
        getAllBtn.type = 'button';
        getAllBtn.innerText = 'All';
        getActiveBtn.addEventListener('click', () => {
            getActive();
        });
        liActive.appendChild(getActiveBtn);
        getActiveBtn.type = 'button';
        getActiveBtn.innerText = 'Active';
        getCompletedBtn.addEventListener('click', () => {
            getCompleted();
        });
        liCompleted.appendChild(getCompletedBtn)
        getCompletedBtn.type = 'button';
        getCompletedBtn.innerText = 'Completed';
        clearCompletedBtn.addEventListener('click', () => {
            clearCompleted();
        });
        liClear.appendChild(clearCompletedBtn)
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
        mainSection.appendChild(footerInfo)
    }
}

const addToTodosWrapper = (newTasks = initialTasks) => {
    tasks = [...newTasks];
    todosWrapper.innerHTML = '';
    if (tasks.length) {
        tasks.forEach((t, i) => {
            createTemplate(t, i);
        });
    };
    const haveNotCompleted = tasks.find(t => t.completed === false);
    if (haveNotCompleted) {
        checkAllBtn.checked = false;
    } else if (!haveNotCompleted && tasks.length) {
        const fromLocal = JSON.parse(localStorage.getItem('tasks')).find(t => t.completed === false);
        if (fromLocal) {
            checkAllBtn.checked = false
            return;
        };
        checkAllBtn.checked = true;
    };
};
const getFromLocal = (tasks) => {
    if (localStorage.tasks) {
        return newTasks = JSON.parse(localStorage.getItem('tasks'));
    };
    return tasks;
}
const addToFooterWrapper = () => {
    mainSection.appendChild(footerInfo)
    if (tasks.length) {
        footerInfo.innerHTML = '';
        createFooterTemplate();
        return;
    };
    mainSection.removeChild(footerInfo);
};

const addToLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

addToTodosWrapper();
addToFooterWrapper();

const toggleEdit = index => {
    let newTasks = [...tasks];
    newTasks = newTasks.map((t, i) => {
        if (i === index) {
            t.isEdit = !t.isEdit
        };
        return t;
    });
    addToTodosWrapper(newTasks);
    addToLocal();
}

const updateValue = index => {
    let newTasks = [...tasks];
    toggleEdit(index);
    addToTodosWrapper(newTasks);
    const updateInput = document.getElementById(`updateInput${index}`);
    updateInput.focus();
    updateInput.value = newTasks[index].description
    updateInput.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            if (updateInput.value.length) {
                newTasks = newTasks.map((t, i) => {
                    if (i === index) {
                        t.description = updateInput.value
                    };
                    return t;
                });
                addToTodosWrapper(newTasks);
                addToLocal();
                return;
            };
        };
    });
};

const completeTask = index => {
    let newTasks = [...tasks];
    newTasks = newTasks.map((t, i) => {
        if (i === index) {
            t.completed = !t.completed;
        }
        return t
    })
    renderPage(newTasks, true);
};

const deleteTask = index => {
    let newTasks = tasks.filter((_, i) => i !== index);
    renderPage(newTasks);
};

const getCompleted = () => {
    let newTasks = [];
    newTasks = getFromLocal(newTasks);
    newTasks = newTasks.filter((t) => t.completed === true);
    addToTodosWrapper(newTasks);
};

const getAll = () => {
    let newTasks = [];
    newTasks = getFromLocal(newTasks);
    addToTodosWrapper([...newTasks]);
};

const getActive = () => {
    let newTasks = [];
    newTasks = getFromLocal(newTasks);
    newTasks = newTasks.filter((t) => t.completed === false);
    addToTodosWrapper(newTasks);
};

const clearCompleted = () => {
    let newTasks = tasks.filter((t) => t.completed === false);
    checkAllBtn.checked = false;
    renderPage(newTasks);
};

descTaskInput.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        if (!descTaskInput.value.length) {
            return;
        };
        const newTodo = {
            description: descTaskInput.value,
            completed: false,
            isEdit: false
        };
        createNewTodo(newTodo);
        renderPage([...tasks]);
        descTaskInput.value = '';
    };
});

checkAllBtn.addEventListener('click', () => {
    let newTasks = getFromLocal([...tasks])
    const notCompleted = newTasks.find(t => t.completed === false);
    newTasks = newTasks.map(t => {
        if (notCompleted) {
            return {
                ...t,
                completed: true
            }
        } else if (!notCompleted) {
            return {
                ...t,
                completed: false,
            }
        }
    })
    renderPage(newTasks, true);
})