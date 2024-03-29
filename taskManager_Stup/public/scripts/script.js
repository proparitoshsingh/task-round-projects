const addbtn = document.getElementById('add');
const taskcontdiv=document.getElementById('taskCont');

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

addbtn.addEventListener('click', (e) => {
    e.preventDefault();
    const taskdata = document.getElementById('taskinp').value;
    const compcont=document.createElement('div');
    const taskcont=document.getElementById('taskCont');
    
    try{
        const body={}
    }catch(err){
        console.log(err);
    }


    compcont.innerHTML=dytask;
    compcont.classList.add('tasks');
    const inpele=compcont.querySelector('#task');
    inpele.value=taskdata;
    taskcont.appendChild(compcont);

    //adding delete button onclick function dynamically to newly created tasks coz foreach wont work here
    const delbtn = compcont.querySelector('.delete');
    delbtn.addEventListener('click', () => {
        compcont.remove();
    });

    //adding editing button onclick function dynamically too for same reasons
    const editbtn = compcont.querySelector('.edit');
    editbtn.addEventListener('click', () => {
        console.log('Task edited');
        if (inpele.readOnly) {
            inpele.readOnly = false;
            inpele.focus();
            editbtn.innerHTML = '<span class="material-symbols-outlined">done</span>';
        } else {
            inpele.readOnly = true;
            editbtn.innerHTML = '<span class="material-symbols-outlined">edit_square</span>';
        }
    });

    //when cheked the task will pe crossed or marked as completed
    const checkbox = compcont.querySelector('#check');
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            inpele.style.textDecoration = 'line-through';
            compcont.style.backgroundColor="green";
            inpele.style.backgroundColor="green";
        } else {
            inpele.style.textDecoration = 'none';
            compcont.style.backgroundColor="white";
            inpele.style.backgroundColor="white";
        }
    });

    console.log(`Task called - "${taskdata}" added succesfully!`);
    document.getElementById('taskinp').value="";
});


