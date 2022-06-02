const descTaskInput = document.getElementById('main_input');
const todosWrapper = document.getElementById('todos-wrapper');
const checkAllBtn = document.getElementById('toggle-all');
const footerInfo = document.getElementById('footer_info_wrapper');

let tasks = [];
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));
let leftTaskLength = tasks.filter(t => t.completed === false).length;

function Task(description) {
    this.description = description
    this.completed = false
    this.isEdit = false
};

const createTemplate = (task, index) => {
    return `
    <li class=${task.isEdit ? 'editing' : ''} >
      <div class="view">
        <input class="toggle" onClick={completeTask(${index})} type="checkbox" ${task.completed ? `checked` : ''}>
        <label ondblclick="{updateValue(${index})}" class="description ${task.completed ? 'completed' : ''}">${task.description}</label>
        <button class="destroy" type="button" onClick={deleteTask(${index})}></button>
      </div>
       <input onblur="{toggleEdit(${index})}" class="edit" type="text" id="updateInput" class="check" autofocus> 
    </li>`
}

const createFooterTemplate = () => {
    leftTaskLength = tasks.filter(t => t.completed === false).length;
    const haveCompleted = tasks.find(t => t.completed === true);
    return footerInfo.innerHTML = `
    ${tasks.length ? `
      <span class="todo-count">${leftTaskLength} items left</span>
      <ul class="filters">
       <li>
         <button onClick={getAll()}>All</button>
       </li>
       <li>
         <button onClick={getActive()}>Active</button>
       </li>
       <li>
         <button type="button" onClick={getCompleted()}>Completed</span>
       </li>
      </ul>
      <button type="button" onClick={clearCompleted()} class="${haveCompleted ? `clear-completed visible` : `hidden`}">Clear Completed</button>
    `
            :
      ''
        }
    `
}

const addToTodosWrapper = () => {
    todosWrapper.innerHTML = '';
    if (tasks.length) {
        tasks.forEach((t, i) => {
            todosWrapper.innerHTML += createTemplate(t, i);
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

const addToLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

addToTodosWrapper();
createFooterTemplate();

const toggleEdit = (index) => {
    tasks[index].isEdit = !tasks[index].isEdit;
    addToTodosWrapper();
    addToLocal();
}

const updateValue = index => {
    toggleEdit(index)
    addToTodosWrapper();
    const updateInput = document.getElementById('updateInput');
    updateInput.focus();
    updateInput.value = tasks[index].description
    updateInput.addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            if (updateInput.value.length) {
                tasks[index].description = updateInput.value;
                addToTodosWrapper();
                addToLocal();
                return;
            }
        }
    })
}

const completeTask = index => {
    tasks[index].completed = !tasks[index].completed;
    addToLocal();
    addToTodosWrapper();
    createFooterTemplate();

}

const deleteTask = index => {
    tasks = tasks.filter((_, i) => i !== index);
    addToTodosWrapper();
    createFooterTemplate();
    addToLocal();
}

const getCompleted = () => {
    !localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter((t) => t.completed === true);
    addToTodosWrapper();
}

const getAll = () => {
    !localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));
    addToTodosWrapper();
}

const getActive = () => {
    !localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter((t) => t.completed === false);
    addToTodosWrapper();
}

const clearCompleted = () => {
    tasks = tasks.filter((t) => t.completed === false);
    checkAllBtn.checked = false;
    addToTodosWrapper();
    createFooterTemplate();
    addToLocal();
}

descTaskInput.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        if (!descTaskInput.value.length) {
            return;
        }
        tasks.push(new Task(descTaskInput.value));
        addToTodosWrapper();
        createFooterTemplate();
        addToLocal();
        descTaskInput.value = '';
    }
});

checkAllBtn.addEventListener('click', (e) => {
    !localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));
    const notCompleted = tasks.find(t => t.completed === false);
    let newTasks = tasks.map(t => {
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
    tasks = [...newTasks];
    addToLocal();
    addToTodosWrapper();
    createFooterTemplate();

})