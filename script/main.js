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
        }
    }
});
let leftTaskLength = tasks.filter(t => t.completed === false).length;
const renderPage = (newTasks, isFilter = false) => {
    tasks = [...newTasks];
    if (!isFilter) {
        addToLocal()
    }
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
    updateInput.id = `updateInput${index}`;
    updateInput.autofocus = true;
    updateInput.addEventListener('blur', () => {
        toggleEdit(index, true)
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
    leftTaskLength = (getFromLocal() || []).filter(t => t.completed === false).length;
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
    } else if (!haveNotCompleted && tasks.length) {
        const fromLocal = (getFromLocal() || []).find(t => t.completed === false);
        if (fromLocal) {
            checkAllBtn.checked = false
            return;
        };
        checkAllBtn.checked = true;
    };
};
const getFromLocal = () => {
    return JSON.parse(localStorage.getItem('tasks'));
}
const addToFooterWrapper = () => {
    mainSection.appendChild(footerInfo)
    if ((getFromLocal() || []).length) {
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

const toggleEdit = (index, changed = false) => {
    const newTasks = tasks.map((t, i) => {
        if (i === index) {
            if (i === index && changed) {
                const updateInput = document.getElementById(`updateInput${index}`);
                return {
                    ...t,
                    isEdit: !t.isEdit,
                    description: updateInput.value.length ? updateInput.value : t.description
                }
            }
            return {
                ...t,
                isEdit: !t.isEdit
            }
        }
        return t;
    });
    renderPage(newTasks)
}

const updateValue = index => {
    toggleEdit(index);
    addToTodosWrapper();
    const updateInput = document.getElementById(`updateInput${index}`);
    updateInput.focus();
    updateInput.value = tasks[index].description
    updateInput.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            if (updateInput.value.length) {
                const newTasks = tasks.map((t, i) => {
                    if (i === index) {
                        return {
                            ...t,
                            description: updateInput.value
                        }
                    };
                    return t;
                });
                renderPage(newTasks);
            };
        };
    });
};

const completeTask = index => {
    const newTasks = tasks.map((t, i) => {
        if (i === index) {
            return {
                ...t,
                completed: !t.completed
            };
        };
        return t;
    });
    renderPage(newTasks);
};

const deleteTask = index => {
    const newTasks = tasks.filter((_, i) => i !== index);
    renderPage(newTasks);
};

const getCompleted = () => {
    const newTasks = (getFromLocal() || []).filter((t) => t.completed === true);
    renderPage(newTasks, true);
};

const getAll = () => {
    const newTasks = getFromLocal();
    renderPage(newTasks, true)
};

const getActive = () => {
    const newTasks = (getFromLocal() || []).filter((t) => t.completed === false);
    renderPage(newTasks, true)
};

const clearCompleted = () => {
    const newTasks = (getFromLocal() || []).filter((t) => t.completed === false);
    checkAllBtn.checked = false;
    renderPage(newTasks);
};

descTaskInput.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        if (!descTaskInput.value.length) {
            return;
        };
        const newTask = {
            description: descTaskInput.value,
            completed: false,
            isEdit: false
        };
        const newTasks = [...tasks, newTask];
        renderPage(newTasks);
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
                completed: true
            }
        }
        return {
            ...t,
            completed: false,
        };
    })
    renderPage(newTasks);
})