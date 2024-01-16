const currentUrl = new URL(window.location.href);
const correctUrl = `${currentUrl['origin']}${currentUrl['pathname']}`;

document.addEventListener('DOMContentLoaded', function () {
    const registerButton = document.getElementById('tab_reg');
    const loginButton = document.getElementById('tab_login');
    const registerForm = document.getElementById('register_form');
    const loginForm = document.getElementById('login_form');
    registerButton.addEventListener('click', () =>{
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
        registerButton.style.backgroundColor = 'LightGrey';
        loginButton.style.background = 'none';
    });
    loginButton.addEventListener('click', () =>{
        registerForm.style.display = 'none';
        loginForm.style.display = 'block'
        loginButton.style.backgroundColor = 'LightGrey';
        registerButton.style.background = 'none';
    });

    const formLogin = document.querySelector("#login_form > form");
    const messageDiv = document.getElementById('message');
    formLogin.addEventListener('submit', evt => {
        messageDiv.textContent = '';
        evt.preventDefault();
        fetch(correctUrl, {
        method: 'post',
        body: new FormData(evt.target)
        }).then(resp => resp.json())
        .then(data => {
            let message = Object.keys(data)[0]
            if(message == "error"){
                messageDiv.textContent = data.error;
            } else if(message == "success"){
                window.location.href = currentUrl['origin'] + `/home`;
            }
        });
    });

    const formRegister = document.querySelector("#register_form > form");
    formRegister.addEventListener('submit', evt => {
        messageDiv.textContent = '';
        evt.preventDefault();
        fetch(currentUrl['origin'] + `/auth/register`, {
        method: 'post',
        body: new FormData(evt.target)
        }).then(resp => resp.json())
        .then(data => {
            let message = Object.keys(data)[0]
            if(message == "error"){
                messageDiv.textContent = data.error;
            } else if(message == "success"){
                messageDiv.textContent = `Success! your token: ${data.success}`;
            }
        });
    });
});
