from classes.login import LoginForm
from classes.registration import RegistrationForm
from flask import render_template, redirect, url_for, flash, request, session
from utils.mysql_actions import is_user_exist


def login():
    form_login = LoginForm()
    form_register = RegistrationForm()
    if request.method == "POST":
        if form_login.validate_on_submit():
            username = form_login.username.data
            password = form_login.password.data
            user = is_user_exist(username, password)
            if user:
                flash('Login successful!', 'success')
                session["username"] = username
                session["user_id"] = user
                return redirect(url_for('home.home'))
            else:
                flash('Invalid username or password. Please try again.', 'danger')

    if request.method == "GET":
        return render_template('login.html', form_login=form_login, form_register=form_register)
