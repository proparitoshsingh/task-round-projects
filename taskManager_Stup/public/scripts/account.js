const loginbtn=document.getElementById('login');
loginbtn.onclick=()=>{
    window.location.href="login.html";
}

function handleSubmit(e){
    e.preventDefault();
    const username=document.getElementById('name').value;
    const password=document.getElementById('password').value;
    const email=document.getElementById('email').value;
    const repassword=document.getElementById('repassword').value;
    //const otp=document.getElementById('otp').value;

    
    try {
        fetch(`http://localhost:3000/api/v1/check?email=${encodeURIComponent(email)}&username=${username}`,{
            method:'GET',
        }).then(async(res)=>{
            const {usernameExists,emailExists}=await res.json();
            const usernameWarning=document.getElementById('usernameWarning');
            const emailWarning=document.getElementById('emailWarning');

            if(usernameExists){
                usernameWarning.textContent="This username is already taken. Please try something else 🙏"
            }else{
                usernameWarning.textContent="";
            }
            if(emailExists){
                emailWarning.textContent="This email is already registered. Please login 🙏";
            }else{
                emailWarning.textContent="";
            }
        })
    } catch (err) {
        console.log("Errors while checking for existing username and password. ",err);
    }
    
    const passwordWarning=document.getElementById('passwordWarning');
    if(password!=repassword){
        passwordWarning.textContent="Password does not match. Try again please";
    }else{
        passwordWarning.textContent="";
    }

    try {
        const creds={
            'username':username,
            'password':password,
            'email':email,
        };
        fetch('http://localhost:3000/api/v1/register',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(creds)
        }).then(async(res)=>{
            const data=await res.json();
            if(!res.ok){
                throw new Error("Error while registering new user, ",data.message);
            }
            console.log("Registerd user - ",data.username);
            setTimeout(() => {
                window.location.href="login.html";
            }, 3000);
        })
    } catch (err) {
        console.log(err);
    }

}