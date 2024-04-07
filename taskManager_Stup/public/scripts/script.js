const storedToken = sessionStorage.getItem('jwtToken');
const email=localStorage.getItem('email');

if (storedToken) {
    console.log("Welcome!!!");
} else {
    window.location.href = "login.html";
}


const addbtn = document.getElementById('add');
const taskcont = document.getElementById('taskCont');

const dytask = `
        <input type="checkbox" id="check">
        <input type="text" value="" id="task" readonly>
        <button class="edit">
            <span class="material-symbols-outlined">edit_square</span>
        </button>
        <button class="delete">
            <span class="material-symbols-outlined">delete</span>
        </button>
`;

function addEventListenersOnTask(compcont, task_id) {
    //delte event listner
    const delbtn = compcont.querySelector('.delete');
    delbtn.addEventListener('click', () => {
        fetch('http://localhost:3000/api/v1/delete?', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'id': task_id }),
        }).then(res => {
            if (res.ok) {
                console.log("Task deleted successfully");
                compcont.remove();
            } else {
                throw new Error('Failed to delete task');
            }
        }).catch(err => {
            console.log("Error during post req - ", err);
        });
    });

    //edit event listner
    const editbtn = compcont.querySelector('.edit');
    const inpele = compcont.querySelector('#task');
    editbtn.addEventListener('click', () => {
        if (inpele.readOnly) {
            inpele.readOnly = false;
            inpele.focus();
            editbtn.innerHTML = '<span class="material-symbols-outlined">done</span>';
        } else {
            inpele.readOnly = true;
            const newdesc = inpele.value;
            fetch('http://localhost:3000/api/v1/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'id': task_id,
                    'description': newdesc,
                }),
            }).then(res => {
                if (res.ok) {
                    console.log("Task edited successfully");
                } else {
                    throw new Error('Failed to edit task');
                }
            }).catch(err => {
                console.log("Error during post req - ", err);
            });
            editbtn.innerHTML = '<span class="material-symbols-outlined">edit_square</span>';
        }
    });

    //when cheked the task will pe crossed or marked as completed
    const checkbox = compcont.querySelector('#check');
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            inpele.style.textDecoration = 'line-through';
            compcont.style.backgroundColor = "green";
            inpele.style.backgroundColor = "green";
        } else {
            inpele.style.textDecoration = 'none';
            compcont.style.backgroundColor = "white";
            inpele.style.backgroundColor = "white";
        }
    });
};

try {
    fetch(`http://localhost:3000/api/v1/tasks?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
            'Authorization': storedToken,
        }
    }).then(async (res) => {
        const data=await res.json();
        if (!res.ok) { 
            throw new Error(data.message)
        }
        console.log('Tasks retrived from the database succesfully!');
        data.forEach(task => {
            const compcont = document.createElement('div');
            let task_id;
            compcont.innerHTML = dytask;
            compcont.classList.add('tasks');
            const inpele = compcont.querySelector('#task');
            inpele.value = task.description;
            task_id = task.task_id;
            taskcont.appendChild(compcont);
            addEventListenersOnTask(compcont, task_id);
        });
    });
} catch (err) {
    document.getElementById('errorMsg').textContent=err.message;
}


addbtn.addEventListener('click', (e) => {
    e.preventDefault();
    const taskdata = document.getElementById('taskinp').value;
    const compcont = document.createElement('div');
    let task_id;
    try {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        const currdata = {
            "email": email,
            "start_date": formattedDate,
            "end_date": null,
            "description": taskdata
        };
        fetch('http://localhost:3000/api/v1/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currdata),
        }).then(data => {
            return data.json();
        }).then(res => {
            task_id = res.task_id;
            console.log(`Task called - "${taskdata}" added succesfully!`);
            compcont.innerHTML = dytask;
            compcont.classList.add('tasks');
            const inpele = compcont.querySelector('#task');
            inpele.value = taskdata;
            taskcont.appendChild(compcont);
            addEventListenersOnTask(compcont, task_id);
        }).catch(err => {
            console.error('Fetch Error:', err);
        });
    } catch (err) {
        console.log('Try-Catch Error:', err);
    }
    document.getElementById('taskinp').value = "";
});

const logoutbtn=document.getElementById('logoutButton');
logoutbtn.onclick=()=>{
    sessionStorage.removeItem('jwtToken');
    localStorage.removeItem('email');
    window.location.href="login.html";
}
