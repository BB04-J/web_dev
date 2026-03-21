// Select elements
const addBtn = document.querySelector(".add-task");
const input = document.querySelector(".input-task");
const taskList = document.querySelector(".task-list");
const clearBtn = document.querySelector(".clear-all");


// ADD TASK

addBtn.addEventListener("click", function () {
    const taskText = input.value.trim();

    if (taskText === "") return;

    createTask(taskText, false);
    saveTasks();
    checkEmptyMessage();

    input.value = "";
});
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addBtn.click();
    }
});



// CREATE TASK FUNCTION

function createTask(text, completed) {
    const li = document.createElement("li");
    li.classList.add("task-items");

    li.innerHTML = `
        <span class="items ${completed ? "completed" : ""}">${text}</span>
        <div class="task-actions">
            <button class="done">${completed ? "UNDO" : "DONE"}</button>
            <button class="remove-btn">Remove</button>
        </div>
    `;

    taskList.appendChild(li);
}



// DONE / REMOVE (EVENT DELEGATION)

taskList.addEventListener("click", function (e) {

    const taskItem = e.target.closest(".task-items");
    if (!taskItem) return;

    const text = taskItem.querySelector(".items");

    // DONE / UNDO
    if (e.target.classList.contains("done")) {
        text.classList.toggle("completed");

        if (e.target.textContent === "DONE") {
            e.target.textContent = "UNDO";
        } else {
            e.target.textContent = "DONE";
        }

        saveTasks();
    }

    // REMOVE
    if (e.target.classList.contains("remove-btn")) {
        taskItem.remove();
        saveTasks();
        checkEmptyMessage();
    }
});



// SAVE TO LOCAL STORAGE

function saveTasks() {
    const tasks = [];

    document.querySelectorAll(".task-items").forEach(task => {
        const text = task.querySelector(".items").textContent;
        const completed = task.querySelector(".items").classList.contains("completed");

        tasks.push({ text, completed });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// LOAD TASKS ON PAGE LOAD

function loadTasks() {
    const saved = localStorage.getItem("tasks");

    if (!saved) return;

    const tasks = JSON.parse(saved);

    tasks.forEach(task => {
        createTask(task.text, task.completed);
    });
}


//////////////////////////////////////
clearBtn.addEventListener("click", function () {
    taskList.innerHTML = "";
    saveTasks();
    checkEmptyMessage();
});

/////////////////////////////////////

function checkEmptyMessage() {
    const emptyMsg = document.querySelector(".empty-message");

    if (taskList.children.length === 0) {
        emptyMsg.style.display = "block";
    } else {
        emptyMsg.style.display = "none";
    }
}


// Run when page loads
loadTasks();
checkEmptyMessage();