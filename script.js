//DOM Vars
//date
const dayNameText = document.getElementById("date-day");
const monthNameText = document.getElementById("date-month");
const dayNumberText = document.getElementById("date-day-number");
//tasks
const taskInput = document.getElementById("new-task-name");
const taskBtn = document.getElementById("add-task-btn");
const removeBtn = document.getElementById("clear-btn");
const taskList = document.getElementById("task-list");
const itemsText = document.getElementById("items-text");

//filters
const allFilter = document.getElementById("all-filter");
const activeFilter = document.getElementById("active-filter");
const completedFilter = document.getElementById("completed-filter");

allFilter.addEventListener("click", () => {
  currentFilter = "all";
  renderTasks();
  setActiveFilterUI();
  countTasks();
});

activeFilter.addEventListener("click", () => {
  currentFilter = "active";
  renderTasks();
  setActiveFilterUI();
  countTasks();
});

completedFilter.addEventListener("click", () => {
  currentFilter = "completed";
  renderTasks();
  setActiveFilterUI();
  countTasks();
});

let currentFilter = "all"; // all | active | completed

//reload
window.addEventListener("DOMContentLoaded", function () {
  const now = new Date();

  const day = now.toLocaleDateString("en-EN", { weekday: "long" });
  const month = now.toLocaleDateString("en-EN", { month: "long" });
  const dayNumber = getOrdinal(now.getDate());

  dayNameText.innerHTML = upperCaseFirst(day);
  monthNameText.innerHTML = upperCaseFirst(month);
  dayNumberText.innerHTML = dayNumber;

  renderTasks();
  countTasks();
});

//task-btn
taskBtn.addEventListener("click", function () {
  let task = taskInput.value;

  if (!task.trim()) return;

  saveTask(task);
  addTask(task);
  countTasks();

  taskInput.value = "";
});

//clear-btn
removeBtn.addEventListener("click", function () {
  const tasks = getTasksFromStorage();

  const activeTasks = tasks.filter((task) => !task.completed);

  localStorage.setItem("tasks", JSON.stringify(activeTasks));

  location.reload();

  countTasks();
});

//functions
function upperCaseFirst(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getOrdinal(n) {
  if (n > 3 && n < 21) return n + "th"; // 11,12,13 son especiales

  switch (n % 10) {
    case 1:
      return n + "st";
    case 2:
      return n + "nd";
    case 3:
      return n + "rd";
    default:
      return n + "th";
  }
}

//set active class on filters
function setActiveFilterUI() {
  if (currentFilter == "all") {
    allFilter.classList.add("active");
    activeFilter.classList.remove("active");
    completedFilter.classList.remove("active");
  } else if (currentFilter === "active") {
    activeFilter.classList.add("active");
    allFilter.classList.remove("active");
    completedFilter.classList.remove("active");
  } else {
    completedFilter.classList.add("active");
    allFilter.classList.remove("active");
    activeFilter.classList.remove("active");
  }
}

function countTasks() {
  const tasks = getTasksFromStorage();

  if (currentFilter == "all") {
    itemsText.innerHTML = tasks.length;
    return;
  } else if (currentFilter == "active") {
    const activeTasks = tasks.filter((task) => !task.completed).length;
    itemsText.innerHTML = activeTasks;
    return;
  } else if (currentFilter == "completed") {
    const completedTasks = tasks.filter((task) => task.completed).length;
    itemsText.innerHTML = completedTasks;
  }
}

function addTask(task, isCompleted = false) {
  const li = document.createElement("li");
  li.classList.add("task");

  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = isCompleted;

  const p = document.createElement("p");
  p.classList.add("task-name");
  p.textContent = task;

  li.appendChild(input);
  li.appendChild(p);

  taskList.appendChild(li);

  input.addEventListener("change", function () {
    toggleTask(task, input.checked, li);
    renderTasks();
  });
}

function getTasksFromStorage() {
  const tasks = localStorage.getItem("tasks");
  //if tasks inside localstorage, get tasks and parse them, if not, return empty array
  return tasks ? JSON.parse(tasks) : [];
}

function saveTask(name) {
  const tasks = getTasksFromStorage();
  tasks.push({ name, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const tasks = getTasksFromStorage();

  taskList.innerHTML = "";

  tasks.forEach((task) => {
    if (currentFilter === "active" && task.completed) return;
    if (currentFilter === "completed" && !task.completed) return;

    addTask(task.name, task.completed);
  });
}

function removeTaskFromStorage(name) {
  let tasks = getTasksFromStorage();

  tasks = tasks.filter((task) => {
    return task.name !== name;
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function toggleTask(name, isChecked, element) {
  let tasks = getTasksFromStorage();

  tasks = tasks.map((task) => {
    if (task.name === name) {
      return { ...task, completed: isChecked };
    }
    return task;
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}
