const taskTextInput = document.getElementById('task-text')
const taskList = document.querySelector('.task-list')
const countDayInput = document.querySelector('.count-day__input')
const createTaskButton = document.querySelector('.create__task-button')


let tasks = []

document.addEventListener('DOMContentLoaded', function () {
  const storedTasks = localStorage.getItem('tasks')
  if (storedTasks) {
    tasks = JSON.parse(storedTasks)
    tasks.forEach(task => {
      createTask(task)
    })
  }
})


const isCheck = (name) => document.querySelector('input[name="' + name + '"]:checked')

function resetinputFields() {
  countDayInput.value = ''
  taskTextInput.value = ''

  taskTextInput.focus()
}

function createTask(task) {
  const taskItemHTML = document.createElement('li')
  taskItemHTML.className = 'task-item'
  taskItemHTML.setAttribute('data-task-id', task.id)
  taskList.append(taskItemHTML)


  const deleteTaskButton = document.createElement('button')
  deleteTaskButton.className = 'delete-task__button'
  deleteTaskButton.innerHTML = 'Удалить задачу'
  deleteTaskButton.addEventListener('click', function () {
    taskItemHTML.remove();
    tasks = tasks.filter(t => t.id !== task.id)


    localStorage.setItem('tasks', JSON.stringify(tasks));

  })

  taskItemHTML.append(deleteTaskButton)

  const taskSubject = `<h1 class="task-item__subject">${task.text}</h1>`
  taskItemHTML.insertAdjacentHTML('afterbegin', taskSubject)

  const taskItemWrapper = document.createElement('ul')
  taskItemWrapper.className = 'task-item__wrapper'

  taskItemHTML.append(taskItemWrapper)

  let daysCount = task.checkboxCount || isCheck('days').id;

  countDayInput.value !== '' ? (daysCount = countDayInput.value) : ''

  function createCeillDay(quantity) {
    for (let i = 1; i <= quantity; i++) {
      const taskItemCeill = `
        <li class="task-item__ceill">
          <p class="count-day">${i}</p>
          <input class="checkbox" type="checkbox" name="select-day" ${task.checkboxStates && task.checkboxStates[i - 1] ? 'checked' : ''}>
        </li>`

      taskItemWrapper.insertAdjacentHTML('beforeend', taskItemCeill)
    }
  }
  createCeillDay(daysCount)
}



createTaskButton.addEventListener('click', function (event) {
  if (taskTextInput.value !== '') {
    event.preventDefault()

    const newTask = {
      id: Date.now(),
      text: taskTextInput.value,
      checkboxStates: [],
      checkboxCount: countDayInput.value || isCheck('days').id
    };

    tasks.push(newTask);

    createTask(newTask)
    resetinputFields()

    localStorage.setItem('tasks', JSON.stringify(tasks))
  }
})



document.addEventListener('change', function (event) {
  const checkbox = event.target
  if (checkbox.type === 'checkbox' && checkbox.name === 'select-day') {
    const taskId = checkbox.closest('.task-item').getAttribute('data-task-id');
    const task = tasks.find(t => t.id == taskId);

    const dayIndex = Array.from(checkbox.closest('.task-item__wrapper').querySelectorAll('.checkbox')).indexOf(checkbox);

    if (task && dayIndex !== -1) {
      task.checkboxStates[dayIndex] = checkbox.checked


      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }
})

