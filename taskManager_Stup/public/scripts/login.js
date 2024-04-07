const registerbtn=document.getElementById('createAccountBtn');
registerbtn.onclick=()=>{
    window.location.href="account.html";
}

function handleSubmit(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        fetch('http://localhost:3000/api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        }).then(async(res) => {
            const data=await res.json()
            const logingWarning=document.getElementById('loginWarning');
            if(!res.ok){
                if(data.message=="Wrong Password"){
                    logingWarning.textContent="Wrong Password. Please try again.";
                }if(data.message=="User not found"){
                    logingWarning.textContent="User not found. Please try again.";
                }
                throw new Error(data.message);
            }
            logingWarning.textContent="";
            const token = data.token;
            sessionStorage.setItem('jwtToken', token);
            localStorage.setItem('email',data.email);
            window.location.href = "index.html";
        }).catch(err => {
            console.log(err);
        });
    }catch(err){
        document.getElementById('errorMessage').textContent = err.message;
    }
};