document.onload = getTodos();

//to get all todos.
async function getTodos() {

    const resp = await fetch('/todo', { method: 'GET' })
    const todos = await resp.json()
    document.querySelector("#list").innerHTML = "";
    for (let entry of todos) {
        if (entry.done) {
            document.querySelector("#list").innerHTML += `
            <li><input type="checkbox" class="checkBox" id=${entry.id} onclick="changeStatus(this)" checked><label>${entry.task}</label></li>        
            `;
        } else {
            document.querySelector("#list").innerHTML += `
            <li><input type="checkbox" class="checkBox" id=${entry.id} onclick="changeStatus(this)" ><label>${entry.task}</label></li>        
            `;
        }
    }
}
//to add a todo
var addButton = document.getElementById("add");

addButton.onclick = async function addNewTodo(event) {
    event.preventDefault();
    var task = document.getElementById("task").value;
    console.log("task to add ", task)
    let done = JSON.parse(document.getElementById("done").value);
    //console.log("done is",done);

    const resp = await fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task, done, due: '2020-04-10' })
    })

    if (resp.status == 201) {
        getTodos();
        document.getElementById("task").value = "";
    }
    if (resp.status == 400) {
        document.getElementById("errormessage").innerHTML = "Seems you have not entered any task";
    }
}

// a function to update status.
async function changeStatus(task) {
    console.log("Status change action trigered");
    if (task.checked) {
        const resp = await fetch('/todos', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: task.id, done: true })
        })
    } else {
        const resp = await fetch('/todos/status', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: task.id, done: false })
        })
    }
}

var deleteButton = document.getElementById("clear");

deleteButton.onclick = async function deleteTask() {
    event.preventDefault();
    const resp = await fetch('/remove', {
        method: 'GET',
    })

    getTodos();
}