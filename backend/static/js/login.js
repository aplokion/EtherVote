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
});
